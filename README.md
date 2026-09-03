# Hairloon 💇‍♂️

> AI-powered hairstyle recommendation and salon discovery platform.

Hairloon is a full-stack web application that helps users discover
hairstyles based on their face shape and find suitable salons for
getting their preferred hairstyle.

## 🚀 Features

- 🔍 Face shape analysis
- 💇 Hairstyle recommendations
- 🏪 Salon discovery
- ⭐ Salon ratings and reviews
- 🔐 User registration and login
- 📅 Appointment booking
- 📱 Responsive user interface
- 🗄️ Backend database management

## 🖥️ Screenshots

### Home Page

![Hairloon Home](./screenshots/home.png)

### Face Shape Analysis

![Face Analysis](./screenshots/face-analysis.png)

### Hairstyle Recommendations

![Recommendations](./screenshots/recommendations.png)

### Salon Discovery

![Salons](./screenshots/salons.png)

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- React Router
- Lucide React

### Backend

- Node.js
- Express.js
- REST API

### Database

- SQLite

### Tools

- Git
- GitHub
- VS Code

## 🏗️ Project Architecture

```text
                    Hairloon
                       │
              ┌────────┴────────┐
              │                 │
           Frontend           Backend
          React + Vite      Node + Express
              │                 │
              │              REST API
              │                 │
              └────────┬────────┘
                       │
                    SQLite
                       │
          ┌────────────┼────────────┐
          │            │            │
        Users      Hairstyles    Salons
                       │
                  Appointments
