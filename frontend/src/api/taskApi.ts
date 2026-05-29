import type { ApiTasksResponseType } from '../../../shared/schemas/event.schema';
import axios from 'axios';

export const fetchTasks = async (start: string, end?: string): Promise<ApiTasksResponseType> => {
  const finalEnd = end || start;
 try {
   const response = await axios.get<ApiTasksResponseType>(
     `/api/tasks?start=${start}&end=${finalEnd}`
   );
   console.log(response.data)
   return response.data
 } catch (error) {
   console.log(error);
   throw error;
 }
};

