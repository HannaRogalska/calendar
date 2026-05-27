import { useState, useMemo } from 'react';
import type { calendarHook, calendarCells } from '../types/calendarType';

const WEEK_DAYS = Array.from({ length: 7 }, (_, i) => {
  const tempDate = new Date(2024, 0, 1 + i); // 1 Jan 2024 - Monday
  return { id: i, dayOfWeek: tempDate.toLocaleString('en-US', { weekday: 'short' }) };
});

const useCalendar = (): calendarHook => {
  const [nowDate, setNowDate] = useState(new Date());
  const year = nowDate.getFullYear();
  const month = nowDate.getMonth() + 1;

  // Get the full text representation of the current month (e.g., "May")
  const fullMonth = nowDate.toLocaleString('en-US', { month: 'long' });

  // Handler to switch to the first day of the next month
  const nextMonth = () => {
    setNowDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  // Handler to switch to the first day of the previous month
  const prevMonth = () => {
    setNowDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const calendarCells = useMemo(() => {
    const cells: calendarCells[] = [];
    // Get total days in the current month by requesting day 0 of the next month
    const daysInMonth = new Date(year, month, 0).getDate();
    // Find the weekday of the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayDate = new Date(year, month - 1, 1);
    const startDayOfWeek = firstDayDate.getDay();
    // Calculate leading empty cells to align Monday as the first column (0 = Mon, 6 = Sun)
    const leadingEmptyDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    // Fill the grid with empty strings for the days before the 1st of the month
    for (let i = 0; i < leadingEmptyDays; i++) {
      cells.push({ id: `empty-start-${year}-${month}-${i}`, dayOfMonth: '' });
    }

    // Fill the grid with the actual day numbers of the month
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({ id: `day-${year}-${month}-${i}`, dayOfMonth: i });
    }
    // Calculate trailing empty cells needed to complete the final row of 7 columns
    const trailingEmptyDays = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);

    // Fill the grid with empty strings for the remaining spaces of the last week
    for (let i = 0; i < trailingEmptyDays; i++) {
      cells.push({ id: `empty-end-${year}-${month}-${i}`, dayOfMonth: '' });
    }

    return cells;
  }, [year, month]);

  return {
    nextMonth,
    prevMonth,
    calendarCells,
    weekDays: WEEK_DAYS,
    fullMonth,
  };
};

export default useCalendar;
