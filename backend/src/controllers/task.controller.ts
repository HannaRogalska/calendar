import { RequestHandler } from 'express';
import Task from '../models/task.model';
import mongoose from 'mongoose';
import {
  BackendCreateEventSchema,
  GetTasksQuerySchema,
} from '../../../shared/schemas/event.schema';

export const getAllTasks: RequestHandler = async (req, res, next) => {
  try {
    const scope = GetTasksQuerySchema.parse(req.query);

    const tasks = await Task.find({
      date: { $gte: scope.start, $lte: scope.end },
    }).sort({ date: 1, order: 1 });
    const allTasks = tasks.reduce((acc: Record<string, any[]>, task) => {
      let dateKey = '';

      if (task.date instanceof Date) {
        const year = task.date.getFullYear();
        const month = String(task.date.getMonth() + 1).padStart(2, '0');
        const day = String(task.date.getDate()).padStart(2, '0');
        dateKey = `${year}-${month}-${day}`;
      } else if (task.date) {
        const dateStr = String(task.date);
        dateKey = dateStr.split('T')[0];
      }

      if (dateKey) {
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(task);
      }
      return acc;
    }, {});

    res.status(200).json({ data: allTasks });
  } catch (error) {
    next(error);
  }
};

export const createTask: RequestHandler = async (req, res, next) => {
  try {
    const parsedData = await BackendCreateEventSchema.parseAsync(req.body);
    if (parsedData.date) {
      parsedData.date = new Date(parsedData.date).toISOString().split('T')[0] as any;
    }
    const tasksCount = await Task.countDocuments({ date: parsedData.date });
    const task = await Task.create({
      ...parsedData,
      order: tasksCount,
    });
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
    const parsedData = await BackendCreateEventSchema.partial().parseAsync(req.body);
    const task = await Task.findByIdAndUpdate(id, parsedData, { returnDocument: 'after' });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    const responseData = task.toObject();
    if (responseData.date) {
      (responseData as any).date = new Date(responseData.date).toISOString().split('T')[0];
    }

    res.status(200).json({ message: 'Task updated', data: responseData });
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

    const deletedDate = task.date;
    const deletedOrder = typeof task.order === 'number' ? task.order : 0;

    if (deletedDate) {
      await Task.updateMany(
        { date: deletedDate, order: { $gt: deletedOrder } },
        { $inc: { order: -1 } }
      );
    }

    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

export const changeTaskDate: RequestHandler = async (req, res, next) => {
  try {
    const { date, order } = req.body;
    const { id } = req.params;

    const cleanDate = new Date(date).toISOString().split('T')[0];
    const targetIndex = Number(order) || 0;

    const task = await Task.findById(id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const oldDate =
      task.date instanceof Date
        ? task.date.toISOString().split('T')[0]
        : String(task.date).split('T')[0];

    const sameDay = oldDate === cleanDate;

    // SAME DAY

    if (sameDay) {
      const tasks = await Task.find({ date: cleanDate }).sort({ order: 1 });

      const without = tasks.filter((t) => t._id.toString() !== id);

      const safeIndex = Math.max(0, Math.min(targetIndex, without.length));

      const reordered = [...without.slice(0, safeIndex), task, ...without.slice(safeIndex)];

      await Promise.all(
        reordered.map((t, idx) =>
          Task.findByIdAndUpdate(t._id, {
            $set: {
              order: idx,
              date: cleanDate,
            },
          })
        )
      );

      return res.status(200).json({ message: 'reordered' });
    }

    // MOVE BETWEEN DAYS

    const oldTasks = await Task.find({ date: oldDate }).sort({ order: 1 });
    const newTasks = await Task.find({ date: cleanDate }).sort({ order: 1 });

    const oldWithout = oldTasks.filter((t) => t._id.toString() !== id);

    const movedTask = {
      ...task.toObject(),
      date: cleanDate,
    };

    const safeIndex = Math.max(0, Math.min(targetIndex, newTasks.length));

    const newList = [
      ...newTasks.slice(0, safeIndex),
      movedTask as any,
      ...newTasks.slice(safeIndex),
    ];

    await Promise.all([
      ...oldWithout.map((t, idx) =>
        Task.findByIdAndUpdate(t._id, {
          $set: { order: idx },
        })
      ),
      ...newList.map((t, idx) =>
        Task.findByIdAndUpdate(t._id, {
          $set: {
            order: idx,
            date: cleanDate,
          },
        })
      ),
    ]);

    return res.status(200).json({ message: 'moved' });
  } catch (error) {
    next(error);
  }
};
