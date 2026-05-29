export type calendarCells = {
  id: string;
  dayOfMonth: number | string;
  callDateKey?: string
};
export type calendarWeekDays = {
  id: number;
  dayOfWeek: string;
};
export interface calendarHook {
  nextMonth: () => void;
  prevMonth: () => void;
  calendarCells: calendarCells[];
  weekDays: calendarWeekDays[];
  fullMonth: string;
  year: number,
  month: number
}
