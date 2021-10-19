import { Mode } from "./code-gen/modes";

import styles from "./App.module.scss";

interface ModeEditProps {
  mode: Mode;
}

export default function ModeEdit({ mode }: ModeEditProps) {
  return (
    <div className={styles.modeEdit}>
      <h2>{mode.Name}</h2>
      <h4>{mode.Description}</h4>
    </div>
  );
}
