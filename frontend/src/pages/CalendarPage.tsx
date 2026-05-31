import style from './CalendarPage.module.css';
import { ChevronDown, ChevronUp } from 'lucide-react';
import useCalendar from '../hooks/useCalendar';
import InlineInput from '../components/InlineInput';
import Button from '../components/Button';
import { Trash2 } from 'lucide-react';

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
  } = useCalendar();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading tasks...</div>;

  return (
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
              <div key={el.id} className={style.day_cell}>
                <div>{el.dayOfMonth}</div>
                {cellTasks.map((task) => (
                  <div key={task._id}>
                    <InlineInput
                      value={task.task}
                      onSave={(updatedText) => handleUpdateTask(updatedText, task._id)}
                    />
                    <Button id={task._id} fn={handleDeleteTask}>
                      <Trash2 />
                    </Button>
                  </div>
                ))}
                <div>
                  <InlineInput
                    value=""
                    isCreation={true}
                    onSave={(text) => el.callDateKey && handleAddTask(text, el.callDateKey)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
