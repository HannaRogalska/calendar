import type { ClientEventSchemaType } from "../../../shared/schemas/event.schema";

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
}

export type DroppableData = {
  date: string | null;
};
