CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  balance decimal(10, 2) NOT NULL DEFAULT 0,
  created_at timestamp DEFAULT NOW()
);
