# User Authentication for LifeVerse Game

## Introduction

This document outlines the user authentication system for the LifeVerse game. The authentication system is responsible for securely managing user logins, registrations, password management, and session handling. The design ensures that players' personal data and in-game progress are protected while providing a seamless authentication experience.

## Table of Contents

- [User Authentication for LifeVerse Game](#user-authentication-for-lifeverse-game)
  - [Introduction](#introduction)
  - [Table of Contents](#table-of-contents)
  - [1. Authentication Overview](#1-authentication-overview)
  - [2. Technology Stack](#2-technology-stack)
  - [3. Registration Process](#3-registration-process)
    - [Registration Endpoint (Example)](#registration-endpoint-example)
  - [4. Login Process](#4-login-process)
    - [Login Endpoint (Example)](#login-endpoint-example)
  - [5. Password Management](#5-password-management)
    - [Password Reset Endpoint (Example)](#password-reset-endpoint-example)
  - [6. Session Management](#6-session-management)
  - [7. Authentication Flow](#7-authentication-flow)
  - [8. Security Measures](#8-security-measures)
  - [9. API Endpoints](#9-api-endpoints)

## 1. Authentication Overview

The authentication system allows players to securely log in and register for LifeVerse. The system will use **JSON Web Tokens (JWT)** for session management and secure user authentication. The authentication process involves verifying user credentials and issuing tokens that can be used for access control in subsequent requests.

## 2. Technology Stack

- **Backend**: Node.js with Express.js (for handling authentication logic)
- **Database**: MongoDB (storing user data and authentication details)
- **Password Hashing**: bcrypt (for securely hashing and storing passwords)
- **JWT**: JSON Web Tokens (for session management)
- **Email Service**: Nodemailer or a third-party email provider (for email verification and password reset)

## 3. Registration Process

The registration process is designed to securely collect and validate user details before allowing them to create an account. The process includes the following steps:

1. **Collect User Information**: Players provide their username, email, and password.
2. **Email Validation**: The email address is validated for correct format and uniqueness in the database.
3. **Password Hashing**: The password is hashed using bcrypt before storing it in the database for security purposes.
4. **Create User Record**: A new user record is created in the database with the provided information.
5. **Send Verification Email**: A verification email is sent to the user with a link to verify their email address.
6. **Account Activation**: The user clicks on the verification link, which activates their account.

### Registration Endpoint (Example)

```javascript
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate email format and uniqueness
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email is already taken' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = new User({
    username,
    email,
    passwordHash: hashedPassword,
  });

  // Save user to database
  await newUser.save();

  // Send email verification (Nodemailer example)
  sendVerificationEmail(newUser.email);

  res.status(201).json({ message: 'Registration successful, please check your email to verify your account' });
});
```

## 4. Login Process

The login process allows players to authenticate with their registered credentials. The process includes the following steps:

- Collect Credentials: Players provide their email/username and password.
- Check User Existence: The system checks if the user exists in the database.
- Password Validation: The provided password is compared with the stored hashed password using bcrypt.
- JWT Token Generation: If authentication is successful, a JWT token is generated and sent to the player for use in subsequent requests.
- Session Management: The JWT token is stored in the client’s local storage or cookies and used for authentication on future API requests.

### Login Endpoint (Example)

```javascript
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({ message: 'Login successful', token });
});
```

## 5. Password Management

Password management is critical to ensuring the security of user accounts. The system will support the following features:

- Password Hashing: Passwords will be hashed using bcrypt before being stored in the database.
- Password Reset: Users can reset their password via an email link.
- Password Update: Users can update their password through their account settings.
- Password Strength Validation: Passwords must meet minimum strength requirements (e.g., at least 8 characters, including uppercase, lowercase, numbers, and symbols).

### Password Reset Endpoint (Example)

```javascript
app.post('/api/reset-password', async (req, res) => {
  const { email } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Generate reset token and send email (token validity: 1 hour)
  const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  sendPasswordResetEmail(user.email, resetToken);

  res.status(200).json({ message: 'Password reset link sent to your email' });
});
```

## 6. Session Management

Session management is handled using JWT tokens. Tokens are sent with each authenticated request to verify the player’s identity.

- Token Expiration: Tokens will expire after a set period (e.g., 1 hour). Once expired, the player will need to log in again to obtain a new token.
- Token Revocation: If a player logs out or if a session is compromised, the token should be revoked by removing it from the client’s storage.
- Token Refresh: Optionally, implement a refresh token system where a player can obtain a new JWT token without re-entering their credentials.

## 7. Authentication Flow

- Registration: Players sign up with their username, email, and password. An email verification link is sent.
- Email Verification: Players click the verification link to activate their account.
- Login: Players log in with their credentials (email/username and password). A JWT token is generated and sent back.
- Authenticated Requests: Players include the JWT token in the header for authenticated requests.
- Logout: Players log out, and the token is removed from the client.

## 8. Security Measures

To protect user accounts and prevent unauthorized access, the following security measures will be implemented:

- Rate Limiting: To prevent brute force attacks, rate limiting will be applied to the login and registration endpoints.
- Password Hashing: bcrypt will be used to securely hash passwords before storage.
- JWT Signing: Tokens will be signed with a secret key to prevent tampering.
- HTTPS: The authentication system will be accessible only over HTTPS to ensure encrypted communication.

## 9. API Endpoints

Authentication Endpoints:

- POST /api/register: Registers a new user.
- POST /api/login: Logs in a user and returns a JWT token.
- POST /api/reset-password: Sends a password reset email to the user.
- POST /api/verify-email: Verifies the user’s email address.

By following these guidelines, LifeVerse will provide a secure and seamless authentication experience for its players while ensuring the protection of sensitive user data.
