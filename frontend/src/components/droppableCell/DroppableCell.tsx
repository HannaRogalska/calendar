import { useDroppable } from '@dnd-kit/react';
import type { DroppableCellType } from '../../types/droppableCellType';
import DraggableTask from '../draggableTask/DraggableTask';
import InlineInput from '../InlineInput/InlineInput';
import style from './DroppableCell.module.css';
import SortableItemWrapper from './../SortableItemWrapper';
import { useState } from 'react';
import { SquarePen } from 'lucide-react';


const DroppableCell = ({
  cell,
  cellTasks,
  holiday,
  handleUpdateTask,
  handleDeleteTask,
  handleAddTask,
}: DroppableCellType) => {
  const isValidDay = Boolean(cell.callDateKey);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCliked, setIsCliked] = useState(false);

  const { ref } = useDroppable({
    id: cell.id,
    disabled: !isValidDay,
    data: {
      date: cell.callDateKey || null,
    },
  });

  const handleCellClick = () => {
    if (window.innerWidth <= 768 && isValidDay) {
      setIsModalOpen(true);
    }
  };
  return (
    <>
      <div ref={ref} className={style.day_cell} onClick={handleCellClick}>
        {isValidDay && (
          <div className={style.cell_header}>
            <div className={style.day_number}>{Number(cell.dayOfMonth)}</div>
            {holiday && (
              <div className={style.holiday_tag} title={holiday.localName}>
                🎈 <span className={style.holiday_text}>{holiday.name}</span>
              </div>
            )}
          </div>
        )}
        <div className={style.tasks_container}>
          {cellTasks.map((task, index) => (
            <SortableItemWrapper key={task._id} id={task._id} index={index}>
              <DraggableTask
                task={task}
                handleUpdateTask={handleUpdateTask}
                handleDeleteTask={handleDeleteTask}
              />
            </SortableItemWrapper>
          ))}
        </div>
        {cellTasks.length > 0 && (
          <div className={style.dots_container}>
            {cellTasks.slice(0, 3).map((task) => (
              <div key={task._id} className={style.dot} />
            ))}
          </div>
        )}

        {isValidDay && (
          <div className={style.input_wrapper}>
            {!isCliked ? (
              <SquarePen className={style.icon} onClick={() => setIsCliked(true)} />
            ) : (
              <InlineInput
                value=""
                isCreation={true}
                setIsCliked={setIsCliked}
                onSave={(text) => cell.callDateKey && handleAddTask(text, cell.callDateKey)}
              />
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          className={style.modal_overlay}
          onClick={() => setIsModalOpen(false)}
          data-no-dnd="true"
        >
          <div className={style.modal_content} onClick={(e) => e.stopPropagation()}>
            <div className={style.modal_header}>
              <h3>Day {cell.dayOfMonth}</h3>
              <button className={style.close_btn} onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
            </div>

            {holiday && <div className={style.modal_holiday}>🎈 {holiday.name}</div>}

            <div className={style.modal_tasks}>
              {cellTasks.length === 0 ? (
                <p className={style.no_tasks}>There are no tasks for this day</p>
              ) : (
                cellTasks.map((task) => (
                  <DraggableTask
                    key={task._id}
                    task={task}
                    handleUpdateTask={handleUpdateTask}
                    handleDeleteTask={handleDeleteTask}
                  />
                ))
              )}
            </div>

            <div className={style.modal_input}>
              <InlineInput
                value=""
                isCreation={true}
                setIsCliked={setIsCliked}
                onSave={(text) => {
                  if (cell.callDateKey) {
                    handleAddTask(text, cell.callDateKey);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DroppableCell;
