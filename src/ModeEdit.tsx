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
