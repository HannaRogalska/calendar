import type { ClientEventSchemaType } from '../shared/schemas/event.schema';
import { type NagerHoliday } from '../shared/nager/nagerType';

export interface CalendarCellStructure {
  id: string;
  dayOfMonth: number | string;
  callDateKey?: string;
}
export interface DroppableCellType {
  cell: CalendarCellStructure;
  cellTasks: ClientEventSchemaType[];
  handleUpdateTask: (updatedText: string, id: string) => void;
  handleDeleteTask: (id: string) => void;
  handleAddTask: (text: string, dateKey: string) => void;
  holiday?: NagerHoliday;
}

export type DroppableData = {
  date: string | null;
};
