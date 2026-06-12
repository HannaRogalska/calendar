import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/task.routes';
import nagerRoute from './routes/holidays.route'
import { errorHandler } from './middleware/error.middleware';

const app = express();
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://your-vercel-app.vercel.app'
        : 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  })
);
app.use(express.json());
app.use('/api/tasks', taskRoutes);
app.use('/api/holidays', nagerRoute);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
app.use(errorHandler);

export default app;
