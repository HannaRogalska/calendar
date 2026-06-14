import style from './CalendarPage.module.css';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import useCalendar from '../hooks/useCalendar';
import { DragDropProvider } from '@dnd-kit/react';
import { Feedback } from '@dnd-kit/dom';
import Button from '../components/button/Button';
import DroppableCell from '../components/droppableCell/DroppableCell';
import type { DroppableData } from '../types/droppableCellType';
import { useHolidays } from '../hooks/useHolidays';
import { type NagerHoliday } from '../shared/nager/nagerType';
import { useState } from 'react';

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
    year,
    month,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    handleUpdateTaskDate,
  } = useCalendar();
  const { data: holidays } = useHolidays('PL', year, month - 1);

  const [searchTerm, setSearchTerm] = useState('');

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
        const targetId = target.id as string;

        if (taskId === targetId) return;

        let newDate: string | null = null;

        for (const dateKey of Object.keys(tasksData)) {
          const isTask = tasksData[dateKey]?.some((t) => t._id === targetId);

          if (isTask) {
            newDate = dateKey;
            break;
          }
        }

        if (!newDate) {
          if (targetId.startsWith('day-')) {
            newDate = targetId.replace('day-', '');
          } else {
            newDate = (target.data as DroppableData)?.date || null;
          }
        }

        if (!newDate) return;

        const dayTasks = tasksData[newDate] || [];

        const filtered = dayTasks.filter((t) => t._id !== taskId);

        let insertIndex = filtered.length;

        for (let i = 0; i < filtered.length; i++) {
          if (filtered[i]._id === targetId) {
            insertIndex = i;
            break;
          }
        }
        handleUpdateTaskDate(taskId, newDate, insertIndex);
      }}
    >
      <div>
        <div className={style.container}>
          <div className={style.search_container}>
            <div className={style.btn_container}>
              <Button fn={nextMonth} className={style.btn} aria-label="Next month">
                <ChevronUp />
              </Button>
              <Button fn={prevMonth} className={style.btn} aria-label="Previous month">
                <ChevronDown />
              </Button>
            </div>
            <div className={style.search_wrapper}>
              <Search className={style.search_icon} size={16} />
              <input
                type="text"
                aria-label="Search tasks"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={style.input}
              />
            </div>
          </div>

          <div>
            <h2 className={style.year}>
              <span className={style.month}>{fullMonth}</span>
              <span>{year}</span>
            </h2>
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

              const filteredTasks =
                searchTerm.trim() === ''
                  ? cellTasks
                  : cellTasks.filter((e) =>
                      e.task.toLowerCase().includes(searchTerm.toLowerCase())
                    );
              const cellHoliday = holidays?.find((h: NagerHoliday) => {
                return h.date === el.callDateKey;
              });
              return (
                <DroppableCell
                  key={el.id}
                  cell={el}
                  cellTasks={filteredTasks}
                  handleAddTask={handleAddTask}
                  holiday={cellHoliday}
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
