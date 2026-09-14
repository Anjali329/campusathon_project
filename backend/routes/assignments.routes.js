import express from 'express';
import { authenticateJWT, requireRole } from '../middleware/auth.js';

const router = express.Router();

let assignmentsData = [
  {
    id: "asg-1",
    title: "Machine Learning Lab Assignment 4",
    subject: "CS604 Machine Learning",
    faculty: "Prof. Ananya Sen",
    dueDate: "Today, 11:59 PM",
    maxMarks: 50,
    weightage: "15%",
    status: "Pending",
    instructions: "Implement Decision Tree & Random Forest classifiers from scratch in Python.",
    attachment: "ML_Lab4_ProblemStatement.pdf",
  },
  {
    id: "asg-2",
    title: "OS Page Replacement Simulator",
    subject: "CS601 Operating Systems",
    faculty: "Prof. Ananya Sen",
    dueDate: "14 Sep 2026, 05:00 PM",
    maxMarks: 100,
    weightage: "20%",
    status: "In Progress",
    instructions: "Build FIFO, LRU, and Optimal page replacement algorithms in C/C++ or Python.",
    attachment: "OS_Assignment2_Specs.pdf",
  },
  {
    id: "asg-3",
    title: "Network Socket Programming Project",
    subject: "CS602 Computer Networks",
    faculty: "Dr. R. P. Gupta",
    dueDate: "05 Sep 2026",
    maxMarks: 50,
    weightage: "10%",
    status: "Submitted",
    score: "46 / 50",
    grade: "A+",
    submittedOn: "04 Sep 2026, 09:30 PM",
    feedback: "Excellent socket implementation and exception handling.",
  },
];

// GET /api/assignments - List pending and graded assignments
router.get('/', authenticateJWT, (req, res) => {
  res.json({
    success: true,
    count: assignmentsData.length,
    assignments: assignmentsData,
  });
});

// POST /api/assignments/submit - Student Solution Submission
router.post('/submit', authenticateJWT, (req, res) => {
  const { assignmentId, comments, fileName } = req.body;
  
  const target = assignmentsData.find(a => a.id === assignmentId);
  if (target) {
    target.status = "Submitted";
    target.submittedOn = new Date().toLocaleString();
  }

  res.json({
    success: true,
    message: `Assignment solution '${fileName || 'Submission.pdf'}' submitted successfully!`,
    assignmentId,
    timestamp: new Date().toISOString(),
  });
});

// POST /api/assignments/create - Faculty Create New Assignment (RBAC: faculty, admin)
router.post('/create', authenticateJWT, requireRole(['faculty', 'admin']), (req, res) => {
  const { title, subject, dueDate, weightage, maxMarks, instructions } = req.body;
  if (!title || !subject) {
    return res.status(400).json({ success: false, message: 'Title and subject are required.' });
  }

  const newAsg = {
    id: `asg-${Date.now()}`,
    title,
    subject,
    faculty: req.user.name,
    dueDate: dueDate || "Next Week",
    maxMarks: maxMarks || 100,
    weightage: weightage || "10%",
    status: "Pending",
    instructions: instructions || "Complete assignment requirements.",
  };

  assignmentsData.unshift(newAsg);

  res.status(201).json({
    success: true,
    message: 'New assignment published to student portal!',
    assignment: newAsg,
  });
});

// POST /api/assignments/grade - Grade assignment and update marks for student view
export function updateAssignmentGrade(assignmentId, score, grade, feedback) {
  const target = assignmentsData.find(a => a.id === assignmentId || a.title?.includes(assignmentId));
  if (target) {
    target.status = "Submitted";
    target.score = score;
    target.grade = grade;
    target.feedback = feedback;
    target.submittedOn = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } else if (assignmentsData.length > 0) {
    const pending = assignmentsData.find(a => a.status !== "Submitted") || assignmentsData[0];
    if (pending) {
      pending.status = "Submitted";
      pending.score = score;
      pending.grade = grade;
      pending.feedback = feedback;
      pending.submittedOn = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  }
}

router.post('/grade', authenticateJWT, requireRole(['faculty', 'admin']), (req, res) => {
  const { assignmentId, score, grade, feedback } = req.body;
  updateAssignmentGrade(assignmentId, score, grade, feedback);
  res.json({ success: true, message: 'Assignment marks & grade updated for student view!', assignments: assignmentsData });
});

export default router;
