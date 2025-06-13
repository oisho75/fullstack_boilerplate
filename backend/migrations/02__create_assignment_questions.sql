-- Drop for easy setup and create assignment Questions
DROP TABLE IF EXISTS assignment_questions;
CREATE TABLE
  assignment_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assignment_id INTEGER NOT NULL REFERENCES assignments (id),
    title TEXT NOT NULL,
    choices TEXT, -- sqlite doesn't support arrays, so we'll store choices as a string of ';;'-separated values
    answer TEXT,
    points INTEGER,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );