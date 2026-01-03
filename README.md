# DTSI School Application

A comprehensive web platform for DTSI School, featuring a student progress dashboard, therapy resources, doctor's blog, and an art shop.

## Tech Stack
- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB

## Prerequisites
- Node.js (v14 or higher)
- MongoDB Connection (Configured in `.env`)

## Setup Instructions

### 1. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```
Start the server:
```bash
npm start
# Server runs on http://localhost:5000
```

### 2. Frontend Setup
Navigate to the client directory and install dependencies:
```bash
cd client
npm install
```
Start the development server:
```bash
npm run dev
# App runs on http://localhost:5173
```

## Features
- **Dashboard**: Track student progress (Mentors update, Parents view).
- **Therapy Videos**: Access curated therapy sessions.
- **Doctor's Blog**: Read updates from professionals.
- **Shop**: Purchase artwork created by students.
- **Gallery**: View school events and moments.

## Usage
- **Register/Login**: Create an account to access the Dashboard.
- **Mentors**: Use the Dashboard to add progress updates.
- **Parents**: View your child's progress and access videos.

## Project Structure
- `/server`: API routes and Database models.
- `/client`: React application components and pages.
