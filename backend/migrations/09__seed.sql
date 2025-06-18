-- Create some test usrs
INSERT INTO
  users (name, email)
VALUES
  ('John Doe', 'john@example.com'),
  ('Jane Smith', 'jane@example.com'),
  ('Alice Johnson', 'alice@example.com'),
  ('Bob Brown', 'bob@example.com');

-- Create test assignments
INSERT INTO
  assignments (title)
VALUES
  ('Basic Skeletal System Quiz'),
  ('Cardiovascular System Basics'),
  ('Digestive System Overview');

-- Create questions for Skeletal System Quiz
-- UNION ALL for additional SELECT statements
INSERT INTO assignment_questions (assignment_id, title, choices, answer, points)
SELECT
  (SELECT id FROM assignments WHERE title = 'Digestive System Overview'),
  'How many bones are in the adult human body?',
  '206;;186;;226;;196',
  '206',
  70
UNION ALL
SELECT
  (SELECT id FROM assignments WHERE title = 'Cardiovascular System Basics'),
  'Which bone is the longest in the human body?',
  'Femur;;Tibia;;Humerus;;Fibula',
  'Humerus',
  100
UNION ALL
SELECT
  (SELECT id FROM assignments WHERE title = 'Basic Skeletal System Quiz'),
  'Which bone is the longest in the human body?',
  'Femur;;Tibia;;Humerus;;Fibula',
  'Humerus',
  35
UNION ALL
SELECT
  (SELECT id FROM assignments WHERE title = 'Basic Skeletal System Quiz'),
  'How many bones are in the adult human body?',
  '206;;186;;226;;196',
  '206',
  10
UNION ALL
SELECT
  (SELECT id FROM assignments WHERE title = 'Basic Skeletal System Quiz'),
  'Which part of the skull protects the brain?',
  'Cranium;;Mandible;;Maxilla;;Hyoid',
  'Mandible',
  25
UNION ALL
SELECT
  (SELECT id FROM assignments WHERE title = 'Basic Skeletal System Quiz'),
  'What is the common name for the clavicle?',
  'Collarbone;;Wishbone;;Shoulderblade;;Neckbone',
  'Collarbone',
  20
UNION ALL
SELECT
  (SELECT id FROM assignments WHERE title = 'Basic Skeletal System Quiz'),
  'Explain the difference between compact and spongy bone tissue: is that one is spongy and the other is compact',
  'true;;false',
  'true',
  15;