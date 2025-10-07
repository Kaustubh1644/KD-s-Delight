KD-s-Delight 🍴

A full-stack food delivery platform featuring customer ordering, cart management, and an admin dashboard for managing menus, users, and orders.

---

🚀 Tech Stack

Frontend: React + CSS
Backend: Node.js, Express
Database: MongoDB
Admin Panel: React
Authentication: JWT

---

✨ Features

🔑 User authentication (signup/login)
📜 Browse food items & add to cart
🛒 Place and manage orders
📊 Admin dashboard to manage menus, orders, and users
⚡ REST API integration between frontend and backend

---

📂 Project Structure

KD-s-Delight/
│── frontend/   → Customer UI (React)
│── backend/    → API server (Node + Express + MongoDB)
│── admin/      → Admin dashboard (React)

---

⚙️ Setup & Installation

1. Clone Repo
git clone https://github.com/Kaustubh1644/KD-s-Delight.git
cd KD-s-Delight
---
2. Install Dependencies

For each folder (backend, frontend, admin):
cd folder_name
npm install
---
3. Configure Environment Variables

Create a .env file inside backend:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
---
4. Run Project

Backend:
cd backend
npm start

Frontend:
cd frontend
npm run dev

Admin:
cd admin
npm start
---
