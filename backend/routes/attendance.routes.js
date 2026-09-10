import express from 'express';
import { authenticateJWT, requireRole } from '../middleware/auth.js';

const router = express.Router();

let attendanceData = {
  overallPercentage: 74.2,
  targetPercentage: 75.0,
  status: "At Risk",
  totalAttended: 141,
  totalConducted: 190,
  classesToSafety: 3,
  subjects: [
    { code: "CS601", name: "Operating Systems", faculty: "Prof. Ananya Sen", attended: 24, total: 35, percentage: 68.5, status: "Critical Risk", requiredAttends: 3, missableClasses: 0 },
    { code: "CS602", name: "Computer Networks", faculty: "Dr. R. P. Gupta", attended: 31, total: 38, percentage: 81.5, status: "Safe", requiredAttends: 0, missableClasses: 3 },
    { code: "CS603", name: "Design & Analysis of Algorithms", faculty: "Dr. Meenakshi Sundaram", attended: 26, total: 36, percentage: 72.2, status: "Warning", requiredAttends: 2, missableClasses: 0 },
    { code: "CS604", name: "Machine Learning", faculty: "Prof. Ananya Sen", attended: 33, total: 37, percentage: 89.1, status: "Safe", requiredAttends: 0, missableClasses: 6 },
    { code: "CS605L", name: "Full Stack Web Dev Lab", faculty: "Er. Vikramaditya", attended: 27, total: 44, percentage: 61.3, status: "Critical Risk", requiredAttends: 6, missableClasses: 0 },
  ],
  correctionRequests: [
    { id: "req-101", subject: "CS605L Lab", date: "02 Sep 2026", reason: "Participated in Hackathon (Campusathon 2026)", status: "Pending Faculty Approval", submittedOn: "03 Sep 2026" },
    { id: "req-102", subject: "CS601 OS", date: "25 Aug 2026", reason: "Medical Outpatient Checkup", status: "Approved", submittedOn: "26 Aug 2026" }
  ]
};

// GET /api/attendance/summary - Student attendance breakdown & risk status
router.get('/summary', authenticateJWT, (req, res) => {
  res.json({ success: true, attendance: attendanceData });
});

// POST /api/attendance/predict - Safe Margin Attendance Simulator
router.post('/predict', authenticateJWT, (req, res) => {
  const { extraAttended } = req.body;
  const numClasses = parseInt(extraAttended) || 0;
  
  const totalAttendedSim = attendanceData.totalAttended + numClasses;
  const totalConductedSim = attendanceData.totalConducted + numClasses;
  const simulatedPercentage = parseFloat(((totalAttendedSim / totalConductedSim) * 100).toFixed(1));

  res.json({
    success: true,
    extraAttended: numClasses,
    projectedPercentage: simulatedPercentage,
    isSafe: simulatedPercentage >= 75.0,
    status: simulatedPercentage >= 75.0 ? 'Safe for Exams' : 'Risk of Debarment',
  });
});

// POST /api/attendance/duty-leave - Submit Attendance Correction / Duty Leave Claim
router.post('/duty-leave', authenticateJWT, (req, res) => {
  const { subject, leaveDate, reasonType, remarks } = req.body;
  if (!subject || !leaveDate || !reasonType) {
    return res.status(400).json({ success: false, message: 'Subject, absence date, and reason type are required.' });
  }

  const newClaim = {
    id: `req-${Date.now()}`,
    subject,
    date: leaveDate,
    reason: `${reasonType}: ${remarks || 'No remarks'}`,
    status: 'Pending Faculty Approval',
    submittedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  };

  attendanceData.correctionRequests.unshift(newClaim);

  res.status(201).json({
    success: true,
    message: 'Duty leave correction request submitted to faculty successfully.',
    request: newClaim,
  });
});

// POST /api/attendance/mark - Faculty Attendance Logging & Bulk Upload
router.post('/mark', authenticateJWT, requireRole(['faculty', 'admin']), (req, res) => {
  const { courseCode, date, studentSheet, isBulkUpload } = req.body;
  
  res.json({
    success: true,
    message: isBulkUpload 
      ? 'Bulk RFID/Biometric attendance logs synced with ERP successfully!'
      : `Class attendance for ${courseCode || 'CS601'} on ${date || 'Today'} saved and synced with Central ERP!`,
    timestamp: new Date().toISOString(),
  });
});

export default router;
