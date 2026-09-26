# Customer Support Ticketing CRM

A full-stack Customer Support Ticketing CRM built with **FastAPI, React, SQLAlchemy, SQLite, and Tailwind CSS**.

The application allows support teams to create, search, filter, view, and update customer support tickets while maintaining notes and ticket activity.

---

## Overview

The Customer Support Ticketing CRM provides a simple workflow for managing customer support requests:

1. Create a support ticket.
2. Automatically generate a unique ticket ID.
3. View tickets from the dashboard.
4. Search tickets dynamically.
5. Filter tickets by status.
6. Open individual ticket details.
7. Update ticket status.
8. Add support notes.
9. Track ticket creation and update timestamps.

---

## Features

### Ticket Management

- Create customer support tickets
- Automatically generate ticket IDs such as `TKT-001`
- Store customer name and email
- Store ticket subject and description
- Automatically record creation timestamps
- Track ticket update timestamps

### Dashboard

- View all support tickets
- Dashboard statistics:
  - Total tickets
  - Open tickets
  - In Progress tickets
  - Closed tickets
- Dynamic ticket search
- Status filtering
- Pagination
- Responsive ticket table
- Ticket detail navigation

### Search

Tickets can be searched by:

- Customer name
- Ticket ID
- Customer email
- Subject
- Description

### Ticket Details

- View complete ticket information
- View customer information
- View ticket description
- View ticket status
- View creation and update timestamps
- View previous notes
- Add new support notes
- Update ticket status
- View ticket activity

### User Experience

- Responsive design
- Loading states
- Error handling
- Empty states
- Form validation
- Success feedback
- Responsive navigation
- Dark/light interface support

---

## Technology Stack

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- SQLite
- Uvicorn

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- JavaScript

### Development Tools

- Git
- GitHub
- VS Code
- FastAPI Swagger/OpenAPI

---

## Architecture

```text
                    Customer
                       |
                       v
              React Frontend
                  (Vite)
                       |
                 REST API
                       |
                       v
               FastAPI Backend
                       |
                  SQLAlchemy
                       |
                       v
                    SQLite
                 /           \
                /             \
            Tickets          Notes

Project Structure
CRM/
│
├── .gitignore
├── README.md
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   └── tickets.py
│   │   ├── config.py
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   │
│   ├── .env.example
│   └── requirements.txt
│
└── frontend/
    ├── src/
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