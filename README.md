# EASYWAY — Healthcare Appointment Platform
> **Tagline:** "Healthcare Made Easy"  
> **Location:** Vijayawada, Andhra Pradesh, India  
> **Contact Email:** simhadrirajagmail.com  
> **Customer Care:** Coming Soon (Configured via `EASYWAY_CUSTOMER_CARE_PHONE`)

---

## 🌟 Executive Overview
**EASYWAY** is a complete, production-ready, full-stack healthcare appointment and hospital discovery platform specifically tailored for Vijayawada, Andhra Pradesh, India. Built with a premium dark healthcare aesthetic (featuring luminous cyan, teal, emerald, and glowing gradients), the platform allows patients to discover accredited medical disciplines, explore 19+ verified hospitals without confusing search bars, review publicly listed doctors, and book conflict-free consultation slots in real-time.

---

## 🚀 Key Features

### 1. Patient Portal & Public Experience
- **Opening Animation:** Smooth, high-fidelity dark sequence introducing luminous cyan/green gradients, official EasyWay logo scaling, and "Healthcare Made Easy" tagline.
- **Department-Led Discovery:** In strict compliance with navigation rules, discovery is organized through structured medical department cards (Cardiology, Neurology, Orthopaedics, Pediatrics, Pulmonology, Nephrology, Oncology, etc.) rather than a search bar.
- **Hospital Directory:** 19+ verified hospitals in Vijayawada (Aster Ramesh, Manipal Hospital, Sentini City, Srikara, Aayush, Andhra Hospitals, Nagarjuna, etc.) with real addresses, official reception phone numbers, emergency verification badges, and directions.
- **Publicly Listed Doctors:** Transparent doctor directory presenting verified credentials, specialties, qualifications, hospital affiliations, and available days. Unverified rosters clearly display: *"Doctor information is currently unavailable. Please contact the hospital."*
- **Real-Time Time Slot System:** Visual slot states (**AVAILABLE**, **BOOKED**, **UNAVAILABLE**). Prevents duplicate bookings for the same doctor, date, and time. Blocks booking dates in the past.
- **Instant Booking Confirmation:** Automatic generation of a unique, readable appointment identifier (e.g. `EASY-2026-XXXXX`) saved in MongoDB.
- **Patient Dashboard & History:** Track upcoming, completed, and cancelled visits. Manage cancellations with reason tracking and reschedule appointments.

### 2. 🚨 Emergency Services Section
- Clearly visible 24/7 Emergency section with immediate access to verified hospital emergency hotlines across Vijayawada.
- National helplines (112, 108 Andhra Pradesh Medical Ambulance, 104 Teleconsultation).
- Strict non-diagnostic disclaimer: EasyWay is an appointment scheduling gateway and does not provide medical diagnosis or treatment advice.

### 3. Comprehensive Admin System
- **Secure Admin Portal:** Dedicated login gateway with role-based JWT authentication (`/admin/login`).
- **Real-time Analytics Dashboard:** Live counts for Total Hospitals, Doctors, Departments, Patients, Total Bookings, and Today's Appointments with status distributions.
- **Hospital Management:** Add, edit, delete (with safety confirmation modal), and view all hospital facilities.
- **Department Management:** Add, edit, delete, and manage medical specialties and icon keys.
- **Doctor Management:** Add, edit, delete, and schedule consultation days and slots for physicians.
- **Appointment Operations:** 5-way filtering (Date, Hospital, Doctor, Department, Status) with full status workflow (Pending, Confirmed, Completed, Cancelled).
- **Patient Directory:** View registered patient records and cumulative booking frequency.

---

## 🛠️ Technology Stack

### Frontend (`client/`)
- **Core:** React.js 18, Vite 5, JavaScript (ESModules)
- **Routing:** React Router v6 (protected patient and admin layouts)
- **Networking:** Axios with request/response interceptors for Bearer JWT injection
- **Design System:** Pure CSS (Normal CSS & Responsive CSS) — **No Tailwind CSS**
- **Icons:** Lucide React icons
- **Typography:** Plus Jakarta Sans & Space Grotesk via Google Fonts

