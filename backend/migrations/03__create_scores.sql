-- Drop for easy setup and create scores table
DROP TABLE IF EXISTS scores;
CREATE TABLE
  scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assignment_id INTEGER NOT NULL REFERENCES assignments (id),
    user_id INTEGER NOT NULL REFERENCES users (id),
    score INTEGER NOT NULL
  );