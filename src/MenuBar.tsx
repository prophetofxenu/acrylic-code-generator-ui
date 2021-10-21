import { LookupAddress } from "dns";
import styles from "./App.module.scss";


interface MenuBarProps {
  save: () => void;
  load: () => void;
  compile: () => void;
  statusMsg?: string;
}

export default function MenuBar({ save, load, compile, statusMsg }: MenuBarProps) {
  return (
    <div className={styles.menuBar}>
      <button type="button" className={styles.button}
        onClick={save}
      >Save</button>
      <button type="button" className={styles.button}
        onClick={load}
      >Load</button>
      <button type="button" className={styles.button}
        onClick={compile}
      >Compile</button>
      {statusMsg !== undefined &&
      <h4>{statusMsg}</h4>
      }
    </div>
  );
}
