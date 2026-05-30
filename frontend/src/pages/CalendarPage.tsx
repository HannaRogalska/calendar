import style from './CalendarPage.module.css';
import { ChevronDown, ChevronUp } from 'lucide-react';
import useCalendar from '../hooks/useCalendar';
import { changeTask, fetchTasks } from '../api/taskApi';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { type KeyboardEvent } from 'react';
import InlineInput from '../components/InlineInput';

const CalendarPage = () => {
  const { nextMonth, prevMonth, calendarCells, weekDays, fullMonth, year, month } = useCalendar();

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tasks', year, month],
    queryFn: () => fetchTasks(startDate, endDate),
  });
  const mutation = useMutation({
    mutationFn: ({ id, updatedText }: { id: string; updatedText: string }) =>
      changeTask(id, updatedText)
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading tasks...</div>;

  const onSaveInput = (e: KeyboardEvent<HTMLInputElement>, updatedText: string, id: string) => {
      mutation.mutate({ id, updatedText });
  };

  return (
    <div>
      <div className={style.container}>
        <div className={style.btn_container}>
          <button type="button" onClick={nextMonth} className={style.btn}>
            <ChevronUp />
          </button>
          <button type="button" onClick={prevMonth} className={style.btn}>
            <ChevronDown />
          </button>
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
            const cellTasks = el.callDateKey ? data?.data?.[el.callDateKey] || [] : [];
            return (
              <div key={el.id} className={style.day_cell}>
                <div>{el.dayOfMonth}</div>
                {cellTasks.map((task) => (
                  <InlineInput
                    key={task._id}
                    value={task.task}
                    onSave={(e, updatedText) => onSaveInput(e, updatedText, task._id)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
