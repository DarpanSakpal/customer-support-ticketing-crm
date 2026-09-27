# Customer Support Ticketing CRM

A full-stack Customer Support Ticketing CRM built with **FastAPI, React, SQLAlchemy, PostgreSQL/SQLite, and Tailwind CSS**.

The application provides a complete workflow for managing customer support tickets, including ticket creation, search, filtering, pagination, status management, internal notes, ticket closing, and customer email notifications.

---

## 🚀 Live Demo

### Frontend
https://customer-support-ticketing-2474p6cyf-darpan12.vercel.app

### Backend API
https://customer-support-ticketing-crm-auwg.onrender.com

### API Documentation
https://customer-support-ticketing-crm-auwg.onrender.com/docs

---

# 📌 Project Overview

The Customer Support Ticketing CRM is designed to help support teams manage customer support requests through a centralized ticket management system.

The system allows support agents to:

- Create customer support tickets
- Automatically generate unique ticket IDs
- View tickets from the dashboard
- Search tickets dynamically
- Filter tickets by status
- Navigate tickets using pagination
- View complete ticket details
- Update ticket status
- Add internal support notes
- Close tickets with confirmation
- Send complete ticket details to the customer's email
- Track ticket creation and update timestamps

---

# ✨ Features

## 🎫 Ticket Management

- Create customer support tickets
- Automatically generate ticket IDs such as `TKT-001`
- Store customer name
- Store customer email
- Store ticket subject
- Store ticket description
- Automatically record creation timestamp
- Track last updated timestamp
- Update ticket status
- Close tickets with confirmation

### Supported Ticket Statuses

