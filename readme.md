This is a modern, fully responsive document management and Q&A frontend application built with **Next.js**, **React**, and **Tailwind CSS**. It features Google login, document upload, ingestion management, and a powerful Q&A interface. Backend calls are mocked to simulate actual API behavior for development and testing purposes.

---

## 🔧 Tech Stack

- **Framework**: Next.js
- **UI**: React, Tailwind CSS, Radix UI, Lucide Icons
- **State Management**: React Context API
- **Authentication**: Google Sign-In (Mocked)
- **Mocking**: Local mock services for all API interactions

---

## 📂 Features

### ✅ Authentication

- Sign Up / Login / Logout
- Google Sign-In integration (mocked)
- Role-based access control (Admin/User)

### ✅ Document Management

- Upload and manage documents (mocked)
- View document list

### ✅ Ingestion Management

- Trigger document ingestion (mocked)
- View ingestion status

### ✅ Q&A Interface

- Search/ask questions
- Answers returned with relevant document excerpts

### ✅ User Management

- Admin-only access to view and manage users

---

📁 Folder Structure
bash
Copy
Edit
/components → Reusable React components
/pages → Next.js pages (e.g., login, dashboard, upload)
/mock → All mock API services
/context → Global state management with Context API
/styles → Tailwind CSS and custom styles
/utils → Helper functions and constants
🚀 Getting Started

1. Clone the Repository

git clone https://github.com/ShubhamGlassfrog/project.git
cd project 2. Install Dependencies

npm install 3. Run the Development Server

npm run dev
Your app will be available at http://localhost:3000

📄 Mock API Services
All API calls are intercepted and routed to mock services stored in /mock. These services return random or static data mimicking actual API responses to ensure the frontend can be tested independently.

✅ To-Do
Add integration with actual backend services

Improve document parsing preview UI

Add file size/type validation

✍️ Author
Made with ❤️ by Shubham Kumar
