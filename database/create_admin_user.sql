-- =====================================================
-- ADMIN USER CREATION SCRIPT
-- =====================================================
-- This script should only be run by database administrators
-- to create admin users for the Grocery Inventory System
-- =====================================================
-- Example: Create an admin user
-- Replace 'admin_username' and 'admin_password' with desired values
-- The password will be hashed using BCrypt
-- First, make sure you have the BCrypt extension (if using PostgreSQL)
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- Insert admin user (password will be hashed by the application)
-- IMPORTANT: The password below is just a placeholder - you should hash it properly
INSERT INTO "Users" ("Username", "PasswordHash", "Role")
VALUES (
        'admin_username',
        -- Replace with desired username
        '$2a$11$YourHashedPasswordHere',
        -- Replace with BCrypt hashed password
        'Admin'
    );
-- =====================================================
-- HOW TO USE THIS SCRIPT:
-- =====================================================
-- 1. Replace 'admin_username' with the desired username
-- 2. Generate a BCrypt hash for the password:
--    - Use an online BCrypt generator, or
--    - Use a programming language with BCrypt library
-- 3. Replace '$2a$11$YourHashedPasswordHere' with the actual hash
-- 4. Run this script in your database
-- =====================================================
-- Example with a real BCrypt hash (password: "admin123")
-- INSERT INTO "Users" ("Username", "PasswordHash", "Role") 
-- VALUES (
--     'admin',
--     '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
--     'Admin'
-- );
-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
-- Run this to verify the admin user was created:
-- SELECT "UserId", "Username", "Role" FROM "Users" WHERE "Role" = 'Admin';
-- =====================================================