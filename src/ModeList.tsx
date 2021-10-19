import { Mode } from './code-gen/modes';

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import styles from './App.module.scss';


interface ModeListItemProps { 
  mode: Mode,
  index: number
}

function ModeListItem({ mode, index }: ModeListItemProps) {
  return (
    <Draggable key={mode.Id} draggableId={mode.Id} index={index}>
      {(provided) => (
        <div className={styles.modeListDraggable}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <h3 className={styles.modeListModeName}>{mode.Name}</h3>
        </div>
      )}
    </Draggable>
  )
}

interface ModeListProps {
  modes: Mode[],
  setModeList: (modes: Mode[]) => void
}

export default function ModeList({ modes, setModeList }: ModeListProps) {

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
                <ModeListItem mode={mode} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
