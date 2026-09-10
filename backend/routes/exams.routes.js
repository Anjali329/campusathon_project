import express from 'express';
import { authenticateJWT, requireRole } from '../middleware/auth.js';

const router = express.Router();

let examTimetable = [
  {
    id: "ex-1",
    code: "CS602",
    subject: "Computer Networks",
    type: "Mid-Term Written Exam",
    date: "13 Sep 2026",
    time: "10:00 AM - 12:00 PM",
    venue: "Lecture Hall LT-3",
    seatNo: "LT3-B-42",
    updatedBy: "Dr. R. P. Gupta (Faculty)",
    updatedOn: "08 Sep 2026",
  },
  {
    id: "ex-2",
    code: "CS601",
    subject: "Operating Systems",
    type: "Mid-Term Written Exam",
    date: "16 Sep 2026",
    time: "02:00 PM - 04:00 PM",
    venue: "Exam Block Hall-A",
    seatNo: "HA-118",
    updatedBy: "Prof. Ananya Sen (Faculty)",
    updatedOn: "07 Sep 2026",
  },
  {
    id: "ex-3",
    code: "CS604",
    subject: "Machine Learning Practical",
    type: "Lab Examination",
    date: "19 Sep 2026",
    time: "09:00 AM - 01:00 PM",
    venue: "Computer Lab 4",
    seatNo: "LAB4-08",
    updatedBy: "Prof. Ananya Sen (Faculty)",
    updatedOn: "09 Sep 2026",
  },
];

const gradeCards = {
  'Sem 5': {
    sgpa: 9.10,
    totalCredits: 22,
    status: "Passed with Distinction",
    courses: [
      { code: "CS501", name: "Database Management Systems", credits: 4, grade: "O", points: 10, marks: 92 },
      { code: "CS502", name: "Theory of Computation", credits: 4, grade: "A+", points: 9, marks: 86 },
      { code: "CS503", name: "Software Engineering", credits: 3, grade: "O", points: 10, marks: 95 },
      { code: "CS504L", name: "DBMS Lab", credits: 2, grade: "O", points: 10, marks: 98 },
      { code: "CS505", name: "Artificial Intelligence", credits: 4, grade: "A+", points: 9, marks: 88 },
      { code: "CS506", name: "Open Elective: Environmental Sci", credits: 5, grade: "A", points: 8, marks: 81 },
    ]
  },
  'Sem 4': {
    sgpa: 8.70,
    totalCredits: 24,
    status: "Passed First Class",
    courses: [
      { code: "CS401", name: "Discrete Mathematics", credits: 4, grade: "A+", points: 9, marks: 85 },
      { code: "CS402", name: "Microprocessors & Interfacing", credits: 4, grade: "A", points: 8, marks: 78 },
      { code: "CS403", name: "Object Oriented Programming", credits: 4, grade: "O", points: 10, marks: 91 },
      { code: "CS404L", name: "OOP Java Lab", credits: 2, grade: "O", points: 10, marks: 96 },
    ]
  },
  'Sem 3': {
    sgpa: 8.90,
    totalCredits: 23,
    status: "Passed First Class",
    courses: [
      { code: "CS301", name: "Data Structures & Algorithms", credits: 4, grade: "O", points: 10, marks: 94 },
      { code: "CS302", name: "Digital Logic Design", credits: 4, grade: "A+", points: 9, marks: 88 },
    ]
  }
};

// GET /api/exams/timetable - Get faculty exam schedule
router.get('/timetable', authenticateJWT, (req, res) => {
  res.json({ success: true, count: examTimetable.length, timetable: examTimetable });
});

// POST /api/exams/timetable - Faculty Publish / Add Exam Slot
router.post('/timetable', authenticateJWT, requireRole(['faculty', 'admin']), (req, res) => {
  const { code, subject, examType, date, time, venue, seatNo } = req.body;
  if (!subject || !date) {
    return res.status(400).json({ success: false, message: 'Subject and date are required.' });
  }

  const newExam = {
    id: `ex-${Date.now()}`,
    code: code || 'CS603',
    subject,
    type: examType || 'Faculty Scheduled Exam',
    date,
    time: time || '10:00 AM - 12:00 PM',
    venue: venue || 'Lecture Hall LT-1',
    seatNo: seatNo || 'LT1-A-15',
    updatedBy: req.user.name,
    updatedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  };

  examTimetable.unshift(newExam);

  res.status(201).json({
    success: true,
    message: 'Exam timetable slot published successfully to student portal!',
    exam: newExam,
  });
});

// GET /api/exams/gradecards/:sem - Get semester grade sheet
router.get('/gradecards/:sem', authenticateJWT, (req, res) => {
  const semKey = req.params.sem || 'Sem 5';
  const gradeCard = gradeCards[semKey] || gradeCards['Sem 5'];

  res.json({
    success: true,
    semester: semKey,
    gradeCard,
  });
});

export default router;
