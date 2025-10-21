📚 Readify — Online Book Club Management System
Readify is an online book club management system built with Express.js, PostgreSQL, Prisma/Sequelize, EJS, and Bootstrap.
It allows users to create and join book clubs, manage books etc.

🚀 Features
📚 Book Management (Add, Edit, Delete, Join, Leave)
👥 Club Management (Create, Edit)
👤 Authentication System (Login / Logout)
🖼️ Image Upload Support
🌈 UI with Bootstrap
🔐 Security with middleware

🧩 Tech Stack
Backend: Node.js, Express.js
Database: PostgreSQL + Sequelize ORM
Frontend: EJS + Bootstrap 5
Session Management: express-session
Password Hashing: bcryptjs

⚙️ Installation

# 1. Clone repository

git clone https://github.com/sardorb7k/readify-node
cd readify-node

# 2. Install dependencies

npm install

# 3. Setup database & .env

PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=DATABASE_NAME
DB_USER=postgres
DB_PASS=YOUR_PASSWORD

SESSION_SECRET=sh-jcfa8F3_jfcW87

# 4. Run server

npm run dev
