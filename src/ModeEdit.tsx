import { Mode } from "./code-gen/modes";
import Color from "./code-gen/color";

import { ColorPicker, toColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";

import styles from "./App.module.scss";
import { useState } from "react";


function useForceUpdate() {
  const [, setValue] = useState(0);
  return () => setValue(value => value + 1);
}


interface ColorEditProps {
  color: Color;
  setColor: (c: Color) => void;
}

function ColorEdit({ color, setColor }: ColorEditProps) {

  const col = toColor("hex", "#" + color.toString());
  const onChange = (c: any) => {
    color.r = c.rgb.r;
    color.g = c.rgb.g;
    color.b = c.rgb.b;
    setColor(color);
  };

  return (
    <div className={styles.colorEdit}>
      <ColorPicker width={350} height={100} color={col} onChange={onChange} dark />
    </div>
  );
}

interface ColorListEditProps {
  colorList: Color[];
  setList: (cl: Color[]) => void;
}

function ColorListEdit({ colorList, setList }: ColorListEditProps) {

  const maxColors = 10;

  const forceUpdate = useForceUpdate();

  const [idx, setIdx] = useState(0);
  const currentColor = colorList[idx];
  const col = toColor("hex", "#" + currentColor.toString());

  const add = () => {
    if (colorList.length === maxColors) return;
    const color = Color.fromRgb(255, 0, 0);
    colorList.push(color);
    setIdx(colorList.length - 1);
  };

  const del = () => {
    if (colorList.length === 1) return;
    colorList.splice(idx, 1);
    if (idx !== 0) {
      setIdx(idx - 1);
    } else {
      forceUpdate();
    }
  };

  const pickerOnChange = (c: any) => {
    currentColor.r = c.rgb.r;
    currentColor.g = c.rgb.g;
    currentColor.b = c.rgb.b;
    forceUpdate();
  };

  return (
    <div className={styles.colorListEdit}>
      <h4>{colorList.length} colors in list ({maxColors} max)</h4>
      <div className={styles.colorListEditHeader}>
        <label htmlFor="colorIndex">Color:</label>
        <input className={styles.textInput} type="number" name="colorIndex" value={idx}
          onChange={(e) => {
            const newIdx = new Number(e.target.value).valueOf();
            if (newIdx < 0 || newIdx >= colorList.length) return;
            setIdx(newIdx);
          }}
        />
        <button className={styles.button} type="button" onClick={add}>Add</button>
        <button className={styles.button} type="button" onClick={del}>Delete</button>
      </div>
      <ColorPicker width={350} height={100} color={col} onChange={pickerOnChange} dark />
    </div>
  )
}

interface NumEditProps {
  label: string;
  unit?: string;
  num: number;
  setNum: (n: number) => void;
}

function NumEdit({ label, unit, num, setNum }: NumEditProps) {
  
  const name = `${label.toLowerCase()}NumEdit`;

  return (
    <div className={styles.numEdit}>
      <label htmlFor={name}>{label}</label>
      <input type="number" name={name} value={num}
        onChange={(e) => setNum(new Number(e.target.value).valueOf())}
      />
      {unit &&
      <p>{unit}</p>
      }
    </div>
  );

}

interface ModeEditProps {
  mode: Mode;
}

export default function ModeEdit({ mode }: ModeEditProps) {

  const forceUpdate = useForceUpdate();

  const paramComponents: any = [];
  for (const [k, v] of mode.Params) {
    if (v.Type === "color") {
      const color = mode.Values.get(k) as Color;
      paramComponents.push(
        <>
          <div className={styles.paramTitle}>
            <h4>{v.Name}</h4>
            <button type="button" className={styles.button}
              onClick={() => {
                const def = v.Default as Color;
                const color = Color.fromString(def.toString());
                mode.Values.set(k, color);
                forceUpdate();
              }}
            >Reset</button>
          </div>
          <ColorEdit color={color} 
            setColor={(c) => {
              mode.Values.set(k, c);
              forceUpdate();
            }}
          />
        </>
      );
    } else if (v.Type === "colorlist") {
      const colorList = mode.Values.get(k) as Color[];
      paramComponents.push(
        <>
          <div className={styles.paramTitle}>
            <h4>{v.Name}</h4>
            <button type="button" className={styles.button}
              onClick={() => {
                const def = v.Default as Color[];
                const colorList = Array.from(def);
                mode.Values.set(k, colorList);
                forceUpdate();
              }}
            >Reset</button>
          </div>
          <ColorListEdit colorList={colorList}
            setList={(cl) => {
              mode.Values.set(k, cl);
              forceUpdate();
            }}
          />
        </>
      )
    } else if (v.Type === "num") {
      const num = mode.Values.get(k) as number;
      paramComponents.push(
        <>
          <div className={styles.paramTitle}>
            <h4>{v.Name}</h4>
            <button type="button" className={styles.button}
              onClick={() => {
                mode.Values.set(k, v.Default);
                forceUpdate();
              }}
            >Reset</button>
          </div>
          <NumEdit label={v.Name} num={num} unit="ms"
            setNum={(n) => {
              mode.Values.set(k, n);
              forceUpdate();
            }}
          />
        </>
      );
    }
  }

  return (
    <div className={styles.modeEdit}>
      <h2>{mode.Name}</h2>
      <h4>{mode.Description}</h4>
      <label htmlFor="modeName">Mode Name:</label>
      <input type="text" name="modeName" className={styles.textInput}
        value={mode.Name}
        onChange={(e) => {
          const name = e.target.value;
          if (name.length === 0 || name.length > 20) return;
          mode.Name = name;
          forceUpdate();
        }}
      />
      {paramComponents.length === 0 &&
      <h4>{mode.Name} does not take any parameters.</h4>
      }
      {paramComponents.length > 0 &&
      paramComponents
      }
    </div>
  );
}
