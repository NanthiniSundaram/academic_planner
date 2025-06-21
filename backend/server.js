import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';


import connectDB from './config/db.js';
import userRouter from './routes/users.js';
import courseRoutes from './routes/courses.js';
import taskRoutes from './routes/tasks.js';
import scheduleRoutes from './routes/schedule.js';
import aiRoutes from './routes/ai.js';
import progressRoutes from './routes/progress.js';



dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());



app.use('/api/auth', authRouter);
app.use('/api/users',userRouter);
app.use('/api/courses', courseRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/progress', progressRoutes);

app.get('/api/health',(req, res) => {
    res.json({status:'OK', message: 'Academic Planner API is running'});
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});