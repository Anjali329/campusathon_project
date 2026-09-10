import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

const timelineData = [
  {
    id: "t1",
    date: "10 Sep 2026",
    time: "11:59 PM",
    title: "ML Lab Report 4 Submission",
    type: "Assignment",
    category: "Academic",
    urgency: "Urgent",
    subject: "CS604 Machine Learning",
    description: "Submit linear regression implementation code and model evaluation plots.",
    status: "Pending",
  },
  {
    id: "t2",
    date: "11 Sep 2026",
    time: "05:00 PM",
    title: "Guest Lecture on Cloud Native Architectures",
    type: "Event",
    category: "Campus Life",
    urgency: "Normal",
    subject: "Department Workshop",
    description: "Speaker: Senior Cloud Architect, AWS India. Venue: Main Auditorium.",
    status: "RSVPed",
  },
  {
    id: "t3",
    date: "13 Sep 2026",
    time: "10:00 AM",
    title: "Computer Networks Mid-Term Examination",
    type: "Examination",
    category: "Exams",
    urgency: "Critical",
    subject: "CS602 Computer Networks",
    description: "Pen & paper examination. Duration: 2 Hours. Exam Hall: LT-3.",
    status: "Upcoming",
  },
  {
    id: "t4",
    date: "15 Sep 2026",
    time: "04:00 PM",
    title: "Final Year Capstone Proposal Deadline",
    type: "Notice",
    category: "Academic",
    urgency: "High",
    subject: "Dean Office",
    description: "Mandatory proposal submission for CSE 2027 batch.",
    status: "Action Required",
  },
];

// GET /api/timeline - Get unified academic timeline feed
router.get('/', authenticateJWT, (req, res) => {
  res.json({ success: true, count: timelineData.length, timeline: timelineData });
});

export default router;