### Backend (`server/`)
- **Runtime:** Node.js v20+ / v24+
- **Framework:** Express.js REST API
- **Database Engine:** MongoDB with Mongoose ODM
- **Local Fallback:** Built-in `mongodb-memory-server` ensuring the application runs out-of-the-box locally without external MongoDB configuration.
- **Authentication:** JWT (JSON Web Tokens) with 7-day expiration
- **Security:** bcryptjs password hashing (10 salt rounds), CORS whitelist, input sanitization

---

## 📂 Project Structure

```
EasyWay-Healthcare/
│
├── client/
│   ├── public/
│   │   └── logo.svg                 # Official EasyWay luminous logo
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── AppointmentCard.jsx
│   │   │   ├── DashboardCard.jsx
│   │   │   ├── DepartmentCard.jsx
│   │   │   ├── DoctorCard.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HospitalCard.jsx
│   │   │   ├── LoadingScreen.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── TimeSlotPicker.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Authentication & session restore
│   │   │   └── ToastContext.jsx     # Frontend notification system
│   │   ├── pages/
│   │   │   ├── AboutPage.jsx
│   │   │   ├── AdminAppointmentsPage.jsx
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── AdminDepartmentsPage.jsx
│   │   │   ├── AdminDoctorsPage.jsx
│   │   │   ├── AdminHospitalsPage.jsx
│   │   │   ├── AdminLoginPage.jsx
│   │   │   ├── AdminPatientsPage.jsx
│   │   │   ├── AppointmentDetailPage.jsx
│   │   │   ├── BookAppointmentPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── DepartmentDetailPage.jsx
│   │   │   ├── DepartmentsPage.jsx
│   │   │   ├── DoctorDetailPage.jsx
│   │   │   ├── DoctorsPage.jsx
│   │   │   ├── EmergencyPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── HospitalDetailPage.jsx
│   │   │   ├── HospitalsPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MyAppointmentsPage.jsx
│   │   │   ├── PatientDashboardPage.jsx
│   │   │   ├── PatientProfilePage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── services/
│   │   │   └── api.js               # Centralized Axios API client
│   │   ├── App.jsx
│   │   ├── index.css                # Dark healthcare design tokens & classes
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js                    # MongoDB connection with MongoMemoryServer fallback
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── appointmentController.js
│   │   ├── authController.js
│   │   ├── departmentController.js
│   │   ├── doctorController.js
│   │   └── hospitalController.js
│   ├── middleware/
│   │   ├── auth.js                  # protect & authorize middlewares
│   │   └── errorHandler.js          # Standardized error responses
│   ├── models/
│   │   ├── Appointment.js
│   │   ├── Department.js
│   │   ├── Doctor.js
│   │   ├── Hospital.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── configRoutes.js
│   │   ├── departmentRoutes.js
│   │   ├── doctorRoutes.js
│   │   └── hospitalRoutes.js
│   ├── seed/
│   │   ├── seedData.js              # Real Vijayawada hospitals, depts & doctors
│   │   └── seedRunner.js            # Database seeding utility
│   ├── .env
│   ├── package.json
│   ├── server.js
│   └── testRunner.js                # 21-point automated verification suite
│
├── .env                             # Root environment configuration
├── package.json                     # Root orchestrator
└── README.md
```

---

## ⚙️ Environment Configuration

### Backend Environment (`server/.env` & `.env` at root)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/easyway
JWT_SECRET=easyway_healthcare_production_secret_key_2026_vijayawada
CLIENT_URL=http://localhost:5173

# Platform Details
EASYWAY_LOCATION=Vijayawada, Andhra Pradesh, India
EASYWAY_EMAIL=simhadrirajagmail.com
EASYWAY_CUSTOMER_CARE_PHONE=

# Default Administrator Seed Credentials
ADMIN_NAME=EasyWay Administrator
ADMIN_EMAIL=admin@easyway.com
ADMIN_PASSWORD=Admin@12345EasyWay
ADMIN_PHONE=0866-2488888
```

### Frontend Environment (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- *(Optional)* **MongoDB**: If running a local MongoDB daemon at `mongodb://127.0.0.1:27017/easyway`. If no MongoDB service is running, the application **automatically initializes an in-memory database** so you can run and test immediately.

