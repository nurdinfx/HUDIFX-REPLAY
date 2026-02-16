import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
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
// Database Connection
connectDB();
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
});
//# sourceMappingURL=index.js.map