import { Mode } from './code-gen/modes';

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import styles from './App.module.scss';


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

interface ModeListProps {
  modes: Mode[],
  setModeList: (modes: Mode[]) => void,
  activeMode: Mode | null,
  setActiveMode: (mode: Mode) => void
}

export default function ModeList({ modes, setModeList, activeMode, setActiveMode }: ModeListProps) {

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
