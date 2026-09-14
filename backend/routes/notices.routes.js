import express from 'express';
import { authenticateJWT, requireRole } from '../middleware/auth.js';

const router = express.Router();

let noticesData = [
  {
    id: "not-1",
    title: "Urgent: Attendance Shortage Review Meeting for 6th Semester",
    category: "Academic",
    urgency: "High",
    nlpTags: ["Academic Risk", "Mandatory Action", "Dean Office"],
    date: "10 Sep 2026",
    publisher: "Academic Registrar",
    summary: "Students with overall attendance below 75% are required to submit medical certificates or duty leave applications by 12th September 2026.",
    content: "This is an official notice to all 6th-semester B.Tech students. Attendance records up to 10th Sept 2026 have been evaluated by the Academic Audit Committee. Students having attendance below 75% in any course will be conditionally barred from appearing in Mid-Term Examinations unless regularized with valid documentation approved by HOD.",
    isImportant: true,
  },
  {
    id: "not-2",
    title: "Placement Registration Notice: Google Cloud & Microsoft India",
    category: "Placement",
    urgency: "Medium",
    nlpTags: ["Placement Drive", "Final Year", "16+ LPA"],
    date: "09 Sep 2026",
    publisher: "Training & Placement Cell",
    summary: "Registration links opened for 2027 graduating batch. Minimum CGPA required: 8.0.",
    content: "The Training & Placement Cell is pleased to announce campus hiring drives for Software Development Engineer (SDE-1) positions. Eligible students can apply via CampusFlow T&P Portal.",
    isImportant: false,
  },
  {
    id: "not-3",
    title: "Annual Tech Fest 'InnovateX 2026' Hackathon Call for Submissions",
    category: "Event",
    urgency: "Low",
    nlpTags: ["Hackathon", "Cash Prizes", "Campus Event"],
    date: "07 Sep 2026",
    publisher: "Student Activity Council",
    summary: "48-hour hackathon with prize pool of ₹1,50,000. Registration closes 15th September.",
    content: "InnovateX 2026 invites innovative solution prototypes across Smart Campus, AI/ML, Healthcare, and Sustainable Tech. Register your team of 2-4 members.",
    isImportant: false,
  },
  {
    id: "not-4",
    title: "Mid-Term Examination Seating Layout & Guidelines",
    category: "Examination",
    urgency: "High",
    nlpTags: ["Exam Seating", "Hall Ticket", "Regulations"],
    date: "05 Sep 2026",
    publisher: "Controller of Examinations",
    summary: "Physical hall tickets mandatory. Electronic gadgets prohibited inside examination hall.",
    content: "Students are advised to verify their designated exam hall seat numbers on CampusFlow at least 30 minutes before commencement.",
    isImportant: true,
  },
];

// GET /api/notices - Get NLP categorized notices
router.get('/', authenticateJWT, (req, res) => {
  res.json({ success: true, count: noticesData.length, notices: noticesData });
});

// POST /api/notices/publish - Broadcast Notice Publisher (RBAC: faculty, admin)
router.post('/publish', authenticateJWT, requireRole(['faculty', 'admin']), (req, res) => {
  const { title, category, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required.' });
  }

  // Automatic AI NLP tagging simulation
  const nlpTags = [`NLP: ${category || 'Academic'}`, 'NLP: Broadcast Notice'];
  if (title.toLowerCase().includes('exam') || title.toLowerCase().includes('schedule')) {
    nlpTags.push('NLP: Exam Risk');
  }

  const newNotice = {
    id: `not-${Date.now()}`,
    title,
    category: category || 'Academic',
    urgency: 'High',
    nlpTags,
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    publisher: req.user.name || 'Dean Office',
    summary: content.substring(0, 120) + '...',
    content,
    isImportant: true,
  };

  noticesData.unshift(newNotice);

  res.status(201).json({
    success: true,
    message: 'Institutional notice broadcasted & AI classified successfully!',
    notice: newNotice,
  });
});

export default router;
