import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import priorityRoutes from './routes/priority.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import assignmentsRoutes from './routes/assignments.routes.js';
import examsRoutes from './routes/exams.routes.js';
import noticesRoutes from './routes/notices.routes.js';
import eventsRoutes from './routes/events.routes.js';
import portfolioRoutes from './routes/portfolio.routes.js';
import timelineRoutes from './routes/timeline.routes.js';
import facultyRoutes from './routes/faculty.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & Body Parser Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/priority', priorityRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/exams', examsRoutes);
app.use('/api/notices', noticesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/faculty', facultyRoutes);

// Server Root & Health Check Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'CampusFlow AI-Powered Student Journey Backend API',
    version: '1.0.0',
    problemStatement: 'Campusathon 2026 PS4',
    endpoints: {
      auth: '/api/auth (POST /google, POST /login, POST /register, GET /me)',
      priority: '/api/priority (GET /actions, POST /refresh)',
      attendance: '/api/attendance (GET /summary, POST /predict, POST /duty-leave, POST /mark)',
      assignments: '/api/assignments (GET /, POST /submit, POST /create)',
      exams: '/api/exams (GET /timetable, POST /timetable, GET /gradecards/:sem)',
      notices: '/api/notices (GET /, POST /publish)',
      events: '/api/events (GET /, POST /rsvp)',
      portfolio: '/api/portfolio (GET /)',
      timeline: '/api/timeline (GET /)',
      faculty: '/api/faculty (GET /schedule, GET /defaulters, GET /evaluations, POST /grade, POST /issue-warning)',
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route '${req.originalUrl}' not found on CampusFlow API Server.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

// Start Node.js Express Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`⚡ CampusFlow Express Backend Server active on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`=======================================================`);
});
