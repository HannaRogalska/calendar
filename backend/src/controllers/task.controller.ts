import { RequestHandler } from 'express';
import Task from '../models/task.model';
import mongoose from 'mongoose';

export const getAllTasks: RequestHandler = async (req, res, next) => {
  try {
    const allTasks = await Task.find();
    res.status(200).json({ data: allTasks });
  } catch (error) {
    next(error);
  }
};

export const createTask: RequestHandler = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      res.status(400).json({ message: 'Title is required' });
      return;
    }
    const task = await Task.create({ title, description });
    res.status(201).json({ message: 'Task created', data: task });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        message: 'Validation error',
        errors: error.errors,
      });
      return;
    }
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
    const task = await Task.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.status(200).json({ message: 'Task updated', data: task });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        message: 'Validation error',
        errors: error.errors,
      });
      return;
    }
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
