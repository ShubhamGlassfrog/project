# 📄 Document Management & Q&A Frontend

This is a modern, fully responsive **Document Management and Q&A** frontend application built with **Next.js**, **React**, and **Tailwind CSS**. It features a Google login system, document upload and ingestion simulation, and a powerful Q&A interface. API interactions are mocked to simulate real backend behavior for seamless development and testing.

---

## 🔧 Tech Stack

- **Framework**: Next.js 13
- **Language**: TypeScript
- **UI Libraries**:
  - React
  - Tailwind CSS
  - Radix UI
  - Lucide Icons
  - CMDK
- **State Management**: React Context API
- **Authentication**: Google Sign-In (Mocked)
- **Mocking**: Local services simulate backend APIs
- **Testing**: Jest, React Testing Library

---

## 📂 Features

### ✅ Authentication
- Login / Logout
- Google Sign-In (mocked)
- Role-based access (Admin/User)

### ✅ Document Management
- Upload and view documents (mocked)
- Document list and status

### ✅ Ingestion Management
- Simulate document ingestion
- Monitor ingestion status

### ✅ Q&A Interface
- Ask natural language questions
- Get answers with document references

### ✅ User Management
- Admin-only dashboard to manage users

---

## 📁 Folder Structure

/components → Reusable React components
/pages → Application routes (login, dashboard, upload, etc.)
/context → Global state via Context API
/mock → Mocked API services
/styles → Tailwind + custom styles
/utils → Helper utilities and constants

yaml
Copy
Edit

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/ShubhamGlassfrog/project.git
cd project

2. Install Dependencies
npm install

3. Run the Development Server
npm run dev
Visit http://localhost:3000 in your browser.

🧪 Running Tests
npm run test       # Run all tests  
npm run test:watch # Run tests in watch mode  
🧩 Mock API Services
All API calls are intercepted and routed through local mock services found in /mock. These provide static or randomized data mimicking real API responses for seamless development.

🛠️ To-Do
 Connect to real backend services

 Add advanced document parsing & preview UI

 File size/type validation during upload

 Add pagination and filters to document list

✍️ Author
Made with ❤️ by Shubham Kumar


