import type { ClientEventSchemaType } from "../../../shared/schemas/event.schema";

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
  year: number;
  month: number;
  tasksData: Record<string, ClientEventSchemaType[]>;
  isLoading: boolean;
  isError: boolean;
  handleAddTask: (task: string, date: string) => void;
  handleUpdateTask: (updatedText: string, id: string) => void;
  handleDeleteTask: (id?: string) => void;
}
