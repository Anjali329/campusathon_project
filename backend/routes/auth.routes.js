import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// Mock in-memory user database initialized with standard role profiles
const usersDb = [
  {
    id: "STU-2026-8942",
    name: "Rahul Sharma",
    email: "rahul.sharma@campus.edu",
    passwordHash: bcrypt.hashSync("student123", 10),
    role: "student",
    department: "Computer Science & Engineering",
    rollNumber: "21BCE1042",
    cgpa: 8.84,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  },
  {
    id: "FAC-1002",
    name: "Prof. Ananya Sen",
    email: "ananya.sen@campus.edu",
    passwordHash: bcrypt.hashSync("faculty123", 10),
    role: "faculty",
    department: "Computer Science & Engineering",
    designation: "Associate Professor",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
  },
  {
    id: "ADM-001",
    name: "Dr. V. K. Malhotra",
    email: "admin@campus.edu",
    passwordHash: bcrypt.hashSync("admin123", 10),
    role: "admin",
    department: "Central Administration",
    designation: "Dean of Academic Affairs",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
  }
];

// POST /api/auth/google - Continue with Google OAuth Endpoint
router.post('/google', (req, res) => {
  const { email, name, avatar } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Google OAuth email is required.' });
  }

  let user = usersDb.find(u => u.email === email);
  if (!user) {
    user = {
      id: `STU-G-${Date.now()}`,
      name: name || 'Google User',
      email: email,
      role: 'student',
      department: 'Computer Science & Engineering',
      rollNumber: `21BCE${Math.floor(1000 + Math.random() * 9000)}`,
      cgpa: 8.50,
      avatar: avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    };
    usersDb.push(user);
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role, name: user.name });

  res.json({
    success: true,
    message: 'Google authentication successful!',
    token,
    user,
  });
});

// POST /api/auth/login - Email/Password Login
router.post('/login', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || (user.passwordHash && !bcrypt.compareSync(password, user.passwordHash))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials provided.' });
  }

  if (role && user.role !== role) {
    user.role = role; // Allow demo switching
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role, name: user.name });

  res.json({
    success: true,
    message: `Logged in successfully as ${user.role}!`,
    token,
    user,
  });
});

// POST /api/auth/register - New Student / Faculty Account Registration
router.post('/register', (req, res) => {
  const { name, email, password, role, rollNumber, department } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  const existing = usersDb.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
  }

  const newUser = {
    id: `${(role || 'student').substring(0, 3).toUpperCase()}-${Date.now()}`,
    name,
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    role: role || 'student',
    department: department || 'Computer Science & Engineering',
    rollNumber: rollNumber || '21BCE1099',
    cgpa: 8.00,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  };

  usersDb.push(newUser);
  const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name });

  res.status(201).json({
    success: true,
    message: 'Account registered successfully!',
    token,
    user: newUser,
  });
});

// GET /api/auth/me - Protected Route to get authenticated user profile
router.get('/me', authenticateJWT, (req, res) => {
  const user = usersDb.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User profile not found.' });
  }
  res.json({ success: true, user });
});

export default router;
