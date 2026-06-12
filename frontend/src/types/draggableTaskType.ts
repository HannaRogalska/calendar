import type { ClientEventSchemaType } from '../shared/schemas/event.schema';

export interface DraggableTaskType {
  task: ClientEventSchemaType;
  handleUpdateTask: (updatedText: string, id: string) => void;
  handleDeleteTask: (id: string) => void;
}
