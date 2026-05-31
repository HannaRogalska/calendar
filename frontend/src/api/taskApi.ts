import type {
  ApiTasksResponseType,
  ClientEventSchemaType,
} from '../../../shared/schemas/event.schema';
import axios from 'axios';

export const fetchTasks = async (start: string, end?: string): Promise<ApiTasksResponseType> => {
  const finalEnd = end || start;
  try {
    const response = await axios.get<ApiTasksResponseType>(
      `/api/tasks?start=${start}&end=${finalEnd}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addTask = async (payload: { task: string; date: string }): Promise<ClientEventSchemaType> => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data } = await axios.post(`/api/tasks`, payload, config);
    return data;
  } catch (error) {
    console.error('Error task not created :', error);
    throw error;
  }
};

export const changeTask = async (id: string, task: string): Promise<void> => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await axios.patch(`/api/tasks/${id}`, { task }, config);
  } catch (error) {
    console.error('Error updating resource:', error);
    throw error;
  }
};
export const deleteTask = async (id: string): Promise<void> => {
  try {
    await axios.delete(`/api/tasks/${id}`);
  } catch (error) {
    console.error('Error  deleting task:', error);
    throw error;
  }
};
