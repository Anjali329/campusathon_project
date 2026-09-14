const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('campusflow_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Authentication
  googleLogin: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    return res.json();
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  // Faculty Specific APIs
  getFacultySchedule: async () => {
    const res = await fetch(`${API_BASE_URL}/faculty/schedule`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  addFacultyLecture: async (lecData) => {
    const res = await fetch(`${API_BASE_URL}/faculty/add-lecture`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(lecData),
    });
    return res.json();
  },

  getFacultyDefaulters: async () => {
    const res = await fetch(`${API_BASE_URL}/faculty/defaulters`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getFacultyEvaluations: async () => {
    const res = await fetch(`${API_BASE_URL}/faculty/evaluations`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getAllStudentSubmissions: async () => {
    const res = await fetch(`${API_BASE_URL}/faculty/all-student-submissions`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  gradeSubmission: async (gradeData) => {
    const res = await fetch(`${API_BASE_URL}/faculty/grade`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(gradeData),
    });
    return res.json();
  },

  issueWarningNotice: async (warningData) => {
    const res = await fetch(`${API_BASE_URL}/faculty/issue-warning`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(warningData),
    });
    return res.json();
  },

  // Priority Actions
  getPriorityActions: async () => {
    const res = await fetch(`${API_BASE_URL}/priority/actions`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  // Attendance
  getAttendanceSummary: async () => {
    const res = await fetch(`${API_BASE_URL}/attendance/summary`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  predictAttendance: async (extraAttended) => {
    const res = await fetch(`${API_BASE_URL}/attendance/predict`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ extraAttended }),
    });
    return res.json();
  },

  submitDutyLeave: async (dutyLeaveData) => {
    const res = await fetch(`${API_BASE_URL}/attendance/duty-leave`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dutyLeaveData),
    });
    return res.json();
  },

  markAttendance: async (markData) => {
    const res = await fetch(`${API_BASE_URL}/attendance/mark`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(markData),
    });
    return res.json();
  },

  // Assignments & Exams
  getAssignments: async () => {
    const res = await fetch(`${API_BASE_URL}/assignments`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  submitAssignment: async (submissionData) => {
    const res = await fetch(`${API_BASE_URL}/assignments/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(submissionData),
    });
    return res.json();
  },

  createAssignment: async (asgData) => {
    const res = await fetch(`${API_BASE_URL}/assignments/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(asgData),
    });
    return res.json();
  },

  getExamsTimetable: async () => {
    const res = await fetch(`${API_BASE_URL}/exams/timetable`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  publishExamSlot: async (examSlotData) => {
    const res = await fetch(`${API_BASE_URL}/exams/timetable`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(examSlotData),
    });
    return res.json();
  },

  // Notices & Events
  getNotices: async () => {
    const res = await fetch(`${API_BASE_URL}/notices`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  publishNotice: async (noticeData) => {
    const res = await fetch(`${API_BASE_URL}/notices/publish`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(noticeData),
    });
    return res.json();
  },

  getEvents: async () => {
    const res = await fetch(`${API_BASE_URL}/events`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  rsvpEvent: async (eventId) => {
    const res = await fetch(`${API_BASE_URL}/events/rsvp`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ eventId }),
    });
    return res.json();
  },
};
