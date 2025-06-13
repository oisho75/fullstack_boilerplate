-- Drop for easy setup and create assignments
DROP TABLE IF EXISTS scores;
DROP TABLE IF EXISTS assignment_questions;
DROP TABLE IF EXISTS assignments;
CREATE TABLE
  assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );