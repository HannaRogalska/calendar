import { useDroppable } from '@dnd-kit/react';
import type { DroppableCellType } from '../../types/droppableCellType';
import DraggableTask from '../draggableTask/DraggableTask';
import InlineInput from '../InlineInput/InlineInput';
import style from './DroppableCell.module.css'
import SortableItemWrapper from './../SortableItemWrapper';

const DroppableCell = ({
  cell,
  cellTasks,
  holiday,
  handleUpdateTask,
  handleDeleteTask,
  handleAddTask,
}: DroppableCellType) => {
  const isValidDay = Boolean(cell.callDateKey);

  const { ref } = useDroppable({
    id: cell.id,
    disabled: !isValidDay,
    data: {
      date: cell.callDateKey || null,
    },
  });

  return (
    <div ref={ref} className={style.day_cell}>
      <div>{cell.dayOfMonth}</div>
      {holiday && (
        <div className={style.holiday_tag} title={holiday.localName}>
          🎈 {holiday.name}
        </div>
      )}
      {cellTasks.map((task, index) => (
        <SortableItemWrapper key={task._id} id={task._id} index={index}>
          <DraggableTask
            task={task}
            handleUpdateTask={handleUpdateTask}
            handleDeleteTask={handleDeleteTask}
          />
        </SortableItemWrapper>
      ))}

      {isValidDay && (
        <div>
          <InlineInput
            value=""
            isCreation={true}
            onSave={(text) => cell.callDateKey && handleAddTask(text, cell.callDateKey)}
          />
        </div>
      )}
    </div>
  );
};

export default DroppableCell;
