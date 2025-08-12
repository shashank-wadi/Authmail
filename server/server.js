import dotenv from 'dotenv';
dotenv.config(); // Load .env

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRoutes from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

connectDB();

// Updated CORS configuration
app.use(cors({
  origin: [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://authmail-frontend.onrender.com', // Replace with real frontend URL 
],

  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.get('/', (req, res) => res.send("App working fine"));
app.use('/api/auth', authRoutes);
app.use('/api/user', userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
});