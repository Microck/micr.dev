import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { questionsRouter } from '../routes/questions';
import { adminRouter } from '../routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit admin login attempts
  message: 'Too many login attempts, please try again later.',
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);

// Static files
app.use(express.static(path.join(__dirname, '../../public')));

// Routes
app.use('/api/questions', questionsRouter);
app.use('/api/admin', adminLimiter, adminRouter);

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// Serve admin pages
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/admin.html'));
});

app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/admin/dashboard.html'));
});

app.listen(PORT, () => {
  console.log(`AnonQ server running on port ${PORT}`);
});