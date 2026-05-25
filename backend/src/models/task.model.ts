import { Schema, model } from 'mongoose';
import {ITask} from '../types/task'

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: String,
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Task = model<ITask>('Task', taskSchema);
export default Task;
