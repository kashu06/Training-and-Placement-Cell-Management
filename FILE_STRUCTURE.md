# Project File Structure

## Complete Directory Listing

```
tpo website/                          # Root Project Directory
│
├── README.md                         # Main documentation
├── QUICK_START.md                    # Quick setup guide
├── API_DOCUMENTATION.md              # API reference
├── FILE_STRUCTURE.md                 # This file
├── TROUBLESHOOTING.md                # Troubleshooting guide
│
│
├── 📁 backend/                       # Backend Server (Node.js/Express)
│   │
│   ├── server.js                     # Main Express application entry point
│   ├── package.json                  # Node.js dependencies
│   ├── .env                          # Environment variables (DO NOT COMMIT)
│   ├── .env.sample                   # Sample .env template
│   ├── .gitignore                    # Git ignore patterns
│   │
│   ├── 📁 config/                    # Configuration Files
│   │   └── database.js               # MySQL/Sequelize connection setup
│   │
│   ├── 📁 models/                    # Database Models (Sequelize ORM)
│   │   ├── index.js                  # Model exports
│   │   ├── Admin.js                  # Admin model
│   │   ├── Student.js                # Student model
│   │   ├── Company.js                # Company model
│   │   ├── CompanyLocation.js        # Company locations model
│   │   ├── Job.js                    # Job posting model
│   │   ├── JobEligibility.js         # Job eligibility criteria model
│   │   └── Application.js            # Job application model
│   │
│   ├── 📁 controllers/               # Business Logic Controllers
│   │   ├── authController.js         # Authentication (login/signup)
│   │   ├── studentController.js      # Student operations
│   │   ├── companyController.js      # Company operations
│   │   ├── jobController.js          # Job posting operations
│   │   ├── applicationController.js  # Application management
│   │   └── adminController.js        # Admin dashboard operations
│   │
│   ├── 📁 routes/                    # API Routes
│   │   ├── authRoutes.js             # Auth endpoints (/auth/*)
│   │   ├── studentRoutes.js          # Student endpoints (/students/*)
│   │   ├── companyRoutes.js          # Company endpoints (/companies/*)
│   │   ├── jobRoutes.js              # Job endpoints (/jobs/*)
│   │   ├── applicationRoutes.js      # Application endpoints (/applications/*)
│   │   └── adminRoutes.js            # Admin endpoints (/admin/*)
│   │
│   └── 📁 middleware/                # Middleware Functions
│       └── auth.js                   # JWT authentication & authorization
│
│
└── 📁 frontend/                      # Frontend Web Application (Vanilla JS)
    │
    ├── index.html                    # Main HTML file (entry point)
    ├── styles.css                    # Global CSS styles
    │
    ├── 📁 JavaScript Files
    │   ├── api.js                    # API client class & methods
    │   ├── app.js                    # Main app logic & routing
    │   ├── student-dashboard.js      # Student dashboard functionality
    │   ├── company-dashboard.js      # Company dashboard functionality
    │   └── admin-dashboard.js        # Admin dashboard functionality
    │
    └── Assets
        └── (Images/fonts can be added here)
```

---

## 📋 File Descriptions

### Backend Files

#### Core Files
| File | Purpose |
|------|---------|
| `server.js` | Express app initialization, routes setup, DB connection |
| `package.json` | Node.js dependencies & scripts |
| `.env` | MySQL credentials, JWT secret, port config |
| `sample.env` | Template for .env file |

#### Database Models (`models/`)
| File | Represents |
|------|-----------|
| `Admin.js` | Admin user table schema |
| `Student.js` | Student profile & credentials |
| `Company.js` | Company information |
| `CompanyLocation.js` | Company office locations |
| `Job.js` | Job/internship postings |
| `JobEligibility.js` | Branch eligibility for jobs |
| `Application.js` | Student job applications |

#### Controllers (`controllers/`)
| File | Handles |
|------|---------|
| `authController.js` | Login/signup for all 3 roles |
| `studentController.js` | Student profile CRUD |
| `companyController.js` | Company profile & locations CRUD |
| `jobController.js` | Job CRUD operations |
| `applicationController.js` | Job applications & status updates |
| `adminController.js` | Admin dashboard & statistics |

