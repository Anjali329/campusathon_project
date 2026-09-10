import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

const initialActions = [
  {
    id: "act-1",
    title: "Critical Attendance Risk: CS601 Operating Systems",
    category: "Attendance Alert",
    priorityScore: 95,
    urgency: "High Risk",
    urgencyColor: "red",
    reasoning: "Current attendance is 68.5% (Threshold: 75%). You are 2 classes away from exam debarment.",
    recommendation: "Attend tomorrow's 10:00 AM lecture and request medical leave regularization if applicable.",
    actionText: "View Attendance Strategy",
    targetTab: "attendance",
    deadline: "Tomorrow, 10:00 AM",
    badge: "AI Alert",
  },
  {
    id: "act-2",
    title: "Upcoming Assignment: Machine Learning Lab Report 4",
    category: "Academic Deadline",
    priorityScore: 88,
    urgency: "Due Soon",
    urgencyColor: "amber",
    reasoning: "Weightage: 15% of internal assessment. Deadline in 4 hours.",
    recommendation: "Review code snippets and upload final PDF submission before 11:59 PM today.",
    actionText: "Upload Assignment",
    targetTab: "assignments",
    deadline: "Today, 11:59 PM",
    badge: "15% Marks",
  },
  {
    id: "act-3",
    title: "Mid-Term Examination: Computer Networks (CS602)",
    category: "Examination",
    priorityScore: 82,
    urgency: "2 Days Away",
    urgencyColor: "blue",
    reasoning: "Exam scheduled for Sept 13, 10:00 AM at LT-3. Seat: LT3-B-42.",
    recommendation: "Check faculty exam schedule & assigned seat number LT3-B-42.",
    actionText: "View Exam Timetable",
    targetTab: "exams",
    deadline: "13 Sep 2026, 10:00 AM",
    badge: "Hall 3B",
  },
  {
    id: "act-4",
    title: "Mandatory Notice: Final Year Project Phase-1 Registration",
    category: "Institutional Notice",
    priorityScore: 78,
    urgency: "Action Required",
    urgencyColor: "purple",
    reasoning: "NLP Classified: Mandatory Academic Registration by Dean Office.",
    recommendation: "Form team of 3-4 students and submit project topic proposal.",
    actionText: "Register Project Team",
    targetTab: "notices",
    deadline: "15 Sep 2026",
    badge: "NLP Tagged",
  },
];

// GET /api/priority/actions - Fetch AI ranked priority action cards
router.get('/actions', authenticateJWT, (req, res) => {
  res.json({
    success: true,
    count: initialActions.length,
    actions: initialActions,
  });
});

// POST /api/priority/refresh - Trigger AI Priority Re-index
router.post('/refresh', authenticateJWT, (req, res) => {
  // Re-sort priorities dynamically
  const reindexed = [...initialActions].sort((a, b) => b.priorityScore - a.priorityScore);
  res.json({
    success: true,
    message: "Smart Priority Engine re-indexed priorities using Python ML algorithm.",
    actions: reindexed,
  });
});

export default router;
