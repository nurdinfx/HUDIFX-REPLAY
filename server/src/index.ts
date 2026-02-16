import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { seedDB } from './utils/seedLogic.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for dev
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url}`);
  next();
});

// Database Connection
connectDB().then(async () => {
  // Check if we need to seed (for now, just run it to be safe as per user request)
  // In production, check count first.
  // await seedDB(); 
  console.log("Connected to DB. Call /seed to generate data manually or use 'npm run seed'");
});

import authRoutes from './routes/authRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import replayRoutes from './routes/replayRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/replay', replayRoutes);
app.use('/api/trades', tradeRoutes);

app.get('/', (req, res) => {
  res.send('FXReplay Clone API is running');
});

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please kill the process using this port and try again.`);
    process.exit(1);
  } else {
    // Server started successfully logic could go here
    console.error('Server error:', err);
  }
});

// Optimization: Force restart for port cleanup
