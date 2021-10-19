import { SolidMode, RainbowMode, SpectrumCycleMode } from './code-gen/modes';
import ModeList from './ModeList';

import React, { useState } from 'react';
import logo from './logo.svg';

import styles from './App.module.scss';


const testModes = [
  new SolidMode(),
  new RainbowMode(),
  new SpectrumCycleMode()
];

function App() {

  const [modes, setModes] = useState(testModes);
  const [activeMode, setActiveMode] = useState(null);

  return (
    <div className="acg-app">
      <ModeList modes={modes} setModeList={setModes} />
    </div>
  );
}

export default App;
