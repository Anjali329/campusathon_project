import express from 'express';
import { authenticateJWT, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Today's Assigned Lectures Schedule for Faculty
const todaySchedule = [
  {
    id: "lec-1",
    time: "10:00 AM - 11:00 AM",
    subjectCode: "CS601",
    subjectName: "Operating Systems",
    room: "Lecture Hall LT-3",
    batch: "B.Tech CSE - 6th Sem (Sec A)",
    totalStudents: 60,
    status: "Completed",
    markedAttendance: true,
  },
  {
    id: "lec-2",
    time: "11:15 AM - 12:15 PM",
    subjectCode: "CS604",
    subjectName: "Machine Learning",
    room: "Lecture Hall LT-2",
    batch: "B.Tech CSE - 6th Sem (Sec A)",
    totalStudents: 58,
    status: "Upcoming Today",
    markedAttendance: false,
  },
  {
    id: "lec-3",
    time: "03:15 PM - 05:15 PM",
    subjectCode: "CS604L",
    subjectName: "Machine Learning Lab (Batch B1)",
    room: "Computer Lab 4",
    batch: "B.Tech CSE - 6th Sem (Sec B)",
    totalStudents: 30,
    status: "Scheduled",
    markedAttendance: false,
  },
];

// Class Attendance Overview & Defaulter List under Faculty
const facultyClassesData = {
  classSummaries: [
    { code: "CS601", name: "Operating Systems", totalEnrolled: 60, avgAttendance: 78.4, riskCount: 4 },
    { code: "CS604", name: "Machine Learning", totalEnrolled: 58, avgAttendance: 86.2, riskCount: 1 },
    { code: "CS604L", name: "ML Lab (Sec B)", totalEnrolled: 30, avgAttendance: 72.0, riskCount: 6 },
  ],
  defaultersList: [
    { id: "STU-1042", roll: "21BCE1042", name: "Rahul Sharma", courseCode: "CS601", percentage: 68.5, attended: 24, total: 35, status: "Critical Risk" },
    { id: "STU-1088", roll: "21BCE1088", name: "Anish Kapoor", courseCode: "CS601", percentage: 64.2, attended: 22, total: 35, status: "Critical Risk" },
    { id: "STU-1092", roll: "21BCE1092", name: "Pooja Verma", courseCode: "CS604L", percentage: 61.3, attended: 19, total: 31, status: "Critical Risk" },
    { id: "STU-1055", roll: "21BCE1055", name: "Vikram Malhotra", courseCode: "CS604L", percentage: 71.0, attended: 22, total: 31, status: "Warning" },
  ]
};

// Pending Student Submissions awaiting Faculty Verification
let pendingEvaluations = [
  {
    id: "sub-101",
    assignmentId: "asg-1",
    assignmentTitle: "Machine Learning Lab Assignment 4",
    subject: "CS604 Machine Learning",
    studentRoll: "21BCE1042",
    studentName: "Rahul Sharma",
    submittedFile: "Rahul_Sharma_ML_Lab4.pdf",
    submittedAt: "Today, 06:15 PM",
    maxMarks: 50,
    evaluated: false,
    score: null,
    grade: null,
    feedback: "",
  },
  {
    id: "sub-102",
    assignmentId: "asg-2",
    assignmentTitle: "OS Page Replacement Simulator",
    subject: "CS601 Operating Systems",
    studentRoll: "21BCE1088",
    studentName: "Anish Kapoor",
    submittedFile: "Anish_OS_Simulator.zip",
    submittedAt: "Yesterday, 09:30 PM",
    maxMarks: 100,
    evaluated: false,
    score: null,
    grade: null,
    feedback: "",
  }
];

// GET /api/faculty/schedule - Get today's assigned lectures
router.get('/schedule', authenticateJWT, requireRole(['faculty', 'admin']), (req, res) => {
  res.json({
    success: true,
    facultyName: req.user.name || "Prof. Ananya Sen",
    today: new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' }),
    count: todaySchedule.length,
    schedule: todaySchedule,
  });
});

// GET /api/faculty/defaulters - Get class attendance & defaulter list (<75%)
router.get('/defaulters', authenticateJWT, requireRole(['faculty', 'admin']), (req, res) => {
  res.json({
    success: true,
    data: facultyClassesData,
  });
});

// GET /api/faculty/evaluations - Get pending submissions to evaluate
router.get('/evaluations', authenticateJWT, requireRole(['faculty', 'admin']), (req, res) => {
  res.json({
    success: true,
    count: pendingEvaluations.length,
    evaluations: pendingEvaluations,
  });
});

// POST /api/faculty/grade - Submit evaluation score & feedback for student submission
router.post('/grade', authenticateJWT, requireRole(['faculty', 'admin']), (req, res) => {
  const { submissionId, score, grade, feedback } = req.body;
  if (!submissionId || !score) {
    return res.status(400).json({ success: false, message: 'Submission ID and score are required.' });
  }

  const target = pendingEvaluations.find(s => s.id === submissionId);
  if (target) {
    target.evaluated = true;
    target.score = `${score} / ${target.maxMarks}`;
    target.grade = grade || 'A+';
    target.feedback = feedback || 'Verified & Graded by Faculty.';
  }

  res.json({
    success: true,
    message: `Marks & Grade (${grade || 'A+'}) verified and saved to Central ERP!`,
    submission: target,
  });
});

// POST /api/faculty/issue-warning - Dispatch attendance shortage warning notice
router.post('/issue-warning', authenticateJWT, requireRole(['faculty', 'admin']), (req, res) => {
  const { studentId, studentName, courseCode } = req.body;
  res.json({
    success: true,
    message: `Official attendance shortage warning dispatched to ${studentName || 'Student'} for ${courseCode || 'Course'}!`,
  });
});

export default router;
