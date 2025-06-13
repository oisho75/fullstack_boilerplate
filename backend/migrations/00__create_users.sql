-- Drop for easy setup and create users
DROP TABLE IF EXISTS scores;
DROP TABLE IF EXISTS users;
CREATE TABLE
  users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
  );