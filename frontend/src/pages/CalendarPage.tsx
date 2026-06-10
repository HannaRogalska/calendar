import style from './CalendarPage.module.css';
import { ChevronDown, ChevronUp } from 'lucide-react';
import useCalendar from '../hooks/useCalendar';
import { DragDropProvider } from '@dnd-kit/react';
import { Feedback } from '@dnd-kit/dom';
import Button from '../components/Button';
import DroppableCell from '../components/DroppableCell';

const CalendarPage = () => {
  const {
    nextMonth,
    prevMonth,
    calendarCells,
    weekDays,
    fullMonth,
    tasksData,
    isLoading,
    isError,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    handleUpdateTaskDate,
  } = useCalendar();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading tasks...</div>;

  return (
    <DragDropProvider
      plugins={(defaults) => [
        ...defaults,
        Feedback.configure({
          dropAnimation: null,
        }),
      ]}
      onDragEnd={(event) => {
        if (event.canceled) return;

        const { source, target } = event.operation;
        if (!source || !target) return;

        const taskId = source.id as string;
        let newDate = '';
        let newIndex = 0;

        Object.keys(tasksData).forEach((dateKey) => {
          const foundIdx = tasksData[dateKey].findIndex((t) => t._id === target.id);
          if (foundIdx !== -1) {
            newDate = dateKey;
            newIndex = foundIdx;
          }
        });

        if (!newDate) {
          const targetIdStr = target.id as string;

          if (targetIdStr.startsWith('empty-')) return;

          if (targetIdStr.startsWith('day-')) {
            newDate = targetIdStr.replace('day-', '');
          } else {
            const targetData = target.data as { date?: string };
            newDate = targetData?.date || targetIdStr;
          }

          const targetDayTasks = tasksData[newDate] || [];
          newIndex = targetDayTasks.length;
        }
        if (!taskId || !newDate) return;

        handleUpdateTaskDate(taskId, newDate, newIndex);
      }}
    >
      <div>
        <div className={style.container}>
          <div className={style.btn_container}>
            <Button fn={nextMonth} className={style.btn}>
              <ChevronUp />
            </Button>
            <Button fn={prevMonth} className={style.btn}>
              <ChevronDown />
            </Button>
          </div>
          <div>
            <h2>{fullMonth}</h2>
          </div>
        </div>

        <div>
          <div className={style.weeks_box}>
            {weekDays.map((el) => (
              <div key={el.id}>{el.dayOfWeek}</div>
            ))}
          </div>
          <div className={style.grid_for_month}>
            {calendarCells.map((el) => {
              const cellTasks = el.callDateKey ? tasksData[el.callDateKey] || [] : [];
              return (
                <DroppableCell
                  key={el.id}
                  cell={el}
                  cellTasks={cellTasks}
                  handleAddTask={handleAddTask}
                  handleUpdateTask={handleUpdateTask}
                  handleDeleteTask={handleDeleteTask}
                />
              );
            })}
          </div>
        </div>
      </div>
    </DragDropProvider>
  );
};

export default CalendarPage;
