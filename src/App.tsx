import { SolidMode, RainbowMode, SpectrumCycleMode, Mode } from './code-gen/modes';
import ModeList from './ModeList';
import ModeEdit from './ModeEdit';

import React, { useState } from 'react';

import styles from "./App.module.scss";


const testModes = [
  new SolidMode(),
  new RainbowMode(),
  new SpectrumCycleMode()
];

function App() {

  const [modes, setModes] = useState(testModes);
  const [activeMode, setActiveMode] = useState<Mode | null>(null);

  return (
    <div className="acg-app">
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
