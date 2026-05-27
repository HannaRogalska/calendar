import { z } from 'zod';

export const EventSchema = z.object({
  date: z.coerce.date().refine(
    (date) => {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      return date >= today;
    },
    {
      error: 'The date cannot be in the past',
    }
  ),
  title: z.string(),
  description: z.string().optional(),
  isCompleted: z.boolean().default(false),
});
export const GetTasksQuerySchema = z
  .object({
    start: z.coerce.date(),
    end: z.coerce.date(),
  })
  .refine((data) => data.end >= data.start, {
    error: 'The end date cannot be earlier than the start date.',
    path: ['end'],
  });
export type ZodTaskType = z.infer<typeof EventSchema>;
