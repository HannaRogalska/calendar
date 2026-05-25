import { RequestHandler } from 'express';
import Task from '../models/task.model';

export const getAllTasks: RequestHandler = async (req, res) => {
  try {
    const allTasks = await Task.find();
    if (allTasks.length === 0) {
      res.status(200).json({ data: [] });
      return;
    }
    res.status(200).json({ data: allTasks });
  } catch (error) {
    console.error(`Server error: ${error}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createTask: RequestHandler = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      res.status(400).json({ message: 'Title is required' });
      return;
    }
    const task = await Task.create({ title, description });
    res.status(201).json({ message: 'Task created', data: task });
  } catch (error) {
    console.error(`Server error: ${error}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const changeTask: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.status(200).json({ message: 'Task updated', data: task });
  } catch (error) {
    console.error(`Server error: ${error}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteTask: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findByIdAndDelete( id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.status(200).json({ message: 'Task deleted'});
  } catch (error) {
    console.error(`Server error: ${error}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};
