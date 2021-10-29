import Color from './acg-lib/color';
import { SolidMode, RainbowMode, SpectrumCycleMode, Mode } from './acg-lib/modes';
import MenuBar from './MenuBar';
import ModeList from './ModeList';
import ModeEdit from './ModeEdit';

import React, { useState } from 'react';
import Cookies from "js-cookie";

import styles from "./App.module.scss";


const ENV = process.env.NODE_ENV;
let API_URL: string;
if (ENV && ENV === "production") {
  API_URL = process.env.REACT_APP_API_URL ?? "http://localhost:3001";
} else {
  API_URL = "http://localhost:3001";
}


function replacer(key: any, value: any) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries())
    };
  } else if (value instanceof Color) {
    return {
      dataType: "Color",
      value: {
        r: value.r,
        g: value.g,
        b: value.b
      }
    }
  } else {
    return value;
  }
}

function reviver(key: any, value: any) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    } else if (value.dataType === "Color") {
      const val = value.value;
      return Color.fromRgb(val.r, val.g, val.b);
    }
  }
  return value;
}

const testModes = [
  new SolidMode(),
  new RainbowMode(),
  new SpectrumCycleMode()
];

function App() {

  const [init, setInit] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [modes, setModes] = useState(testModes);
  const [activeMode, setActiveMode] = useState<Mode | null>(null);

  const save = () => {
    const json = JSON.stringify(modes, replacer);
    Cookies.set("modelist", json, { secure: true, sameSite: "strict" });
    setStatusMsg("Saved!");
  };

  const load = () => {
    const json = Cookies.get("modelist") as string;
    if (json === undefined) return;
    setModes(JSON.parse(json, reviver));
    setStatusMsg("Loaded!");
  };

  const compile = async () => {
    save();
    const body = JSON.stringify(modes, replacer);
    let res = await fetch(`${API_URL}/api/compile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: body
    });
    const packageName = (await res.json()).packageName;
    res = await fetch(`${API_URL}/api/download/${packageName}`);
    // holy shit this sucks
    const url = window.URL.createObjectURL(await res.blob());
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", packageName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (!init) {
    load();
    setInit(true);
  }

  return (
    <div className="acg-app">
      <MenuBar save={save} load={load} compile={compile} statusMsg={statusMsg}/>
      <div className={styles.modeMenu}>
        <ModeList
          modes={modes}
          setModeList={setModes}
          activeMode={activeMode}
          setActiveMode={(m) => setActiveMode(m)}
        />
        {activeMode !== null &&
        <ModeEdit mode={activeMode} />
        }
      </div>
    </div>
  );
}

export default App;
