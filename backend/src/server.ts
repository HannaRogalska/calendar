import 'dotenv/config';
import connectDB from './config/db';
import app from './app';

const PORT: string | number = process.env.PORT || 3001;

const handler = async (req: any, res: any) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Critical server startup error:' });
  }
};

export default handler;
