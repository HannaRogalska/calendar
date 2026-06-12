import { z } from 'zod';

export const BaseEventSchema = z.object({
  task: z.string().trim().min(1, { message: 'Task cannot be empty' }),
  isCompleted: z.boolean().default(false),
  order: z.number().optional(),
});
export const BackendCreateEventSchema = BaseEventSchema.extend({
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
});

export const GetTasksQuerySchema = z
  .object({
    start: z.string(),
    end: z.string(),
  })
  .refine((data) => data.end >= data.start, {
    error: 'The end date cannot be earlier than the start date.',
    path: ['end'],
  });

export const ClientEventSchema = BaseEventSchema.extend({
  _id: z.string(),
  date: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number().optional(),
});

export const ApiResponseSchema = z.object({
  data: z.record(
    z.string(),
    z.array(ClientEventSchema)
  ),
});

export type ZodTaskType = z.infer<typeof BackendCreateEventSchema>;
export type ApiTasksResponseType = z.output<typeof ApiResponseSchema>;
export type ClientEventSchemaType = z.infer<typeof ClientEventSchema>;
