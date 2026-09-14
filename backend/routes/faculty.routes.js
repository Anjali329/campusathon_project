import express from 'express';
import { authenticateJWT, requireRole } from '../middleware/auth.js';
import { updateAssignmentGrade } from './assignments.routes.js';

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

// Database Store: Historical Student Submissions uploaded by each student
let allStudentSubmissionsArchive = [
  {
    id: "sub-archive-1",
    studentId: "STU-1042",
    studentName: "Rahul Sharma",
    studentRoll: "21BCE1042",
    subject: "CS604 Machine Learning",
    assignmentTitle: "Machine Learning Lab Report 4",
    submittedFile: "Rahul_Sharma_ML_Lab4.pdf",
    submittedAt: "10 Sep 2026, 06:15 PM",
    maxMarks: 50,
    score: "48 / 50",
    grade: "A+",
    feedback: "Excellent code implementation of Decision Trees.",
    status: "Verified & Graded",
  },
  {
    id: "sub-archive-2",
    studentId: "STU-1042",
    studentName: "Rahul Sharma",
    studentRoll: "21BCE1042",
    subject: "CS602 Computer Networks",
    assignmentTitle: "Network Socket Programming Project",
    submittedFile: "Rahul_Socket_Program.zip",
    submittedAt: "04 Sep 2026, 09:30 PM",
    maxMarks: 50,
    score: "46 / 50",
    grade: "A+",
    feedback: "Robust TCP/UDP socket implementation.",
    status: "Verified & Graded",
  },
  {
    id: "sub-archive-3",
    studentId: "STU-1088",
    studentName: "Anish Kapoor",
    studentRoll: "21BCE1088",
    subject: "CS601 Operating Systems",
    assignmentTitle: "OS Page Replacement Simulator",
    submittedFile: "Anish_OS_Simulator.zip",
    submittedAt: "09 Sep 2026, 09:30 PM",
    maxMarks: 100,
    score: "88 / 100",
    grade: "A",
    feedback: "FIFO and LRU algorithms working properly.",
    status: "Verified & Graded",
  },
  {
    id: "sub-archive-4",
    studentId: "STU-1092",
    studentName: "Pooja Verma",
    studentRoll: "21BCE1092",
    subject: "CS604L Machine Learning Lab",
    assignmentTitle: "Neural Networks PyTorch Lab Report 3",
    submittedFile: "Pooja_Verma_Lab3_NN.pdf",
    submittedAt: "08 Sep 2026, 04:20 PM",
    maxMarks: 50,
    score: "49 / 50",
    grade: "O",
    feedback: "Outstanding loss curve analysis and model tuning.",
    status: "Verified & Graded",
  },
  {
    id: "sub-archive-5",
    studentId: "STU-1055",
    studentName: "Vikram Malhotra",
    studentRoll: "21BCE1055",
    subject: "CS601 Operating Systems",
    assignmentTitle: "Process Synchronization Semaphores",
    submittedFile: "Vikram_Semaphores_Solution.c",
    submittedAt: "02 Sep 2026, 11:00 AM",
    maxMarks: 100,
    score: "92 / 100",
    grade: "O",
    feedback: "Clean mutex lock logic.",
    status: "Verified & Graded",
  },
];

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

// GET /api/faculty/schedule - Get today's assigned lectures (accessible by both faculty and students)
router.get('/schedule', authenticateJWT, (req, res) => {
  res.json({
    success: true,
    facultyName: req.user.name || "Prof. Ananya Sen",
    today: new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' }),
    count: todaySchedule.length,
    schedule: todaySchedule,
  });
});

// POST /api/faculty/add-lecture - Faculty Add New Lecture Slot (RBAC: faculty, admin)
router.post('/add-lecture', authenticateJWT, requireRole(['faculty', 'admin']), (req, res) => {
  const { time, subjectCode, subjectName, room, batch, totalStudents } = req.body;
  if (!subjectName || !time) {
    return res.status(400).json({ success: false, message: 'Subject name and time are required.' });
  }

  const newLec = {
    id: `lec-${Date.now()}`,
    time: time || '02:00 PM - 03:00 PM',
    subjectCode: subjectCode || 'CS602',
    subjectName,
    room: room || 'Lecture Hall LT-4',
    batch: batch || 'B.Tech CSE - 6th Sem (Sec A)',
    totalStudents: parseInt(totalStudents) || 60,
    status: 'Upcoming Today',
    markedAttendance: false,
  };

  todaySchedule.push(newLec);

  res.status(201).json({
    success: true,
    message: `Lecture slot for ${subjectName} added to today's timetable schedule!`,
    lecture: newLec,
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

// GET /api/faculty/all-student-submissions - Fetch all past assignment uploads per student
router.get('/all-student-submissions', authenticateJWT, requireRole(['faculty', 'admin']), (req, res) => {
  res.json({
    success: true,
    count: allStudentSubmissionsArchive.length,
    submissions: allStudentSubmissionsArchive,
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

    // Push into historical archive
    allStudentSubmissionsArchive.unshift({
      id: `sub-archive-${Date.now()}`,
      studentId: "STU-1042",
      studentName: target.studentName,
      studentRoll: target.studentRoll,
      subject: target.subject,
      assignmentTitle: target.assignmentTitle,
      submittedFile: target.submittedFile,
      submittedAt: target.submittedAt,
      maxMarks: target.maxMarks,
      score: target.score,
      grade: target.grade,
      feedback: target.feedback,
      status: "Verified & Graded",
    });

    // Also update main assignmentsData for Student view
    updateAssignmentGrade(target.assignmentId || target.assignmentTitle, target.score, target.grade, target.feedback);
  } else {
    // If not in pendingEvaluations, update matching assignment directly
    updateAssignmentGrade(submissionId, `${score} / 50`, grade || 'A+', feedback || 'Verified & Graded by Faculty.');
  }

  res.json({
    success: true,
    message: `Marks & Grade (${grade || 'A+'}) verified and saved to Central ERP! Student view updated.`,
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
