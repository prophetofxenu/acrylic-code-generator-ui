import { SolidMode, RainbowMode, SpectrumCycleMode, Mode } from './code-gen/modes';
import ModeList from './ModeList';

import React, { useState } from 'react';


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
      <ModeList
        modes={modes}
        setModeList={setModes}
        activeMode={activeMode}
        setActiveMode={(m) => setActiveMode(m)}
      />
    </div>
  );
}

export default App;