#### Routes (`routes/`)
| File | Maps Endpoints |
|------|----------------|
| `authRoutes.js` | POST /api/auth/* |
| `studentRoutes.js` | GET/PUT /api/students/* |
| `companyRoutes.js` | GET/PUT/POST /api/companies/* |
| `jobRoutes.js` | GET/POST/PUT/DELETE /api/jobs/* |
| `applicationRoutes.js` | GET/POST/PUT /api/applications/* |
| `adminRoutes.js` | GET /api/admin/* |

#### Middleware (`middleware/`)
| File | Purpose |
|------|---------|
| `auth.js` | JWT verification & role-based access control |

---

### Frontend Files

#### HTML
| File | Purpose |
|------|---------|
| `index.html` | Main page with modal container |

#### CSS
| File | Purpose |
|------|---------|
| `styles.css` | All styling for responsive UI |

#### JavaScript

| File | Purpose |
|------|---------|
| `api.js` | APIClient class - all HTTP requests to backend |
| `app.js` | Main routing, auth UI, home page, user management |
| `student-dashboard.js` | Student profile, jobs, applications views |
| `company-dashboard.js` | Company jobs, applicants, posting management |
| `admin-dashboard.js` | Admin stats, students, companies, jobs, apps views |

---

## 🔄 Data Flow

```
User Browser
    ↓
Frontend (Frontend/)
├─ User clicks button
├─ JavaScript event handler
├─ api.js makes HTTP request to backend
    ↓
Backend Server (localhost:5000)
├─ Routes match the endpoint
├─ Middleware checks JWT token & role
├─ Controller executes business logic
├─ Model interacts with database
    ↓
MySQL Database
├─ Query executed
├─ Data returned
    ↓
Backend Response
    ↓
Frontend (api.js)
├─ Parse response
├─ Update UI
    ↓
User sees updated content
```

---

## 📊 Database Schema Relationships

```
admin
  ├─ (standalone)

student
  ├─ application → job

company
  ├─ company_location (1:many)
  └─ job → job_eligibility (1:many)

job
  ├─ company (1:many reverse)
  ├─ application (1:many)
  └─ job_eligibility (1:many)

job_eligibility
  ├─ job (many:1)

application
  ├─ student (many:1)
  └─ job (many:1)

company_location
  ├─ company (many:1)
```

---

## 🔐 Authentication Flow

```
1. User fills signup/login form (frontend)
2. Form submits to /auth/{role}/login or /auth/{role}/signup
3. Backend validates credentials/creates new user
4. Backend generates JWT token
5. Token returned to frontend
6. Frontend stores in localStorage
7. Each API request includes token in header
8. Backend middleware verifies token & role
9. Request processed or rejected based on authorization
```

---

## 💾 Environment Variables

### .env File Variables

```
DB_HOST=localhost                      # MySQL hostname
DB_USER=root                          # MySQL username
DB_PASSWORD=root                      # MySQL password
DB_NAME=training_placement_db         # Database name
DB_PORT=3306                          # MySQL port
JWT_SECRET=secret_key_here            # JWT signing secret
PORT=5000                             # Backend server port
NODE_ENV=development                  # Environment mode
```

---

## 🚀 Startup Sequence

1. **MySQL Server** starts and listens on port 3306
2. **Backend Server** starts:
   - Loads .env variables
   - Creates database connection
   - Initializes Sequelize models
   - Starts listening on port 5000
3. **Frontend Server** starts:
   - Serves static files on port 8000
   - Browser loads index.html
   - JavaScript files load in order:
     1. api.js (APIClient class)
     2. app.js (main app logic)
     3. student-dashboard.js (if needed)
     4. company-dashboard.js (if needed)
     5. admin-dashboard.js (if needed)

---

## 📦 Key Dependencies

### Backend (Node.js)
- **express**: Web framework
- **sequelize**: ORM for MySQL
- **mysql2**: MySQL driver
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT tokens
- **cors**: Cross-origin requests
- **dotenv**: Environment variables

### Frontend
- **No dependencies** - Vanilla JavaScript
- Uses Fetch API for HTTP requests
- localStorage for token storage

---

## 📝 Code Organization

### Backend - MVC Pattern
- **Models**: Database schemas (models/)
- **Views**: JSON responses from controllers
- **Controllers**: Business logic (controllers/)
- **Routes**: API endpoints mapping

### Frontend - Modular Structure
- **api.js**: API communication layer
- **app.js**: Core app & routing logic
- ***-dashboard.js**: UI components & interactions

---

## 🔗 URL Mapping

| Path | File | Purpose |
|------|------|---------|
| http://localhost:8000 | index.html | Frontend entry |
| http://localhost:5000 | server.js | Backend API |
| http://localhost:5000/api/auth/* | authRoutes.js | Authentication |
| http://localhost:5000/api/students/* | studentRoutes.js | Student data |
| http://localhost:5000/api/companies/* | companyRoutes.js | Company data |
| http://localhost:5000/api/jobs/* | jobRoutes.js | Job data |
| http://localhost:5000/api/applications/* | applicationRoutes.js | Applications |
| http://localhost:5000/api/admin/* | adminRoutes.js | Admin data |

---

## 📄 File Sizes

| Category | Files | Size | Notes |
|----------|-------|------|-------|
| Backend | 12 | ~25KB | Excluding node_modules |
| Frontend | 6 | ~80KB | HTML, CSS, JS combined |
| Documents | 5 | ~50KB | README, guides, docs |
| **Total** | **23** | **~155KB** | Ready for production |

---

**Last Updated**: March 26, 2024
**Version**: 1.0.0
