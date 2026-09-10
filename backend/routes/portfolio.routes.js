import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

const portfolioData = {
  cgpaHistory: [
    { sem: "Sem 1", gpa: 8.4 },
    { sem: "Sem 2", gpa: 8.6 },
    { sem: "Sem 3", gpa: 8.9 },
    { sem: "Sem 4", gpa: 8.7 },
    { sem: "Sem 5", gpa: 9.1 },
    { sem: "Sem 6 (Current)", gpa: 8.84 },
  ],
  verifiedCertificates: [
    {
      id: "cert-1",
      title: "Deep Learning & Neural Networks Specialization",
      issuer: "Coursera & DeepLearning.AI",
      issueDate: "Aug 2026",
      credentialId: "DL-9821-X4",
      verificationStatus: "Verified",
      skills: ["TensorFlow", "Deep Learning", "CNNs"],
      certificateUrl: "https://coursera.org/verify/example",
    },
    {
      id: "cert-2",
      title: "NPTEL Discipline Star: Computer Science",
      issuer: "IIT Kharagpur / NPTEL",
      issueDate: "May 2026",
      credentialId: "NPTEL26CS92",
      verificationStatus: "Verified",
      skills: ["Algorithms", "Data Structures"],
      certificateUrl: "https://nptel.ac.in/verify",
    },
  ],
  extracurricularAchievements: [
    {
      id: "ach-1",
      title: "Winner - Smart India Hackathon Regional Round",
      category: "Hackathon Award",
      date: "Jul 2026",
      details: "Secured 1st position among 45 teams for developing AI-driven Traffic Management prototype.",
    },
    {
      id: "ach-2",
      title: "Technical Head - CodeChef Student Chapter",
      category: "Leadership Position",
      date: "Jan 2026 - Present",
      details: "Organized 8 competitive programming contests with 500+ student participants.",
    },
  ],
  badges: [
    { name: "Top Attendance Scholar (Sem 5)", icon: "🏅", date: "Jan 2026" },
    { name: "Dean's Merit List", icon: "⭐", date: "Jun 2026" },
    { name: "Hackathon Master", icon: "🚀", date: "Aug 2026" },
    { name: "Code Contributor", icon: "💻", date: "Sep 2026" },
  ],
};

// GET /api/portfolio - Get digital achievement portfolio
router.get('/', authenticateJWT, (req, res) => {
  res.json({ success: true, portfolio: portfolioData });
});

export default router;
