import { RequestHandler } from 'express';
import Task from '../models/task.model';
import mongoose from 'mongoose';
import { EventSchema, GetTasksQuerySchema } from '../../../shared/schemas/event.schema';

export const getAllTasks: RequestHandler = async (req, res, next) => {
  try {
    const scope = GetTasksQuerySchema.parse(req.query);

    const allTasks = await Task.aggregate([
      {
        $match: {
          date: {
            $gte: scope.start,
            $lt: scope.end,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          data: { $push: '$$ROOT' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    res.status(200).json({ data: allTasks });
  } catch (error) {
    next(error);
  }
};

export const createTask: RequestHandler = async (req, res, next) => {
  try {
    const parsedData = await EventSchema.parseAsync(req.body);
    const task = await Task.create(parsedData);
    res.status(201).json({ message: 'Task created', data: task });
  } catch (error) {
    next(error);
  }
};

export const changeTask: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: 'Invalid ID format' });
      return;
    }
    const parsedData = await EventSchema.partial().parseAsync(req.body);
    const task = await Task.findByIdAndUpdate(id, parsedData, { new: true });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.status(200).json({ message: 'Task updated', data: task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: 'Invalid ID format' });
      return;
    }
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};
