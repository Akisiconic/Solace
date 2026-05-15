import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import moodRoutes from './routes/mood';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/mood', moodRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Error handler must be last — Express identifies it by the 4-argument signature
app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(PORT, () => console.log(`Solace API running on port ${PORT}`));
}

start().catch(console.error);
