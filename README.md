🎓 Online Learning Platform – EduPlatform

A frontend-only Online Learning Platform built with Next.js (TypeScript).
The platform simulates a full LMS experience with Instructor and Student roles. Instructors can create courses and lectures (readings or quizzes), while students can browse courses, complete lectures, attempt quizzes, and track their progress.

🔗 Live Demo: edu-platform-sepia-eight.vercel.app

📌 Overview

This project was developed as part of an SDE Intern Assignment. It demonstrates:

User Authentication (Frontend-simulated) – Login/Signup with role-based access (Instructor vs Student).

Instructor Features – Course creation & lecture management (reading + quiz).

Student Features – Browse courses, complete lectures, attempt quizzes, and track progress.

Progress Tracking – Real-time updates (e.g., 5/10 lectures completed).

Quiz Grading – Immediate evaluation with scores shown on submission.

⚠️ This is a frontend-only project. APIs and persistence are simulated, but the architecture is structured for easy backend integration later.

⚙️ Setup Instructions
1. Clone the Repository
git clone https://github.com/your-username/edu-platform.git
cd edu-platform

2. Install Dependencies
npm install

3. Run the Development Server
npm run dev

4. Open in Browser

http://localhost:3000

🏗️ Project Architecture
📂 Folder Structure
app/
 ├── layout.tsx       # Root layout & metadata
 ├── page.tsx         # Landing page
 ├── globals.css      # Global styles
 ├── components/      # Reusable UI components
 │   ├── auth/        # Login, Signup forms
 │   ├── courses/     # Course cards, details, lectures
 │   ├── dashboard/   # Student & Instructor dashboards
 │   └── ui/          # Shared UI components
 ├── hooks/           # Custom React hooks
 └── provider/        # Theme & Auth providers

🛠️ Technology Choices
🔹 Core Framework & Runtime

Next.js 14.2.25 – Production-grade React framework with App Router.

React 19 – Latest React library.

TypeScript 5 – Strong typing for safer development.

🎨 Styling & UI

Tailwind CSS 4.1.9 – Utility-first styling.

Radix UI – Accessible unstyled primitives (dialogs, dropdowns, etc.).

Lucide React – Scalable icons.

Geist – Modern font family.

Class Variance Authority – Type-safe component variants.

📝 Forms & Validation

React Hook Form 7.60.0 – Performant form handling.

Zod 3.25.67 – Type-safe schema validation.

@hookform/resolvers – Integration between Zod & React Hook Form.

📊 Data Visualization

Recharts 2.15.4 – Composable charts for student progress.

🔧 Additional UI Libraries

Embla Carousel React – Sliders & carousels.

React Day Picker – Date picker.

React Resizable Panels – Flexible panel layouts.

Sonner – Toast notifications.

Vaul – Drawer components.

CMDK – Command palette.

Input OTP – One-time password inputs.

🛠 Utilities & Tools

Date-fns – Date utilities.

Next Themes – Theme management (light/dark).

Vercel Analytics – Integrated analytics.

clsx + tailwind-merge – Conditional class utilities.

🚀 Deployment

Vercel – Optimized deployment for Next.js apps.

▶️ Running the Application

After running npm run dev, you can:

Register/Login – Choose Instructor or Student role.

Instructor Dashboard – Create courses, add reading/quiz lectures.

Student Dashboard – Browse courses, view lectures sequentially, attempt quizzes, track progress.

📌 Version Control

This project is tracked using Git & GitHub.

Commit history shows setup → feature implementation → styling → deployment.

Each feature (auth, courses, quiz, dashboards) was added incrementally for clarity.

📧 Contact

👤 Himanshi Dayal
📩 himansheedayal@gmail.com

🔗 Live Demo
