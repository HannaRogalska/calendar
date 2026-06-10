import { Schema, model } from 'mongoose';
import { ZodTaskType } from '../../../shared/schemas/event.schema';

const taskSchema = new Schema(
  {
    task: { type: String, required: true, trim: true },
    isCompleted: { type: Boolean, default: false },
    date: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Task = model<ZodTaskType>('Task', taskSchema);
export default Task;
