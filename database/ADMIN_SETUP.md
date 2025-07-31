# Admin User Setup Guide

## Overview

This guide explains how to create admin users for the Grocery Inventory System. Admin users have full access to create, update, and delete all data in the system.

## Security Model

- **Regular Users**: Can only view data (GET operations)
- **Admin Users**: Can perform all operations (GET, POST, PUT, PATCH, DELETE)
- **Admin Creation**: Only database administrators can create admin users

## How to Create an Admin User

### Method 1: Using the Password Hash Generator (Recommended)

1. **Open the password hash generator:**

   - Navigate to `database/generate_password_hash.html`
   - Open this file in a web browser

2. **Generate the hash:**

   - Enter the desired admin username
   - Enter the desired admin password
   - Click "Generate BCrypt Hash"
   - Copy the generated SQL statement

3. **Execute the SQL:**
   - Connect to your PostgreSQL database
   - Run the generated SQL statement

### Method 2: Manual SQL Creation

1. **Generate a BCrypt hash** for your password using any BCrypt generator
2. **Use the SQL script** in `database/create_admin_user.sql`
3. **Replace the placeholder values** with your actual username and hash

### Method 3: Using Online BCrypt Generators

1. Go to a trusted BCrypt generator website
2. Enter your desired password
3. Set salt rounds to 11
4. Copy the generated hash
5. Use the SQL template from `create_admin_user.sql`

## Example SQL Statement

```sql
INSERT INTO "Users" ("Username", "PasswordHash", "Role")
VALUES (
    'admin',
    '$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Admin'
);
```

## Verification

After creating an admin user, verify it was created correctly:

```sql
SELECT "UserId", "Username", "Role" FROM "Users" WHERE "Role" = 'Admin';
```

## Security Best Practices

1. **Strong Passwords**: Use complex passwords for admin accounts
2. **Limited Admin Accounts**: Create only the necessary number of admin accounts
3. **Regular Audits**: Periodically review admin accounts
4. **Secure Database Access**: Ensure only authorized personnel have database access
5. **Password Rotation**: Regularly change admin passwords

## Troubleshooting

### Common Issues

1. **Hash Not Working**: Ensure you're using BCrypt with salt rounds of 11
2. **Login Fails**: Verify the hash was generated correctly
3. **Permission Denied**: Check that the user has the "Admin" role

### Testing Admin Access

1. Login with the admin credentials
2. Try to access protected endpoints (POST, PUT, PATCH, DELETE)
3. Use the Session Manager to test admin privileges

## File Structure

```
database/
├── create_admin_user.sql      # SQL script template
├── generate_password_hash.html # Password hash generator
└── ADMIN_SETUP.md            # This documentation
```

## Support

If you encounter issues creating admin users, contact your database administrator or system administrator.
