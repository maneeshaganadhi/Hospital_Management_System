# 🏥 Hospital Management System (Full Stack)

A complete **Hospital Management System** built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**.
This application helps manage hospital operations such as **patients, doctors, appointments, billing, and feedback** with a user-friendly interface.

---

## 🚀 Features

### 👨‍⚕️ Admin

* Manage doctors (Add / Update / Delete)
* View all patients
* Monitor appointments and billing

### 🩺 Doctor

* Login securely
* Manage availability
* View assigned appointments

### 🧑‍🤝‍🧑 Patient

* Register & login
* Book appointments
* Give feedback

---

## 🛠️ Tech Stack

### 🔹 Frontend

* React.js
* HTML, CSS, JavaScript
* Axios

### 🔹 Backend

* Node.js
* Express.js

### 🔹 Database

* MongoDB

### 🔹 Authentication

* JWT (JSON Web Token)

---

## 📁 Project Structure

```bash
Hospital_Management_System/
│
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── index.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │
│   ├── public/
│   ├── package.json
│
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔹 1. Clone Repository

```bash
git clone https://github.com/maneeshaganadhi/Hospital_Management_System.git
cd Hospital_Management_System
```

---

### 🔹 2. Install Dependencies

#### Backend

```bash
cd Backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

---

### 🔹 3. Environment Variables

Create `.env` file in Backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

### 🔹 4. Run Application

#### Start Backend

```bash
cd Backend
npm start
```

#### Start Frontend

```bash
cd frontend
npm start
```

---

## 🌐 API Endpoints

### 🔐 Authentication

* POST `/register` → Register user
* POST `/login` → Login

### 👨‍⚕️ Doctors

* GET `/doctors`
* POST `/doctors`

### 🧑 Patients

* GET `/patients`
* POST `/patients`

### 📅 Appointments

* POST `/appointments`
* GET `/appointments`

### 💰 Billing

* POST `/billing`

### ⭐ Feedback

* POST `/feedback`

---

## 💻 Frontend Pages

* Login Page
* Register Page
* Dashboard
* Doctor List
* Appointment Booking
* Feedback Form

---

## 🔒 Security

* JWT Authentication
* Protected Routes
* Middleware-based authorization

---

## 📌 Future Enhancements

* Online payment integration
* Email/SMS notifications
* Admin analytics dashboard
* Mobile app version

---

## 🧪 Testing

* API testing using Postman
* Unit testing (optional)

---

## 👨‍💻 Author

**Maneesha Ganadi**

GitHub: https://github.com/maneeshaganadhi
