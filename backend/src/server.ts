import 'dotenv/config';
import connectDB from './config/db';
import app from './app';

const PORT: string | number = process.env.PORT || 3001;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error('Critical server startup error:', error);
    process.exit(1);
  }
};
startServer();
