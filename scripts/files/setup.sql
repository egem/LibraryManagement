CREATE DATABASE library_management3;

-- Create users table
CREATE TABLE users (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create books table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    "averageRating" DECIMAL(3, 2) DEFAULT 0.00,
    "totalRating" INTEGER DEFAULT 0,
    "ratingCount" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create borrowings table (linking users and books)
CREATE TABLE borrowings (
    "id" SERIAL PRIMARY KEY,
    "userId" INT REFERENCES users(id) ON DELETE CASCADE,
    "bookId" INT REFERENCES books(id) ON DELETE CASCADE,
    "score" INTEGER,
    "borrowedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "returnedAt" TIMESTAMP,
    CONSTRAINT book_already_borrowed UNIQUE ("bookId", "returnedAt")
);

CREATE UNIQUE INDEX book_already_borrowed_idx
ON borrowings ("bookId")
WHERE "returnedAt" IS NULL;

INSERT INTO users ("name") VALUES
('Ali'),
('Ayse'),
('Veli');

INSERT INTO books (name, "averageRating", "totalRating", "ratingCount") VALUES
('To Kill a Mockingbird', 4.5, 9, 2),
('1984', 4.3, 43, 10),
('The Great Gatsby', 4.1, 41, 10);

INSERT INTO borrowings ("userId", "bookId", "borrowedAt", "returnedAt", "score") VALUES
(1, 1, '2025-03-01', '2025-03-15', 4),
(2, 2, '2025-03-05', NULL, NULL);
