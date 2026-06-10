import { useDroppable } from '@dnd-kit/react';
import type { DroppableCellType } from '../types/droppableCellType';
import DraggableTask from './DraggableTask';
import InlineInput from './InlineInput';
import style from '../pages/CalendarPage.module.css';
import SortableItemWrapper from './SortableItemWrapper';

const DroppableCell = ({
  cell,
  cellTasks,
  handleUpdateTask,
  handleDeleteTask,
  handleAddTask,
}: DroppableCellType) => {
  const { ref } = useDroppable({
    id: cell.callDateKey || cell.id,
    data: {
      date: cell.callDateKey,
    },
  });

  return (
    <div ref={ref} className={style.day_cell}>
      <div>{cell.dayOfMonth}</div>
        {cellTasks.map((task, index) => (
          <SortableItemWrapper key={task._id} id={task._id} index={index}>
            <DraggableTask
              key={task._id}
              task={task}
              handleUpdateTask={handleUpdateTask}
              handleDeleteTask={handleDeleteTask}
            />
          </SortableItemWrapper>
        ))}

      <div>
        <InlineInput
          value=""
          isCreation={true}
          onSave={(text) => cell.callDateKey && handleAddTask(text, cell.callDateKey)}
        />
      </div>
    </div>
  );
};

export default DroppableCell;
