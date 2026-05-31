import { useState, useMemo } from 'react';
import type { calendarHook, calendarCells } from '../types/calendarType';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { addTask, changeTask, deleteTask, fetchTasks } from '../api/taskApi';

const WEEK_DAYS = Array.from({ length: 7 }, (_, i) => {
  const tempDate = new Date(2024, 0, 1 + i); // 1 Jan 2024 - Monday
  return { id: i, dayOfWeek: tempDate.toLocaleString('en-US', { weekday: 'short' }) };
});

const useCalendar = (): calendarHook => {
  const queryClient = useQueryClient();
  const [nowDate, setNowDate] = useState(new Date());

  const year = nowDate.getFullYear();
  const month = nowDate.getMonth() + 1;

  // Create date variables for API query boundary
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  // Get tasks for the current month view
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tasks', year, month],
    queryFn: () => fetchTasks(startDate, endDate),
  });

  // Create task mutation

  const createMutation = useMutation({
    mutationFn: (payload: { task: string; date: string }) => addTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', year, month] });
    },
  });

  // Change task mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updatedText }: { id: string; updatedText: string }) =>
      changeTask(id, updatedText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', year, month] });
    },
  });

  // Delete task mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', year, month] });
    },
  });

  // Function wrappers for component usage
  const handleAddTask = (task: string, date: string) => {
    createMutation.mutate({ task, date });
  };

  const handleUpdateTask = (updatedText: string, id: string) => {
    updateMutation.mutate({ id, updatedText });
  };

  const handleDeleteTask = (id?: string) => {
    if (id) {
      deleteMutation.mutate(id);
    }
  };

  // Get the full text representation of the current month (e.g., "May")
  const fullMonth = nowDate.toLocaleString('en-US', { month: 'long' });

  // Handler to switch to the first day of the next month
  const nextMonth = () => {
    setNowDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  // Handler to switch to the first day of the previous month
  const prevMonth = () => {
    setNowDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const calendarCells = useMemo(() => {
    const cells: calendarCells[] = [];
    // Get total days in the current month by requesting day 0 of the next month
    const daysInMonth = new Date(year, month, 0).getDate();
    // Find the weekday of the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayDate = new Date(year, month - 1, 1);
    const startDayOfWeek = firstDayDate.getDay();
    // Calculate leading empty cells to align Monday as the first column (0 = Mon, 6 = Sun)
    const leadingEmptyDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    // Fill the grid with empty strings for the days before the 1st of the month
    for (let i = 0; i < leadingEmptyDays; i++) {
      cells.push({ id: `empty-start-${year}-${month}-${i}`, dayOfMonth: '' });
    }

    // Fill the grid with the actual day numbers of the month
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({
        id: `day-${year}-${month}-${i}`,
        dayOfMonth: `${String(i).padStart(2, '0')}`,
        callDateKey: `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      });
    }
    // Calculate trailing empty cells needed to complete the final row of 7 columns
    const trailingEmptyDays = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);

    // Fill the grid with empty strings for the remaining spaces of the last week
    for (let i = 0; i < trailingEmptyDays; i++) {
      cells.push({ id: `empty-end-${year}-${month}-${i}`, dayOfMonth: '' });
    }

    return cells;
  }, [year, month]);

  return {
    nextMonth,
    prevMonth,
    calendarCells,
    weekDays: WEEK_DAYS,
    fullMonth,
    year,
    month,
    tasksData: data?.data || {},
    isLoading,
    isError,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
  };
};

export default useCalendar;
