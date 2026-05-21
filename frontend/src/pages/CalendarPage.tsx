import style from './CalendarPage.module.css';
import { ChevronDown, ChevronUp } from 'lucide-react';
import useCalendar from '../../hooks/useCalendar';

const CalendarPage = () => {
  const { nextMonth, prevMonth, calendarCells, weekDays, fullMonth } =
    useCalendar();

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
          {calendarCells.map((el) => (
            <div key={el.id} className={style.day_cell}>
              {el.dayOfMonth}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
