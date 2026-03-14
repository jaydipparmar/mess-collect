# Mess Collect – Hostel Mess Fee Management System

A production-ready, scalable, and secure Full-Stack MERN application designed for colleges to seamlessly manage hostel mess fees. Features role-based access for Students and Contractors, OTP email verification, secure Razorpay payment integration, and automated downloadable/emailed PDF receipts.

## System Architecture

- **Frontend**: React.js + Vite + Tailwind CSS (Custom Glassmorphism SaaS UI)
- **Backend**: Node.js + Express.js REST API
- **Database**: MongoDB Atlas with Mongoose ORM
- **Authentication**: JWT & Bcrypt with Nodemailer OTP verification
- **Payments**: Razorpay Gateway (Test Mode) + jsPDF for receipts

---

## 🚀 Setup & Installation Guide

Follow these steps to run Mess Collect locally on your machine.

### Prerequisites
1. [Node.js](https://nodejs.org/) (v16 or higher) installed.
2. A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and cluster.
3. A Google Account for Nodemailer (App Password required if 2FA is enabled).
4. A free [Razorpay Test Account](https://razorpay.com/) for test API keys.

---

### Phase 1: Backend Setup

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables template:
   ```bash
   cp .env.example .env
   ```
4. Open the valid `.env` file and fill in your credentials:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `EMAIL_USER` & `EMAIL_PASS`: Your Gmail address and App Password.
   - `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: Your Razorpay test keys.
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server should now be running on `http://localhost:5000`.*

---

### Phase 2: Frontend Setup

1. Open a **new** terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables template:
   ```bash
   cp .env.example .env
   ```
4. Open the new `.env` file and insert your Razorpay Key ID:
   - `VITE_RAZORPAY_KEY_ID`: Same key used in your backend `.env`.
5. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will now be accessible at `http://localhost:5173`.*

---

## 💡 How to Test the Application

1. **Contractor Flow**:
   - Go to `http://localhost:5173/signup` and select **Mess Contractor**.
   - Fill in your details (e.g., "ABC Engineering College") and register.
   - Verify your email via the OTP sent by Nodemailer.
   - Login and add a few fees from the **Fee Management** tab.

2. **Student Flow**:
   - Open an incognito window or log out.
   - Sign up as a **Student** using the *exact same College Name* ("ABC Engineering College").
   - Verify OTP and login.
   - You will see the fees created by the Contractor in your **Pending Dues**.
   - Click **Pay Now**, complete the Razorpay test flow, and watch the fee move to the **Paid** tab.
   - You can download the PDF receipt directly or check the email sent to the student.

---

For production deployment instructions, please refer to \`DEPLOYMENT.md\`.