### 1. Install Dependencies
From the repository root:
```bash
# Install root orchestration tools
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

### 2. Seed Database
Populate the 13 departments, 19 Vijayawada hospitals, verified doctor roster, administrator account, and demo patient account:
```bash
cd server
npm run seed
cd ..
```

---

## 🏃 Running the Application

### Option A: Run Both Concurrently (Recommended)
From the root directory:
```bash
npm run dev
```
This runs the backend on `http://localhost:5000` and the frontend on `http://localhost:5173` (or `5174`).

### Option B: Run Services Separately

**Backend Server:**
```bash
cd server
npm run dev
# Server runs at http://localhost:5000
# Health check: http://localhost:5000/api/health
```

**Frontend Client:**
```bash
cd client
npm run dev
# Client runs at http://localhost:5173
```

---

## 🔐 Pre-Seeded Accounts for Testing

| Role | Email | Password | Access Area |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@easyway.com` | `Admin@12345EasyWay` | `/admin/login` &rarr; `/admin/dashboard` |
| **Demo Patient** | `patient@easyway.com` | `Patient@12345` | `/login` &rarr; `/patient/dashboard` |

*New patients can also register anytime using the public registration form.*

---

## 🧪 Automated Testing Suite
A comprehensive 21-assertion integration test suite verifies endpoints, database integrity, slot concurrency, and role barriers:
```bash
cd server
node testRunner.js
```
**Test Results:**
- `GET /api/health` returns operational status
- `GET /api/config` returns platform branding & "Customer Care: Coming Soon"
- `GET /api/departments` returns 13 active departments
- `GET /api/hospitals` returns 19 Vijayawada hospitals
- `GET /api/hospitals?emergencyOnly=true` returns 24/7 verified emergency units
- `GET /api/doctors` returns verified specialists
- `GET /api/doctors/:id?date=YYYY-MM-DD` returns real-time slot statuses
- `POST /api/auth/register` creates patient with hashed password & JWT
- `POST /api/auth/login` authenticates patient
- `POST /api/appointments` creates reservation with unique `EASY-2026-XXXXX` ID
- **Concurrency Test:** `POST /api/appointments` strictly blocks duplicate booking for identical doctor/date/time with `409 Conflict`
- `GET /api/appointments/my` lists patient bookings
- `PUT /api/appointments/:id/cancel` allows patient cancellation
- `POST /api/auth/login` validates Admin role
- `GET /api/admin/metrics` yields dashboard metrics
- `PUT /api/appointments/:id/status` updates appointment status to Completed
- **Security Check:** Unauthenticated calls blocked with `401 Unauthorized`
- **Security Check:** Non-admin patients blocked from `/api/admin/*` with `403 Forbidden`

---

## 📚 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new patient account
- `POST /api/auth/login` — Login user (Patient or Admin)
- `GET /api/auth/me` — Get authenticated user details (Bearer Token)
- `PUT /api/auth/profile` — Update user name and phone

### Hospitals (`/api/hospitals`)
- `GET /api/hospitals` — List hospitals (Query filters: `department`, `emergencyOnly`, `status`)
- `GET /api/hospitals/:id` — Single hospital details and doctor roster
- `POST /api/hospitals` — Create hospital *(Admin only)*
- `PUT /api/hospitals/:id` — Update hospital *(Admin only)*
- `DELETE /api/hospitals/:id` — Delete hospital *(Admin only)*

### Departments (`/api/departments`)
- `GET /api/departments` — List departments with hospital and doctor counts
- `GET /api/departments/:id` — Department profile with related hospitals and doctors
- `POST /api/departments` — Create department *(Admin only)*
- `PUT /api/departments/:id` — Update department *(Admin only)*
- `DELETE /api/departments/:id` — Delete department *(Admin only)*

### Doctors (`/api/doctors`)
- `GET /api/doctors` — List doctors (Filters: `department`, `hospital`, `status`)
- `GET /api/doctors/:id` — Doctor profile with date-specific slot statuses (`?date=YYYY-MM-DD`)
- `POST /api/doctors` — Create doctor *(Admin only)*
- `PUT /api/doctors/:id` — Update doctor *(Admin only)*
- `DELETE /api/doctors/:id` — Delete doctor *(Admin only)*

### Appointments (`/api/appointments`)
- `POST /api/appointments` — Book appointment with slot conflict check
- `GET /api/appointments/my` — List logged in patient's appointments
- `GET /api/appointments/:id` — Single appointment details
- `PUT /api/appointments/:id/cancel` — Cancel appointment with reason
- `PUT /api/appointments/:id/reschedule` — Reschedule date and time slot
- `GET /api/appointments` — List all appointments with filters *(Admin only)*
- `PUT /api/appointments/:id/status` — Change status *(Admin only)*
- `DELETE /api/appointments/:id` — Delete appointment *(Admin only)*

### Admin Analytics (`/api/admin`)
- `GET /api/admin/metrics` — Dashboard totals and status breakdown *(Admin only)*
- `GET /api/admin/patients` — Registered patients with total booking counts *(Admin only)*

### Platform Config (`/api/config`)
- `GET /api/config` — Public contact and customer care status

---

## 🏥 Hospital Data & Source Verification
Every hospital and practitioner record includes `source` and `lastVerified` fields to prevent inaccurate claims:
- **Aster Ramesh Hospital** — Collector Office Road, MG Road
- **Manipal Hospital Vijayawada** — Tadepalli, Guntur-Vijayawada Highway
- **Sentini City Hospital** — Ring Road
- **Srikara Hospitals** — Opposite PVP Square Mall, MG Road
- **Aayush Hospitals** — Near Benz Circle
- **Andhra Hospitals** — Suryaraopeta & Governorpet
- **Andhra Hospital Heart & Brain Institute** — Prakasam Road
- **S V R Neuro & Multi Speciality Hospitals** — Hanumanpet
- **Vijaya Super Speciality Hospital** — Suryaraopeta
- **Nagarjuna Hospitals** — Kanuru
- **Medicare Multispeciality Hospital** — Governorpet
- **Unity Hospitals** — Eluru Road
- **Nori Hospitals** — Ring Road
- **Latha Super Speciality Hospital** — Suryaraopeta
- **Manvi Hospitals** — Benz Circle
- **Apple Hospitals** — Gunadala
- **Vasudha Hospitals** — Bunder Road
- **Prashanthi Multi Speciality Hospital** — Suryaraopeta
- **Ashoka Hospitals** — Governorpet

*Unverified medical claims and fake practitioner names are strictly prohibited. Where doctor rosters are not officially published, the platform displays the fallback contact note.*

---

## 🚢 Deployment Guidelines

### Production Build
To create an optimized production bundle of the client:
```bash
cd client
npm run build
```
This generates static assets in `client/dist/`.

### Serving with Node.js
In a production container or cloud VM:
1. Set `NODE_ENV=production` in `server/.env`.
2. Configure a live MongoDB connection URI in `MONGO_URI`.
3. Provide your secure `JWT_SECRET`.
4. Point `CLIENT_URL` to your production domain.
5. Use a process manager like **PM2**:
```bash
pm2 start server/server.js --name "easyway-api"
```

---

## 🛠️ Common Errors & Troubleshooting

1. **Port 5000 Already in Use (`EADDRINUSE`)**:
   - Run in PowerShell: `Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess`
   - Terminate the occupying process: `Stop-Process -Id <PID> -Force`
2. **MongoDB Connection Failed**:
   - The server is equipped with automatic failover to `mongodb-memory-server` and will continue running smoothly even if no MongoDB daemon is installed on the host.
3. **Time Slot Already Booked**:
   - The platform enforces real-time slot locking. If another patient reserved that exact slot for that doctor on that date, choose an alternate green slot.
4. **Vite Port Conflict**:
   - If port 5173 is occupied, Vite will automatically select 5174. The backend CORS is configured to accept both ports.

---

## 📄 License & Attribution
Developed for **EASYWAY — Healthcare Appointment Platform**  
Vijayawada, Andhra Pradesh, India  
&copy; 2026 EasyWay. All rights reserved.
