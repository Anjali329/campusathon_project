import express from 'express';
import { authenticateJWT, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Database Store: Assigned Faculty Members Directory
let assignedFacultiesData = [
  {
    id: "FAC-1002",
    employeeId: "EMP-CS102",
    name: "Prof. Ananya Sen",
    email: "ananya.sen@campus.edu",
    department: "Computer Science & Engineering",
    designation: "Associate Professor",
    assignedCourses: ["CS601 Operating Systems", "CS604 Machine Learning"],
    totalClassesToday: 3,
    status: "Active",
    onboardedOn: "12 Aug 2024",
  },
  {
    id: "FAC-1003",
    employeeId: "EMP-CS103",
    name: "Dr. R. P. Gupta",
    email: "rp.gupta@campus.edu",
    department: "Computer Science & Engineering",
    designation: "Professor & HOD",
    assignedCourses: ["CS602 Computer Networks"],
    totalClassesToday: 2,
    status: "Active",
    onboardedOn: "10 Jan 2022",
  },
  {
    id: "FAC-1004",
    employeeId: "EMP-CS104",
    name: "Dr. Vikram Sharma",
    email: "v.sharma@campus.edu",
    department: "Information Technology",
    designation: "Assistant Professor",
    assignedCourses: ["CS605 Cloud Computing", "CS604L ML Lab"],
    totalClassesToday: 2,
    status: "Active",
    onboardedOn: "05 Feb 2025",
  },
  {
    id: "FAC-1005",
    employeeId: "EMP-CS105",
    name: "Dr. Sunita Rao",
    email: "sunita.rao@campus.edu",
    department: "Computer Science & Engineering",
    designation: "Associate Professor",
    assignedCourses: ["CS603 Algorithms & Complexity"],
    totalClassesToday: 1,
    status: "Active",
    onboardedOn: "20 May 2025",
  },
];

// Database Store: Daily Attendance Updates & Present Count from Each Faculty Class
let dailyClassUpdatesData = [
  {
    id: "cls-upd-1",
    courseCode: "CS601",
    courseName: "Operating Systems",
    facultyName: "Prof. Ananya Sen",
    scheduleTime: "10:00 AM - 11:00 AM",
    roomVenue: "Lecture Hall LT-3",
    batch: "B.Tech CSE - 6th Sem (Sec A)",
    totalEnrolled: 60,
    totalPresent: 47,
    totalAbsent: 13,
    percentage: 78.3,
    status: "Faculty Marked & Synced",
    updatedAt: "Today, 11:05 AM",
  },
  {
    id: "cls-upd-2",
    courseCode: "CS604",
    courseName: "Machine Learning",
    facultyName: "Prof. Ananya Sen",
    scheduleTime: "11:15 AM - 12:15 PM",
    roomVenue: "Lecture Hall LT-2",
    batch: "B.Tech CSE - 6th Sem (Sec A)",
    totalEnrolled: 58,
    totalPresent: 50,
    totalAbsent: 8,
    percentage: 86.2,
    status: "Faculty Marked & Synced",
    updatedAt: "Today, 12:20 PM",
  },
  {
    id: "cls-upd-3",
    courseCode: "CS604L",
    courseName: "Machine Learning Lab (Batch B1)",
    facultyName: "Dr. Vikram Sharma",
    scheduleTime: "03:15 PM - 05:15 PM",
    roomVenue: "Computer Lab 4",
    batch: "B.Tech CSE - 6th Sem (Sec B)",
    totalEnrolled: 30,
    totalPresent: 22,
    totalAbsent: 8,
    percentage: 73.3,
    status: "Shortage Warning Flagged",
    updatedAt: "Today, 05:20 PM",
  },
  {
    id: "cls-upd-4",
    courseCode: "CS602",
    courseName: "Computer Networks",
    facultyName: "Dr. R. P. Gupta",
    scheduleTime: "01:30 PM - 02:30 PM",
    roomVenue: "Lecture Hall LT-4",
    batch: "B.Tech CSE - 6th Sem (Sec A)",
    totalEnrolled: 55,
    totalPresent: 44,
    totalAbsent: 11,
    percentage: 80.0,
    status: "Faculty Marked & Synced",
    updatedAt: "Today, 02:35 PM",
  },
];

// GET /api/admin/faculties - Get list of all assigned faculties
router.get('/faculties', authenticateJWT, (req, res) => {
  res.json({
    success: true,
    count: assignedFacultiesData.length,
    faculties: assignedFacultiesData,
  });
});

// POST /api/admin/assign-faculty - Admin Assign/Onboard New Faculty
router.post('/assign-faculty', authenticateJWT, requireRole(['admin']), (req, res) => {
  const { name, email, department, designation, assignedCourses } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Faculty Name and Email are required.' });
  }

  const coursesArray = Array.isArray(assignedCourses)
    ? assignedCourses
    : typeof assignedCourses === 'string'
    ? assignedCourses.split(',').map(c => c.trim())
    : ["CS601 Operating Systems"];

  const newFaculty = {
    id: `FAC-${Date.now()}`,
    employeeId: `EMP-CS${Math.floor(100 + Math.random() * 900)}`,
    name,
    email,
    department: department || "Computer Science & Engineering",
    designation: designation || "Assistant Professor",
    assignedCourses: coursesArray,
    totalClassesToday: coursesArray.length,
    status: "Active",
    onboardedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  };

  assignedFacultiesData.unshift(newFaculty);

  res.status(201).json({
    success: true,
    message: `Faculty member '${name}' assigned and credentials generated!`,
    faculty: newFaculty,
    faculties: assignedFacultiesData,
  });
});

// GET /api/admin/daily-class-updates - Get daily attendance updates & present counts from each faculty class
router.get('/daily-class-updates', authenticateJWT, (req, res) => {
  const totalEnrolledSum = dailyClassUpdatesData.reduce((acc, curr) => acc + curr.totalEnrolled, 0);
  const totalPresentSum = dailyClassUpdatesData.reduce((acc, curr) => acc + curr.totalPresent, 0);
  const overallAvg = totalEnrolledSum > 0 ? parseFloat(((totalPresentSum / totalEnrolledSum) * 100).toFixed(1)) : 0;

  res.json({
    success: true,
    count: dailyClassUpdatesData.length,
    summary: {
      totalClassesConducted: dailyClassUpdatesData.length,
      totalEnrolledSum,
      totalPresentSum,
      overallCampusAttendance: overallAvg,
    },
    updates: dailyClassUpdatesData,
  });
});

export default router;
