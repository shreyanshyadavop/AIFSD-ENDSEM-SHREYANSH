# ⚡ Smart Complaint Management System

> AI-Powered MERN Stack application for civic complaint management — built for B.Tech 4th Semester ESE (AI308B)

---

## 📁 Project Structure

```
smart-complaint-system/
├── backend/
│   ├── config/         → MongoDB connection
│   ├── controllers/    → authController, complaintController, aiController
│   ├── middleware/     → JWT auth middleware
│   ├── models/         → User.js, Complaint.js (Mongoose schemas)
│   ├── routes/         → authRoutes, complaintRoutes, aiRoutes
│   ├── server.js       → Express app entry point
│   ├── .env.example    → Environment variable template
│   └── package.json
├── frontend/
│   ├── public/         → index.html
│   ├── src/
│   │   ├── context/    → AuthContext (JWT state)
│   │   ├── pages/      → Home, Login, Signup, RegisterComplaint, ComplaintList,
│   │   │                  ComplaintDetail, EditComplaint
│   │   ├── utils/      → api.js (axios wrappers)
│   │   ├── components/ → Navbar
│   │   ├── App.js      → React Router setup
│   │   └── index.css   → Global styles
│   └── package.json
├── README.md
└── package.json        → Root scripts (run both services)
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/smart-complaint-system.git
cd smart-complaint-system
npm run install-all
```

### 2. Configure Environment Variables

**Backend** — create `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/complaint_db
JWT_SECRET=your_strong_secret_key
ANTHROPIC_API_KEY=your_anthropic_api_key
NODE_ENV=development
```

**Frontend** — create `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Run (Development)

```bash
npm run dev
```

Frontend → http://localhost:3000  
Backend  → http://localhost:5000

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint            | Description         | Auth |
|--------|---------------------|---------------------|------|
| POST   | /api/auth/register  | Register user       | No   |
| POST   | /api/auth/login     | Login               | No   |
| GET    | /api/auth/me        | Get current user    | JWT  |

### Complaints
| Method | Endpoint                          | Description              | Auth  |
|--------|-----------------------------------|--------------------------|-------|
| POST   | /api/complaints                   | Add complaint            | No    |
| GET    | /api/complaints                   | Get all (filter/page)    | No    |
| GET    | /api/complaints/:id               | Get one complaint        | No    |
| PUT    | /api/complaints/:id               | Update status            | JWT   |
| DELETE | /api/complaints/:id               | Delete complaint         | Admin |
| GET    | /api/complaints/search?location=X | Search by location       | No    |

### AI
| Method | Endpoint             | Description          | Auth |
|--------|----------------------|----------------------|------|
| POST   | /api/ai/analyze      | Analyze complaint    | No   |
| POST   | /api/ai/analyze/:id  | Analyze & save       | JWT  |

---

## 🤖 AI Features (Anthropic Claude)

- **Priority Detection** → Low / Medium / High / Critical
- **Department Recommendation** → Water Dept, Electricity Board, etc.
- **Auto Summary** → 2-3 sentence summary of complaint
- **Auto Response** → Polite message sent back to complainant

---

## 🔐 Authentication & Security

- JWT tokens (7-day expiry)
- bcrypt password hashing (salt rounds: 10)
- Protected routes via middleware
- Admin-only delete endpoint

---

## 🗄️ MongoDB Schema

### User
```js
{ name, email, password (hashed), role: ['user','admin'], timestamps }
```

### Complaint
```js
{
  name, email, title, description,
  category: enum[8 options],
  location, status: enum[4 options],
  aiAnalysis: { priority, department, summary, autoResponse },
  user: ObjectId ref,
  timestamps
}
```

---

## ☁️ Deployment on Render

### Backend
1. Create a **Web Service** on Render
2. Connect your GitHub repo, set root to `backend/`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables (MONGO_URI, JWT_SECRET, ANTHROPIC_API_KEY)

### Frontend
1. Create a **Static Site** on Render
2. Set root to `frontend/`
3. Build command: `npm install && npm run build`
4. Publish directory: `build`
5. Add: `REACT_APP_API_URL=https://your-backend.onrender.com/api`

---

## 📋 Test Cases

### Complaint API
| Test Case           | Expected Output           |
|---------------------|---------------------------|
| POST valid complaint | 201 – Complaint stored   |
| POST missing title  | 400 – Validation error    |
| POST invalid email  | 400 – Email error         |
| GET /search?location=Ghaziabad | Matching complaints |
| PUT /:id (with JWT) | Status updated            |
| DELETE (no token)   | 401 Unauthorized          |

### AI API
| Complaint Type   | Expected AI Output           |
|------------------|------------------------------|
| Water leakage    | Water Dept, High priority    |
| Electricity issue| Electricity Board, Critical  |
| Garbage complaint| Sanitation Dept, Medium      |
| Long description | AI-generated summary         |

---

## 👨‍💻 Tech Stack

| Layer    | Technology                     |
|----------|--------------------------------|
| Frontend | React 18, React Router v6, Axios |
| Backend  | Node.js, Express.js            |
| Database | MongoDB, Mongoose              |
| AI       | Anthropic Claude API           |
| Auth     | JWT + bcryptjs                 |
| Deploy   | Render.com                     |

---

## 📸 Screenshots
*(Add Postman, MongoDB, and deployment screenshots here in the PDF submission)*

---

## 🔗 Links
- **Frontend URL**: https://smart-complaint-frontend.onrender.com
- **Backend API URL**: https://smart-complaint-backend.onrender.com
- **GitHub**: https://github.com/YOUR_USERNAME/smart-complaint-system
