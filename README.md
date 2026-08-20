# 🛡️ Women Safety Analytics

> A multi-platform women safety application designed to provide real-time safety monitoring, risk analysis, emergency assistance, location-based safety information, and quick access to emergency features.

[![Python](https://img.shields.io/badge/Python-3.x-blue?logo=python)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Backend-Flask-black?logo=flask)](https://flask.palletsprojects.com/)
[![React Native](https://img.shields.io/badge/Mobile-React%20Native-61DAFB?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Mobile-Expo-000020?logo=expo)](https://expo.dev/)
[![Next.js](https://img.shields.io/badge/Web-Next.js-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![GitHub](https://img.shields.io/badge/Repository-GitHub-181717?logo=github)](https://github.com/Omkar10-cr/women-safety-analytics)

---

## 📌 Table of Contents

* [About the Project](#-about-the-project)
* [Problem Statement](#-problem-statement)
* [Project Objectives](#-project-objectives)
* [Key Features](#-key-features)
* [Application Architecture](#-application-architecture)
* [Technology Stack](#-technology-stack)
* [Project Structure](#-project-structure)
* [Backend](#-backend)
* [Web Application](#-web-application)
* [Mobile Application](#-mobile-application)
* [Risk Analysis](#-risk-analysis)
* [Emergency & Safety Features](#-emergency--safety-features)
* [Environment Variables](#-environment-variables)
* [Installation & Setup](#-installation--setup)
* [Running the Project](#-running-the-project)
* [API Modules](#-api-modules)
* [Security](#-security)
* [Screenshots](#-screenshots)
* [Future Improvements](#-future-improvements)
* [Contributing](#-contributing)
* [License](#-license)
* [Author](#-author)

---

# 📖 About the Project

**Women Safety Analytics** is a full-stack, multi-platform safety application developed to help users monitor their safety, understand location-based risk, and quickly access emergency assistance.

The project combines:

* A **Flask backend** for APIs and safety-related services
* A **React Native + Expo mobile application**
* A **Next.js web application**
* Location-based safety analysis
* Risk scoring and analytics
* Emergency/SOS functionality
* Nearby location and police station information
* User authentication
* Safety reports

The goal is to provide a centralized safety platform that can be accessed through both mobile and web interfaces.

---

# 🚨 Problem Statement

Personal safety can become difficult to manage when users are travelling through unfamiliar or potentially unsafe locations.

Traditional emergency applications often focus primarily on emergency contact functionality. A more useful safety platform can combine emergency assistance with:

* Current location information
* Location-based risk analysis
* Safety scores
* Safety reports
* Nearby emergency services
* Quick emergency actions
* Historical safety analytics

Women Safety Analytics is designed around this approach.

---

# 🎯 Project Objectives

The main objectives of the project are:

* Provide users with a centralized safety platform.
* Monitor and display the user's current location.
* Analyze safety/risk information associated with locations.
* Provide a safety score and risk information.
* Allow users to access emergency features quickly.
* Provide nearby safety-related locations.
* Allow users to manage emergency contacts.
* Provide safety reports and analytics.
* Provide both web and mobile interfaces.
* Maintain a modular backend architecture for future expansion.

---

# ✨ Key Features

## 🛡️ Safety Dashboard

The dashboard provides an overview of the user's safety information.

Features include:

* Safety score
* Current risk level
* Location information
* Safety statistics
* Risk information
* Emergency access

---

## 📍 Location Tracking

The application can work with location information to provide safety-related context.

Location functionality can be used for:

* Current location
* Location-based analysis
* Nearby places
* Safety assessment
* Emergency assistance

---

## 📊 Risk Analysis

The backend contains a dedicated risk engine for evaluating safety-related information.

The project includes:

```text
backend/services/risk_engine.py
```

The risk system can be extended to consider different factors such as:

* Location
* Historical safety reports
* Risk indicators
* Geographic information
* Other safety-related data

---

## 🚨 Emergency / SOS

The application provides quick access to emergency functionality.

The interfaces include dedicated emergency functionality for users to quickly access safety actions.

The project contains:

```text
mobile/app/emergency.tsx
```

and:

```text
web/components/ui/sos-button.tsx
```

---

## 👥 Emergency Contacts

Users can manage emergency contacts through the application.

The mobile application includes:

```text
mobile/app/contacts.tsx
```

This functionality can be used as part of the emergency assistance workflow.

---

## 👮 Nearby Safety Locations

The application includes location-based functionality for finding nearby places and safety resources.

The web application contains a backend proxy route for nearby-place requests:

```text
web/app/api/backend/[...path]/nearby-places/
```

---

## 🔐 User Authentication

The project includes authentication functionality for users.

Backend authentication routes:

```text
backend/routes/auth.py
```

Mobile authentication screens:

```text
mobile/app/login.tsx
mobile/app/signup.tsx
```

Web authentication screens:

```text
web/app/login/page.tsx
web/app/signup/page.tsx
```

---

## 📈 Safety Reports & Analytics

The backend contains dedicated routes and models for safety reports.

```text
backend/routes/reports.py
backend/models/safety_report.py
```

The application also includes a dedicated risk analytics interface:

```text
mobile/app/risk-analytics.tsx
```

---

# 🏗️ Application Architecture

The project follows a multi-platform architecture:

```text
                    ┌──────────────────────┐
                    │       User           │
                    └──────────┬───────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
      ┌──────────────────┐          ┌──────────────────┐
      │   Mobile App     │          │    Web App       │
      │ React Native     │          │    Next.js       │
      │ Expo             │          │    React         │
      └────────┬─────────┘          └────────┬─────────┘
               │                             │
               └──────────────┬──────────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │    Flask Backend    │
                   │       REST API      │
                   └──────────┬──────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
             Users       Locations      Reports
                              │
                              ▼
                       Risk Engine
```

---

# 🛠️ Technology Stack

## Backend

| Technology                   | Purpose                                   |
| ----------------------------- | ----------------------------------------- |
| Python                       | Backend programming language              |
| Flask                        | REST API framework                        |
| Flask-SQLAlchemy             | Database integration                      |
| SQLAlchemy                   | ORM/database layer                        |
| SQLite / configured database | Data storage                              |
| REST API                     | Communication between clients and backend |

---

## Mobile

| Technology                 | Purpose                          |
| --------------------------- | --------------------------------- |
| React Native               | Mobile application framework     |
| Expo                       | Development and build platform   |
| TypeScript                 | Application programming language |
| Expo Router                | Mobile navigation                |
| CSS / React Native styling | UI styling                       |

---

## Web

| Technology         | Purpose                       |
| ------------------- | ------------------------------ |
| Next.js            | Web application framework     |
| React               | UI development                |
| TypeScript          | Type-safe development         |
| CSS                 | Styling                       |
| Next.js API Routes  | Backend proxy/API integration |

---

## Development Tools

* Git
* GitHub
* Visual Studio Code
* npm
* Python Virtual Environment
* PowerShell

---

# 📂 Project Structure

```text
women-safety-analytics/
│
├── backend/
│   ├── models/
│   │   ├── location.py
│   │   ├── safety_report.py
│   │   └── user.py
│   │
│   ├── routes/
│   │   ├── auth.py
│   │   ├── location.py
│   │   ├── reports.py
│   │   └── risk.py
│   │
│   ├── services/
│   │   └── risk_engine.py
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── app.py
│   ├── config.py
│   ├── db.py
│   ├── extensions.py
│   ├── requirements.txt
│   └── README.md
│
├── mobile/
│   ├── app/
│   │   ├── contacts.tsx
│   │   ├── dashboard.tsx
│   │   ├── emergency.tsx
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── map.tsx
│   │   ├── profile.tsx
│   │   ├── risk-analytics.tsx
│   │   └── signup.tsx
│   │
│   ├── components/
│   ├── src/
│   ├── assets/
│   ├── package.json
│   ├── app.json
│   └── README.md
│
├── web/
│   ├── app/
│   │   ├── api/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── signup/
│   │   └── page.tsx
│   │
│   ├── components/
│   │   └── ui/
│   │
│   ├── public/
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── README.md
│
├── docs/
│   └── screenshots/
│
├── .gitignore
└── README.md
```

---

# 🐍 Backend

The backend is built using **Python and Flask**.

It provides APIs for:

* Authentication
* Location services
* Safety reports
* Risk analysis
* User management

### Main Backend Files

```text
backend/app.py
backend/config.py
backend/db.py
backend/extensions.py
```

### Models

```text
backend/models/location.py
backend/models/safety_report.py
backend/models/user.py
```

### Routes

```text
backend/routes/auth.py
backend/routes/location.py
backend/routes/reports.py
backend/routes/risk.py
```

### Services

```text
backend/services/risk_engine.py
```

---

# 🌐 Web Application

The web application is built using:

* Next.js
* React
* TypeScript

The web interface provides:

* Landing page
* Login
* Signup
* Dashboard
* Safety score
* Risk information
* SOS interface
* Location information
* Voice trigger interface
* Safety-related components

Important components include:

```text
web/components/BentoDashboard.tsx
web/components/ui/location-card.tsx
web/components/ui/navbar.tsx
web/components/ui/risk-card.tsx
web/components/ui/safety-score.tsx
web/components/ui/sos-button.tsx
web/components/ui/voice-trigger.tsx
```

---

# 📱 Mobile Application

The mobile application is built using **React Native and Expo**.

The application includes screens for:

* Dashboard
* Login
* Signup
* Emergency
* Contacts
* Map
* Profile
* Risk Analytics

Main application screens:

```text
mobile/app/contacts.tsx
mobile/app/dashboard.tsx
mobile/app/emergency.tsx
mobile/app/login.tsx
mobile/app/map.tsx
mobile/app/profile.tsx
mobile/app/risk-analytics.tsx
mobile/app/signup.tsx
```

---

# 📊 Risk Analysis

The project contains a dedicated risk analysis service:

```text
backend/services/risk_engine.py
```

The risk engine is designed to provide a structured way to calculate and classify safety-related risk.

Example conceptual risk levels:

```text
LOW RISK
MEDIUM RISK
HIGH RISK
```

The risk analysis architecture can be expanded in the future with additional datasets and machine learning models.

---

# 🚨 Emergency & Safety Features

The application is designed around quick access to safety functionality.

Current application components include:

* SOS interface
* Emergency screen
* Emergency contacts
* Location information
* Nearby-place functionality
* Risk analysis
* Safety score
* Safety reports

These features are designed to work together as part of a broader personal safety platform.

---

# 🔐 Environment Variables

Sensitive credentials should **never be committed directly to GitHub**.

The repository contains:

```text
backend/.env.example
```

Create your local environment file:

```text
backend/.env
```

and configure the required environment variables according to the `.env.example` file.

Example:

```env
SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url
```

If external APIs are configured in your local version, add their credentials to `.env` rather than committing them.

> ⚠️ Never upload real API keys, passwords, authentication tokens, or private credentials to GitHub.

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Omkar10-cr/women-safety-analytics.git
```

Navigate into the project:

```bash
cd women-safety-analytics
```

---

# 🐍 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

### Windows

```powershell
python -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Create your environment file:

```text
.env
```

using:

```text
.env.example
```

Then start the Flask backend:

```powershell
python app.py
```

The backend will normally be available at:

```text
http://127.0.0.1:5000
```

---

# 🌐 Web Setup

Open a new terminal and navigate to:

```powershell
cd web
```

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

The Next.js application will normally be available at:

```text
http://localhost:3000
```

---

# 📱 Mobile Setup

Open another terminal:

```powershell
cd mobile
```

Install dependencies:

```powershell
npm install
```

Start Expo:

```powershell
npx expo start
```

You can then run the application using an available Expo development environment.

---

# 🔌 API Modules

The backend is organized into modular route files.

## Authentication

```text
backend/routes/auth.py
```

Handles authentication-related functionality.

## Location

```text
backend/routes/location.py
```

Handles location-related functionality.

## Reports

```text
backend/routes/reports.py
```

Handles safety reports.

## Risk

```text
backend/routes/risk.py
```

Handles risk-related API functionality.

This modular architecture makes the backend easier to maintain and extend.

---

# 🔒 Security

Security is an important part of the project architecture.

The project follows practices such as:

* Environment variables for sensitive configuration
* `.gitignore` protection
* Separation of configuration from application code
* Modular backend architecture
* Controlled API communication

Sensitive files such as:

```text
.env
venv/
node_modules/
__pycache__/
.next/
```

should remain excluded from Git.

---

# 📸 Screenshots

### 🏠 Landing Page

![Landing Page](docs/screenshots/01-landing-page.png)

### 🔑 Sign In

![Sign In](docs/screenshots/02-sign-in.png)

### 📝 Sign Up

![Sign Up](docs/screenshots/03-sign-up.png)

### 🛡️ Safety Dashboard Overview

Safety score, current risk index, and one-tap SOS access.

![Safety Dashboard Overview](docs/screenshots/04-safety-dashboard-overview.png)

### 🚨 Emergency Response Dashboard

Live emergency dispatch status, emergency contacts, police alert, and siren controls.

![Emergency Response Dashboard](docs/screenshots/05-emergency-response-dashboard.png)

### 📍 Live GPS & Nearby Safety Locations

Real-time GPS location with nearest police station and safe place lookup.

![Live GPS and Nearby Safety](docs/screenshots/06-live-gps-nearby-safety.png)

---

# 🔮 Future Improvements

Planned improvements may include:

* [ ] Advanced machine learning-based risk prediction
* [ ] Improved real-time location tracking
* [ ] Enhanced safety heatmaps
* [ ] More detailed safety analytics
* [ ] Improved emergency response workflows
* [ ] Push notifications
* [ ] Expanded nearby emergency services
* [ ] Improved authentication and authorization
* [ ] Cloud deployment
* [ ] Automated testing
* [ ] CI/CD pipeline
* [ ] Production monitoring
* [ ] More comprehensive safety datasets

---

# 🤝 Contributing

Contributions and suggestions are welcome.

### Fork the repository

```bash
git fork
```

### Create a feature branch

```bash
git checkout -b feature/your-feature
```

### Commit your changes

```bash
git add .
git commit -m "Add your feature"
```

### Push the branch

```bash
git push origin feature/your-feature
```

Then open a Pull Request on GitHub.

---

# 📄 License

This project is currently available for educational and development purposes.

Refer to the individual project license files where applicable.

---

# 👨‍💻 Author

## Omkar Naik

BSc Computer Science Graduate | Frontend / Full-Stack Developer

### Technologies

* React
* React Native
* Next.js
* TypeScript
* Python
* Flask
* SQL
* Git & GitHub

### GitHub

[![GitHub](https://img.shields.io/badge/GitHub-Omkar10--cr-181717?logo=github)](https://github.com/Omkar10-cr)

---

# ⭐ Support the Project

If you find this project useful or interesting, consider giving it a ⭐ on GitHub.

Your feedback and suggestions are welcome.

---

## 🛡️ Women Safety Analytics

**Technology for safer journeys.**<img width="1115" height="576" alt="Screenshot 2026-08-21 020023" src="https://github.com/user-attachments/assets/565306a6-7d67-407f-8215-7d028f214d4e" />
<img width="1227" height="607" alt="Screenshot 2026-08-21 020130" src="https://github.com/user-attachments/assets/127933ef-ed98-45ee-beec-9282eb9a7c49" />
<img width="1316" height="627" alt="Screenshot 2026-08-21 015944" src="https://github.com/user-attachments/assets/8132aa91-185d-4d88-b9e7-15f16abc11db" />
<img width="1350" height="632" alt="Screenshot 2026-08-21 020108" src="https://github.com/user-attachments/assets/cf31f635-62a3-4baa-bf5a-9bf7a2661e29" />
<img width="1366" height="768" alt="Screenshot 2026-08-21 020216" src="https://github.com/user-attachments/assets/bc8c0326-6c0a-4040-a569-11ae7fb0b193" />
<img width="1335" height="634" alt="Screenshot 2026-08-21 014747" src="https://github.com/user-attachments/assets/48271db2-a055-49b3-a70e-f50d53a16b0e" />
