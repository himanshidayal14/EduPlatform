<h1 align="center">🎓 Online Learning Platform – EduPlatform</h1>

A **frontend-only Online Learning Platform** built with **Next.js (TypeScript)**.  
The platform simulates a complete LMS experience with **Instructor** and **Student** roles.  

Instructors can create courses and lectures (readings or quizzes), while students can browse courses, complete lectures, attempt quizzes, and track their progress.

---

### 🔗 Live Demo
👉 [edu-platform-sepia-eight.vercel.app](https://edu-platform-sepia-eight.vercel.app)

---

## 📌 Features

- **User Authentication (Frontend-Simulated)** – Login/Signup with role-based access (Instructor vs Student).  
- **Instructor Features** – Create courses, add reading or quiz lectures.  
- **Student Features** – Browse courses, complete lectures, attempt quizzes, and track progress.  
- **Progress Tracking** – Real-time updates (e.g., *5/10 lectures completed*).  
- **Quiz Grading** – Instant evaluation with scores on submission.  

⚠️ **Note:** This is a **frontend-only project**. APIs and persistence are simulated but the architecture is structured for **easy backend integration later**.

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14.2.25** – Production-grade React framework with App Router.  
- **React 19** – Latest React library.  
- **TypeScript 5** – Strong typing for safer development.  
- **Tailwind CSS 4.1.9** – Utility-first styling.  
- **Radix UI, Lucide React, Geist, Class Variance Authority** – UI components & styling helpers.  

### Forms & Validation
- **React Hook Form 7.60.0** – Performant form handling.  
- **Zod 3.25.67** – Type-safe schema validation.  
- **@hookform/resolvers** – Integration between Zod & React Hook Form.  

### Data Visualization
- **Recharts 2.15.4** – Composable charts for student progress.  

### Additional UI Libraries
- **Embla Carousel React, React Day Picker, React Resizable Panels, Sonner, Vaul, CMDK, Input OTP**  

### Utilities & Tools
- **Date-fns, Next Themes, Vercel Analytics, clsx, tailwind-merge**  

---

## 🏗️ Project Architecture

app/
├── layout.tsx # Root layout & metadata
├── page.tsx # Landing page
├── globals.css # Global styles
├── components/ # Reusable UI components
│ ├── auth/ # Login, Signup forms
│ ├── courses/ # Course cards, details, lectures
│ ├── dashboard/ # Student & Instructor dashboards
│ └── ui/ # Shared UI components
├── hooks/ # Custom React hooks
└── provider/ # Theme & Auth providers

yaml
Copy code

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/edu-platform.git
cd edu-platform
2. Install Dependencies
bash
Copy code
npm install
3. Run the Development Server
bash
Copy code
npm run dev
4. Open in Browser
arduino
Copy code
http://localhost:3000
▶️ Running the Application
After starting the dev server (npm run dev), you can:

Register/Login – Choose Instructor or Student role.

Instructor Dashboard – Create courses, add reading/quiz lectures.

Student Dashboard – Browse courses, view lectures sequentially, attempt quizzes, track progress.

🚀 Deployment
This project is deployed on Vercel, which provides an optimized environment for Next.js apps.
Simply push changes to the main branch, and Vercel will handle automatic builds & deployments.

📌 Version Control
This project is tracked using Git & GitHub.

Commit history follows:
setup → feature implementation → styling → testing → deployment.



