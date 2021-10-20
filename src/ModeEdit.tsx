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
  num: number;
  setNum: (n: number) => void
}

function NumEdit({ label, num, setNum }: NumEditProps) {
  
  const name = `${label.toLowerCase()}NumEdit`;

  return (
    <div className={styles.numEdit}>
      <label htmlFor={name}>{label}</label>
      <input type="number" name={name} value={num}
        onChange={(e) => setNum(new Number(e.target.value).valueOf())}
      />
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
          <h4>{v.Name}</h4>
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
          <h4>{v.Name}</h4>
          <NumEdit label={v.Name} num={num}
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
      {paramComponents.length === 0 &&
      <h4>{mode.Name} does not take any parameters.</h4>
      }
      {paramComponents.length > 0 &&
      paramComponents
      }
    </div>
  );
}