```text
Open
In Progress
Closed

📊 Dashboard

The dashboard provides an overview of the support system.

Dashboard Statistics
Total Tickets
Open Tickets
In Progress Tickets
Closed Tickets
Dashboard Features
Dynamic ticket search
Status filtering
Pagination
Responsive ticket table
Ticket status badges
Ticket detail navigation
Loading states
Empty states
Error handling
🔎 Search

Tickets can be searched dynamically using:

Customer Name
Ticket ID
Customer Email
Subject
Description

Example:

Search: login

The system searches across the relevant ticket fields and returns matching tickets.

📝 Ticket Details

Each ticket has a dedicated ticket details page.

The page displays:

Ticket ID
Customer name
Customer email
Subject
Description
Current status
Created timestamp
Updated timestamp
Internal notes
Activity history

Support agents can:

Change ticket status
Add internal notes
Save ticket updates
Close tickets
Send ticket details through email
📧 Email Notifications

The CRM supports sending complete ticket information directly to the customer's email address.

The email functionality uses Gmail SMTP.

Email Contents

The email includes:

Ticket ID
Customer name
Customer email
Ticket status
Subject
Description
Created timestamp
Updated timestamp
Email Flow
Support Agent
      |
      v
Click "Send Email"
      |
      v
React Frontend
      |
      v
FastAPI Backend
      |
      v
Gmail SMTP
      |
      v
Customer Email
Security

SMTP credentials are stored using environment variables.

The Gmail App Password is not stored in the source code or GitHub repository.

🛠️ Technology Stack
Backend
Python
FastAPI
SQLAlchemy
Pydantic
Uvicorn
SQLite for local development
PostgreSQL for production
Supabase PostgreSQL
Gmail SMTP
Frontend
React
Vite
React Router
Tailwind CSS
JavaScript
Deployment
Frontend: Vercel
Backend: Render
Production Database: Supabase PostgreSQL
Email Service: Gmail SMTP
Development Tools
Git
GitHub
VS Code
FastAPI Swagger / OpenAPI
🏗️ System Architecture
Production Architecture
                         Customer
                            |
                            v
                    React Frontend
                       (Vercel)
                            |
                         REST API
                            |
                            v
                    FastAPI Backend
                       (Render)
                       /       \
                      /         \
                     v           v
          Supabase PostgreSQL   Gmail SMTP
                |                    |
                |                    v
                |              Customer Email
                |
          +-----+------+
          |            |
       Tickets       Notes
Local Development Architecture
React Frontend
      |
      v
FastAPI Backend
      |
      v
SQLite Database
🔌 REST API
1. Create Ticket
POST /api/tickets/

Creates a new support ticket.

2. List Tickets
GET /api/tickets/

Supports:

Search
Status filtering
Pagination

Example:

GET /api/tickets/?search=login&status=Open&page=1&page_size=10
3. Ticket Statistics
GET /api/tickets/stats

Returns dashboard statistics.

Example:

{
  "total": 10,
  "open": 5,
  "in_progress": 3,
  "closed": 2
}
4. Get Ticket Details
GET /api/tickets/{ticket_id}

Example:

GET /api/tickets/TKT-001
5. Update Ticket
PUT /api/tickets/{ticket_id}

Used to update ticket status and/or add an internal note.

Example:

{
  "status": "In Progress",
  "notes": "Customer has been contacted."
}
6. Send Ticket Email
POST /api/tickets/{ticket_id}/send-email

Sends the complete ticket details to the customer's email address.

Example:

POST /api/tickets/TKT-001/send-email
🗄️ Database

The application uses SQLAlchemy as the ORM.

Local Development

SQLite can be used for local development:

sqlite:///./crm.db
Production

Production uses PostgreSQL hosted through Supabase.

Main Database Tables
tickets
notes
Tickets Table
id
ticket_id
customer_name
customer_email
subject
description
status
created_at
updated_at
Notes Table
id
ticket_id
note_text
created_at

The notes.ticket_id field references the corresponding ticket.

📁 Project Structure
CRM/
│
├── .gitignore
├── README.md
│
├── backend/
│   ├── app/
│   │   │
│   │   ├── routes/
│   │   │   └── tickets.py
│   │   │
│   │   ├── config.py
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── email_service.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   │
│   ├── .env.example
│   └── requirements.txt
│
└── frontend/
    │
    ├── src/
    │   │
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── StatusBadge.jsx
    │   │
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── CreateTicket.jsx
    │   │   └── TicketDetails.jsx
    │   │
    │   ├── services/
    │   │   └── api.js
    │   │
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    │
    ├── .env.example
    ├── package.json
    └── vite.config.js
⚙️ Environment Variables
Backend

Create:

backend/.env

Example:

DATABASE_URL=sqlite:///./crm.db
FRONTEND_URL=http://localhost:5173

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password

For production, these variables are configured securely in Render.

Never commit real database credentials, Gmail passwords, or Gmail App Passwords to GitHub.

Frontend

Create:

frontend/.env

Example:

VITE_API_BASE_URL=http://127.0.0.1:8000/api

For production, Vercel uses the deployed Render API URL.

💻 Local Development
Backend Setup

Navigate to the backend:

cd backend

Create a virtual environment:

python -m venv venv

Activate the virtual environment:

.\venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Create the .env file and configure the required environment variables.

Start the backend:

uvicorn app.main:app --reload

Backend:

http://127.0.0.1:8000

Swagger API documentation:

http://127.0.0.1:8000/docs
Frontend Setup

Open another terminal.

Navigate to the frontend:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Frontend:

http://localhost:5173
🚀 Production Deployment
Frontend — Vercel

The React frontend is deployed using Vercel.

Production environment variable:

VITE_API_BASE_URL=https://customer-support-ticketing-crm-auwg.onrender.com/api
Backend — Render

The FastAPI backend is deployed using Render.

Build Command
pip install -r requirements.txt
Start Command
uvicorn app.main:app --host 0.0.0.0 --port $PORT
Database — Supabase

The production database uses PostgreSQL hosted by Supabase.

The production database connection is provided through:

DATABASE_URL
Email — Gmail SMTP

Customer ticket emails are sent from the backend through Gmail SMTP.

Configuration:

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password

The Gmail App Password is stored only in the deployment environment.

🔐 Security

The project follows basic security practices:

Environment variables are used for sensitive configuration.
.env files are excluded through .gitignore.
Gmail App Passwords are not stored in source code.
Database credentials are not stored in source code.
Production secrets are configured through Render/Vercel environment variables.
The frontend only exposes the public backend API URL.
Secret credentials are not included in .env.example.
🧪 Testing

The application has been tested across the main CRM workflow.

Backend Testing
API health check
Ticket creation
Ticket listing
Ticket search
Ticket filtering
Pagination
Ticket details
Ticket status updates
Internal notes
Ticket closing
Email sending
Frontend Testing
Dashboard
Search
Status filtering
Pagination
Ticket creation
Ticket details
Status updates
Internal notes
Close ticket confirmation
Send Email functionality
Loading states
Error states
Empty states
Production Testing
Vercel frontend
Render backend
Supabase PostgreSQL
Gmail SMTP
Production CORS
Production API communication
🔄 Git Workflow

Check repository status:

git status

Stage changes:

git add .

Commit changes:

git commit -m "your commit message"

Push changes:

git push origin main
📈 Future Improvements

Possible future enhancements include:

User authentication
Role-based access control
Multiple support agents
Agent assignment
Email templates
Rich HTML emails
File attachments
Customer portal
Advanced analytics
SLA tracking
Ticket priority levels
Audit logs
Automated email notifications
Docker deployment
Automated testing with Pytest
CI/CD with GitHub Actions
📊 Project Status

The CRM currently supports the complete core customer support workflow:

Create Ticket
      |
      v
Generate Ticket ID
      |
      v
Dashboard
      |
      +---- Search
      |
      +---- Filter
      |
      +---- Pagination
      |
      v
Ticket Details
      |
      +---- Update Status
      |
      +---- Add Notes
      |
      +---- Close Ticket
      |
      +---- Send Ticket Email
      |
      v
Customer Email
Current Production Features
✅ Ticket creation
✅ Automatic ticket IDs
✅ Ticket listing
✅ Dynamic search
✅ Search by customer name
✅ Search by ticket ID
✅ Search by email
✅ Search by subject
✅ Search by description
✅ Status filtering
✅ Pagination
✅ Ticket details
✅ Status updates
✅ Internal notes
✅ Ticket closing
✅ Customer email notifications
✅ PostgreSQL production database
✅ Supabase integration
✅ Vercel deployment
✅ Render deployment
✅ Gmail SMTP integration
✅ REST API
✅ Swagger/OpenAPI documentation
👨‍💻 Author

Darpan Sakpal

GitHub:

https://github.com/DarpanSakpal/DarpanSakpal

Project Repository:

https://github.com/DarpanSakpal/customer-support-ticketing-crm

📄 License

This project was created for educational, internship, assessment, and portfolio purposes.


### After pasting it

Run only these commands:

```powershell
cd D:\Darpan\CRM
git add README.md
git commit -m "docs: update README for production architecture"
git push origin main

Then your README will accurately document the final deployed version, including the new email functionality.