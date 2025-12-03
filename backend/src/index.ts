import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import portfolioRoutes from './routes/portfolio';
import jobsRoutes from './routes/jobs';
import messagesRoutes from './routes/messages';
import reviewsRoutes from './routes/reviews';
import usersRoutes from './routes/users';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'https://collaboros.vercel.app',
  'http://localhost:3000',
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some(allowed => origin?.includes('vercel.app'))) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now during development
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/users', usersRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ message: 'Collaboros API is running', timestamp: new Date() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Collaboros Backend running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
