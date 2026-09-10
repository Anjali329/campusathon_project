import express from 'express';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

let campusEvents = [
  {
    id: "evt-1",
    title: "Campusathon 2026 - Hackathon Grand Finale",
    category: "Hackathon",
    date: "12-13 Sep 2026",
    time: "09:00 AM Onwards",
    location: "Virtual & Innovation Hub",
    organizer: "Simply Updify & Student Council",
    banner: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600",
    description: "National level technology hackathon focused on solving campus problems.",
    attendeesCount: 340,
    isRegistered: true,
  },
  {
    id: "evt-2",
    title: "Workshop: Building Scalable AI Microservices",
    category: "Technical Workshop",
    date: "15 Sep 2026",
    time: "02:00 PM - 05:00 PM",
    location: "Computer Lab 4",
    organizer: "ACM Student Chapter",
    banner: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600",
    description: "Hands-on coding workshop on FastAPI, Docker, and PyTorch deployment.",
    attendeesCount: 85,
    isRegistered: false,
  },
  {
    id: "evt-3",
    title: "Higher Studies & GATE 2027 Guidance Session",
    category: "Career Guidance",
    date: "18 Sep 2026",
    time: "04:00 PM - 06:00 PM",
    location: "Auditorium Hall B",
    organizer: "Career Advisory Cell",
    banner: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600",
    description: "Interact with IISc and IIT alumni regarding MS/M.Tech applications.",
    attendeesCount: 140,
    isRegistered: true,
  },
];

// GET /api/events - Get campus events list
router.get('/', authenticateJWT, (req, res) => {
  res.json({ success: true, count: campusEvents.length, events: campusEvents });
});

// POST /api/events/rsvp - RSVP to campus event
router.post('/rsvp', authenticateJWT, (req, res) => {
  const { eventId } = req.body;
  const evt = campusEvents.find(e => e.id === eventId);
  if (evt) {
    evt.isRegistered = !evt.isRegistered;
    evt.attendeesCount += evt.isRegistered ? 1 : -1;
  }
  res.json({
    success: true,
    message: evt?.isRegistered ? 'RSVP confirmed for event!' : 'RSVP cancelled.',
    event: evt,
  });
});

export default router;
