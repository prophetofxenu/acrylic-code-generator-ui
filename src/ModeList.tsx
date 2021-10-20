import { SolidMode, Mode, CandleMode, MarqueeMode, RainbowMode, SpectrumCycleMode } from './code-gen/modes';

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import styles from './App.module.scss';
import React, { useRef } from 'react';


interface ModeListItemProps { 
  mode: Mode,
  index: number,
  isActive: boolean,
  setActive: () => void
}

function ModeListItem({ mode, index, isActive, setActive }: ModeListItemProps) {
  let divStyle: string;
  if (isActive)
    divStyle = styles.modeListDraggableActive;
  else
    divStyle = styles.modeListDraggable;
  return (
    <Draggable key={mode.Id} draggableId={mode.Id} index={index}>
      {(provided) => (
        <div className={divStyle}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onClick={setActive}
        >
          <h3 className={styles.modeListModeName}>{mode.Name}</h3>
        </div>
      )}
    </Draggable>
  )
}

interface ModeListEditorProps {
  addMode: (m: string) => void,
  deleteSelectedMode: () => void
}

function ModeListEditor({ addMode, deleteSelectedMode }: ModeListEditorProps) {

  const selectRef = useRef<HTMLSelectElement>(null);

  return (
    <div className={styles.modeListEditor}>
      <label htmlFor="addMode">Add mode:</label>
      <select name="addMode" className={styles.select} ref={selectRef}>
        <option value="solid">Solid</option>
        <option value="candle">Candle</option>
        <option value="marquee">Marquee</option>
        <option value="rainbow">Rainbow</option>"
        <option value="spectrumcycle">Spectrum Cycle</option>
      </select>
      <button type="button" className={styles.button}
        onClick={() => {
          const val = selectRef.current?.value;
          if (val === undefined) return;
          addMode(val);
        }}
      >Add</button>
      <br />
      <button type="button" className={styles.button}
        onClick={deleteSelectedMode}
      >Delete Selected</button>
    </div>
  )
}

interface ModeListProps {
  modes: Mode[],
  setModeList: (modes: Mode[]) => void,
  activeMode: Mode | null,
  setActiveMode: (mode: Mode | null) => void
}

export default function ModeList({ modes, setModeList, activeMode, setActiveMode }: ModeListProps) {

  const addMode = (m: string) => {
    const arr = Array.from(modes);
    let mode: Mode;
    switch(m) {
      case "solid":
        mode = new SolidMode();
        arr.push(mode);
        setModeList(arr);
        setActiveMode(mode);
        break;
      case "candle":
        mode = new CandleMode();
        arr.push(mode);
        setModeList(arr);
        setActiveMode(mode);
        break;
      case "marquee":
        mode = new MarqueeMode();
        arr.push(mode);
        setModeList(arr);
        setActiveMode(mode);
        break;
      case "rainbow":
        mode = new RainbowMode();
        arr.push(mode);
        setModeList(arr);
        setActiveMode(mode);
        break;
      case "spectrumcycle":
        mode = new SpectrumCycleMode();
        arr.push(mode);
        setModeList(arr);
        setActiveMode(mode);
        break;
      default:
        throw Error(`${m} not implemented`);
    }
  };

  const deleteSelectedMode = () => {
    if (activeMode === null) return;
    const arr = Array.from(modes);
    const idx = arr.indexOf(activeMode);
    arr.splice(idx, 1);
    setModeList(arr);
    setActiveMode(null);
  };

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId &&
        destination.index === source.index) return;
    const mode = modes[source.index];
    const newModes = Array.from(modes);
    newModes.splice(source.index, 1);
    newModes.splice(destination.index, 0, mode);
    setModeList(newModes);
  };

  return (
    <div className={styles.modeList}>
      <h2 className={styles.modeListHeading}><b>Modes</b></h2>
      <ModeListEditor addMode={addMode} deleteSelectedMode={deleteSelectedMode}/>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="mode-list-droppable">
          {(provided) => (
            <div className="mode-list-dropable-div"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {modes.map((mode, index) => (
                <ModeListItem
                  mode={mode}
                  index={index}
                  isActive={mode === activeMode}
                  setActive={() => setActiveMode(mode)}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
