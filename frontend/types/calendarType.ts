export type calendarCellsType = {
  id: string;
  dayOfMonth: number | string;
};
export type calendarWeekDaysType = {
  id: number;
  dayOfWeek: string;
};
export interface calendarHookType {
  nextMonth: () => void;
  prevMonth: () => void;
  calendarCells: calendarCellsType[];
  weekDays: calendarWeekDaysType[];
  fullMonth: string;
}
