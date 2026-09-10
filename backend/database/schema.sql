-- ====================================================================
-- CampusFlow: PostgreSQL / Supabase Schema Definition
-- PS4: Student Journey & Action Platform
-- ====================================================================

-- 1. Users Table (Role-Based Access: student, faculty, admin)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
    department VARCHAR(100),
    roll_number VARCHAR(50),
    avatar_url TEXT,
    cgpa NUMERIC(3, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Attendance Summary & Subject Logs (Faculty Controlled)
CREATE TABLE IF NOT EXISTS attendance_subjects (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES users(id),
    course_code VARCHAR(20) NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    faculty_name VARCHAR(100) NOT NULL,
    classes_attended INT DEFAULT 0,
    classes_conducted INT DEFAULT 0,
    percentage NUMERIC(4, 1) GENERATED ALWAYS AS (
        CASE WHEN classes_conducted > 0 THEN (classes_attended::NUMERIC / classes_conducted::NUMERIC) * 100 ELSE 0 END
    ) STORED
);

CREATE TABLE IF NOT EXISTS duty_leave_requests (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES users(id),
    subject_code VARCHAR(20) NOT NULL,
    absence_date DATE NOT NULL,
    reason_type VARCHAR(50) NOT NULL,
    remarks TEXT,
    status VARCHAR(30) DEFAULT 'Pending Faculty Approval',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Assignments & Submissions
CREATE TABLE IF NOT EXISTS assignments (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    faculty_id VARCHAR(50) REFERENCES users(id),
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    max_marks INT DEFAULT 100,
    weightage VARCHAR(20),
    instructions TEXT
);

CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    assignment_id VARCHAR(50) REFERENCES assignments(id),
    student_id VARCHAR(50) REFERENCES users(id),
    submitted_file TEXT,
    score VARCHAR(20),
    grade VARCHAR(5),
    feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Examination Timetables & Grade Cards (Faculty/Exam Cell Managed)
CREATE TABLE IF NOT EXISTS exam_schedules (
    id VARCHAR(50) PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    exam_type VARCHAR(50) NOT NULL,
    exam_date DATE NOT NULL,
    exam_time VARCHAR(50) NOT NULL,
    venue VARCHAR(100) NOT NULL,
    seat_number VARCHAR(50),
    faculty_updated_by VARCHAR(100) NOT NULL
);

-- 5. Smart Notices with AI NLP Categorization
CREATE TABLE IF NOT EXISTS notices (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    urgency VARCHAR(20) NOT NULL,
    nlp_tags TEXT[], -- PostgreSQL Array of Tags
    publisher VARCHAR(100) NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    is_important BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Campus Events
CREATE TABLE IF NOT EXISTS campus_events (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    event_date VARCHAR(50) NOT NULL,
    event_time VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    organizer VARCHAR(100) NOT NULL,
    banner_url TEXT,
    description TEXT,
    attendees_count INT DEFAULT 0
);
