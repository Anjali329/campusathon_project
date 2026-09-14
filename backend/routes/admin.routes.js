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

// Database Store: Year-wise & Division-wise HOD Department Reports
let departmentReportsData = [
  // 2nd Year
  {
    id: "rep-2a",
    year: "2nd Year",
    semester: "4th Semester",
    division: "Division A",
    batchName: "B.Tech CSE 2nd Year (Sec A)",
    totalEnrolled: 64,
    totalPresent: 55,
    totalAbsent: 9,
    attendancePercentage: 85.9,
    shortageRiskCount: 2,
    facultyInCharge: "Dr. A. K. Verma",
    subjects: [
      { code: "CS401", name: "Discrete Mathematics", faculty: "Dr. A. K. Verma", present: 55, total: 64, percentage: 85.9 },
      { code: "CS403", name: "OOP Java", faculty: "Prof. S. K. Roy", present: 52, total: 64, percentage: 81.3 }
    ]
  },
  {
    id: "rep-2b",
    year: "2nd Year",
    semester: "4th Semester",
    division: "Division B",
    batchName: "B.Tech CSE 2nd Year (Sec B)",
    totalEnrolled: 62,
    totalPresent: 49,
    totalAbsent: 13,
    attendancePercentage: 79.0,
    shortageRiskCount: 5,
    facultyInCharge: "Prof. Neha Gupta",
    subjects: [
      { code: "CS402", name: "Microprocessors & Interfacing", faculty: "Prof. Neha Gupta", present: 49, total: 62, percentage: 79.0 }
    ]
  },
  {
    id: "rep-2c",
    year: "2nd Year",
    semester: "4th Semester",
    division: "Division C",
    batchName: "B.Tech CSE 2nd Year (Sec C)",
    totalEnrolled: 60,
    totalPresent: 48,
    totalAbsent: 12,
    attendancePercentage: 80.0,
    shortageRiskCount: 3,
    facultyInCharge: "Prof. S. K. Roy",
    subjects: [
      { code: "CS404L", name: "Java OOP Lab", faculty: "Prof. S. K. Roy", present: 48, total: 60, percentage: 80.0 }
    ]
  },

  // 3rd Year
  {
    id: "rep-3a",
    year: "3rd Year",
    semester: "6th Semester",
    division: "Division A",
    batchName: "B.Tech CSE 3rd Year (Sec A)",
    totalEnrolled: 60,
    totalPresent: 47,
    totalAbsent: 13,
    attendancePercentage: 78.3,
    shortageRiskCount: 4,
    facultyInCharge: "Prof. Ananya Sen",
    subjects: [
      { code: "CS601", name: "Operating Systems", faculty: "Prof. Ananya Sen", present: 47, total: 60, percentage: 78.3 },
      { code: "CS604", name: "Machine Learning", faculty: "Prof. Ananya Sen", present: 50, total: 58, percentage: 86.2 }
    ]
  },
  {
    id: "rep-3b",
    year: "3rd Year",
    semester: "6th Semester",
    division: "Division B",
    batchName: "B.Tech CSE 3rd Year (Sec B)",
    totalEnrolled: 58,
    totalPresent: 42,
    totalAbsent: 16,
    attendancePercentage: 72.4,
    shortageRiskCount: 6,
    facultyInCharge: "Dr. Vikram Sharma",
    subjects: [
      { code: "CS604L", name: "ML Lab (Sec B)", faculty: "Dr. Vikram Sharma", present: 22, total: 30, percentage: 73.3 },
      { code: "CS602", name: "Computer Networks", faculty: "Dr. R. P. Gupta", present: 44, total: 55, percentage: 80.0 }
    ]
  },
  {
    id: "rep-3c",
    year: "3rd Year",
    semester: "6th Semester",
    division: "Division C",
    batchName: "B.Tech CSE 3rd Year (Sec C)",
    totalEnrolled: 55,
    totalPresent: 46,
    totalAbsent: 9,
    attendancePercentage: 83.6,
    shortageRiskCount: 2,
    facultyInCharge: "Dr. Sunita Rao",
    subjects: [
      { code: "CS603", name: "Design & Analysis of Algorithms", faculty: "Dr. Sunita Rao", present: 46, total: 55, percentage: 83.6 }
    ]
  },

  // Final Year
  {
    id: "rep-4a",
    year: "Final Year",
    semester: "8th Semester",
    division: "Division A",
    batchName: "B.Tech CSE Final Year (Sec A)",
    totalEnrolled: 50,
    totalPresent: 45,
    totalAbsent: 5,
    attendancePercentage: 90.0,
    shortageRiskCount: 1,
    facultyInCharge: "Dr. R. P. Gupta (HOD)",
    subjects: [
      { code: "CS801", name: "Cloud Infrastructure & DevOps", faculty: "Dr. R. P. Gupta", present: 45, total: 50, percentage: 90.0 }
    ]
  },
  {
    id: "rep-4b",
    year: "Final Year",
    semester: "8th Semester",
    division: "Division B",
    batchName: "B.Tech CSE Final Year (Sec B)",
    totalEnrolled: 48,
    totalPresent: 43,
    totalAbsent: 5,
    attendancePercentage: 89.5,
    shortageRiskCount: 1,
    facultyInCharge: "Prof. Ananya Sen",
    subjects: [
      { code: "CS802", name: "Deep Learning & NLP", faculty: "Prof. Ananya Sen", present: 43, total: 48, percentage: 89.5 }
    ]
  },
  {
    id: "rep-4c",
    year: "Final Year",
    semester: "8th Semester",
    division: "Division C",
    batchName: "B.Tech CSE Final Year (Sec C)",
    totalEnrolled: 46,
    totalPresent: 40,
    totalAbsent: 6,
    attendancePercentage: 86.9,
    shortageRiskCount: 2,
    facultyInCharge: "Dr. Vikram Sharma",
    subjects: [
      { code: "CS803", name: "Cyber Security & Forensic Audit", faculty: "Dr. Vikram Sharma", present: 40, total: 46, percentage: 86.9 }
    ]
  }
];

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

// GET /api/admin/department-reports - Get HOD year-wise and division-wise (Div A, B, C) student reports
router.get('/department-reports', authenticateJWT, (req, res) => {
  res.json({
    success: true,
    count: departmentReportsData.length,
    reports: departmentReportsData,
  });
});

export default router;
