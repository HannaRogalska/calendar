import { Schema, model } from 'mongoose';
import {ZodTaskType} from '../../../shared/schemas/event.schema'

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: String,
    isCompleted: { type: Boolean, default: false },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

const Task = model<ZodTaskType>('Task', taskSchema);
export default Task;
