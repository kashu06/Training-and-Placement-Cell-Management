# Troubleshooting Guide

## Common Issues & Solutions

### 🔴 Backend Issues

#### Issue 1: "Cannot find module 'express'"
**Error:** 
```
Error: Cannot find module 'express'
```

**Solution:**
1. Make sure you're in the `backend` folder
2. Run: `npm install`
3. Check if `node_modules` folder exists
4. Run again: `npm start`

---

#### Issue 2: "Port 5000 already in use"
**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
1. Change the port in `.env`:
   ```
   PORT=5001
   ```
2. Or kill the existing process:
   - **Windows**: `netstat -ano | findstr :5000` then `taskkill /PID xxxx /F`
   - **Mac/Linux**: `lsof -i :5000` then `kill -9 PID`

---

#### Issue 3: "Database Connection Error"
**Error:**
```
Error: Access denied for user 'root'@'localhost'
```

**Solution:**
1. Check MySQL is running
2. Verify credentials in `.env`:
   ```
   DB_USER=root
   DB_PASSWORD=your_actual_password
   ```
3. Test MySQL connection:
   ```
   mysql -u root -p
   ```
4. If password is wrong, reset it:
   - Windows: Use MySQL Installer
   - Mac: `mysql_secure_installation`

---

#### Issue 4: "Database 'training_placement_db' doesn't exist"
**Error:**
```
Error: Unknown database 'training_placement_db'
```

**Solution:**
1. Create database via MySQL:
   ```sql
   CREATE DATABASE IF NOT EXISTS training_placement_db;
   ```
2. Run the full schema (see README.md Database section)
3. Verify: `SHOW DATABASES;` should list training_placement_db

---

#### Issue 5: "Unexpected token < in JSON at position 0"
**Error in Browser Console:**
```
SyntaxError: Unexpected token < in JSON at position 0
```

**Cause:** Backend is not running or not responding

**Solution:**
1. Check if backend server is running:
   ```
   npm start
   ```
   You should see: `Server running on port 5000`
2. Test backend health:
   ```
   curl http://localhost:5000/api/health
   ```
   Should return: `{"message":"Server is running"}`
3. Check `API_BASE_URL` in `frontend/api.js`:
   ```javascript
   const API_BASE_URL = 'http://localhost:5000/api';
   ```

---

#### Issue 6: "CORS error" or "Access to XMLHttpRequest blocked"
**Error:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' 
from origin 'http://localhost:8000' has been blocked by CORS policy
```

**Solution:**
1. Make sure backend is running
2. Check `server.js` has CORS middleware:
   ```javascript
   const cors = require('cors');
   app.use(cors());
   ```
3. Restart backend: `npm start`

---

#### Issue 7: "Bcrypt error" or "Cannot find module 'bcrypt'"
**Error:**
```
Error: Cannot find module 'bcrypt'
```

**Solution:**
1. `bcrypt` requires compilation. Make sure you have:
   - Node.js dev tools
   - Python 3.x installed
   - Visual Studio Build Tools (Windows)
2. Clear and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

### 🟡 Frontend Issues

#### Issue 8: "Blank page or nothing loads"
**Symptom:** Visiting http://localhost:8000 shows blank page

**Solution:**
1. Check browser console (F12) for errors
2. Verify Frontend server is running:
   - You should see something like:
   ```
   Starting up http-server, serving .
   Available on:
     http://127.0.0.1:8000
   ```
3. Clear browser cache: Ctrl+Shift+Delete
4. Hard refresh: Ctrl+Shift+R

---

#### Issue 9: "Cannot read property 'classList' of null"
**Error in Console:**
```
TypeError: Cannot read property 'classList' of null
```

**Cause:** HTML elements not found when JavaScript runs

**Solution:**
1. Make sure all JavaScript files are loaded:
   ```html
   <script src="api.js"></script>
   <script src="app.js"></script>
   <script src="student-dashboard.js"></script>
   <script src="company-dashboard.js"></script>
   <script src="admin-dashboard.js"></script>
   ```
2. All files should be in `frontend/` folder
3. Reload page

---

#### Issue 10: "API calls return 401 Unauthorized"
**Error:**
```json
{
  "message": "Access token required"
}
```

**Solution:**
1. Login first - you need a token
2. Check if token is saved in localStorage:
   - Open DevTools → Application → localStorage
   - Look for `token` key
3. If missing:
   - Logout and login again
   - Check network tab to see login response

---

#### Issue 11: "API calls return 403 Forbidden"
**Error:**
```json
{
  "message": "Unauthorized: Insufficient permissions"
}
```

**Solution:**
1. You're logged in but don't have permission
2. Check your role:
   - Open DevTools → Application → localStorage
   - Look for `user` key and check `role`
3. Use correct role:
   - Student can only apply for jobs
   - Company can only post jobs & update applications
   - Admin can access admin endpoints
4. Logout and login with correct role

---

#### Issue 12: "Login/Signup fails silently"
**Symptom:** Form submits but nothing happens

**Solution:**
1. Check browser console (F12) for errors
2. Check Network tab:
   - See if request is being sent
   - Check Response status (should be 200 or 201)
   - Check response body for error message
3. Common reasons:
   - Email already exists (use different email)
   - Missing required fields
   - Invalid input format
   - Backend not running

---

#### Issue 13: "Cannot apply for job"
**Error:**
```
Your CGPA is below the minimum required CGPA
Your branch is not eligible for this job
Student has already applied for this job
```

**Solution:**
1. **CGPA Issue**: Update your CGPA in profile
   - Go to Student Dashboard → My Profile → Edit Profile
   - Update CGPA to meet job requirement
2. **Branch Issue**: Job is for different branch
   - View job details to see eligible branches
   - Cannot apply if your branch isn't listed
   - This is by design for eligibility
3. **Already Applied**: You've already applied to this job
   - Check "My Applications" tab
   - Cannot apply twice to same job

---

### 🟢 Database Issues

#### Issue 14: "UNIQUE constraint failed"
**Error:**
```
SequelizeUniqueConstraintError: Duplicate entry 'email@example.com' for key 'email'
```

**Solution:**
1. Email already exists in database
2. Signup with different email
3. Or check if you already have account
4. To delete account manually:
   ```sql
   DELETE FROM student WHERE email = 'email@example.com';
   ```

---

#### Issue 15: "Data not saving to database"
**Symptom:** Create/update works but data disappears on refresh

**Solution:**
1. Verify database connection:
   - Check `.env` credentials
   - Run: `mysql -u root -p training_placement_db`
   - Check table: `SELECT * FROM student;`
2. Check backend logs for errors
3. Verify all models are synced:
   - Models auto-sync in server.js
   - Check for error messages during startup

---

#### Issue 16: "Foreign key constraint fails"
**Error:**
```
Error: Cannot add or update a child row: a foreign key constraint fails
```

**Solution:**
1. You're trying to reference non-existent parent record
   - Example: Job with non-existent company_id
2. Create the parent record first:
   - Create company before posting jobs
   - Create job before applying
3. Ensure data integrity in requests

---

### 🔵 Authentication Issues

#### Issue 17: "Token expired"
**Error:**
```
Error: invalid token
```

**Solution:**
1. Tokens are valid for 7 days
2. Logout and login again:
   - Click Logout button
   - Login with credentials
3. Or manually clear and refresh:
   - DevTools → Application → localStorage
   - Delete `token` and `user`
   - Refresh page

---

#### Issue 18: "Cannot logout"
**Symptom:** Logout button doesn't work

**Solution:**
1. Check if logout button is visible
2. Open console and run: `logout()`
3. Manually clear localStorage:
   ```javascript
   localStorage.clear();
   window.location.reload();
   ```

---

#### Issue 19: "Weak password error"
**Error:**
```
Password too weak
```

**Solution:**
1. Use stronger password with:
   - At least 6 characters
   - Mix of uppercase and lowercase
   - Numbers and special characters
2. Example: `Pass@123`

---

### 🟠 General Troubleshooting Steps

#### Step 1: Check Prerequisites
```bash
# Check Node.js
node --version          # Should be v14+

# Check npm
npm --version          # Should be v6+

# Check MySQL
mysql --version        # Should be v5.7+
```

#### Step 2: Verify Setup
1. Database exists: `mysql -u root -p -e "SHOW DATABASES;"`
2. Backend runs: `npm start` in backend folder
3. Frontend runs: `http-server -p 8000` in frontend folder

#### Step 3: Check Connectivity
```bash
# Test backend
curl http://localhost:5000/api/health

# Test database
mysql -u root -p training_placement_db -e "SHOW TABLES;"
```

#### Step 4: Monitor Logs
1. **Backend**: Watch terminal for errors
2. **Frontend**: Open DevTools (F12) → Console tab
3. **Database**: MySQL error logs

#### Step 5: Clear Cache & Restart
1. Clear browser cache: Ctrl+Shift+Delete
2. Close backend: Ctrl+C
3. Restart backend: `npm start`
4. Refresh frontend: Ctrl+Shift+R

---

### 🔧 Advanced Debugging

#### Enable Debug Logging
In `backend/server.js`, change:
```javascript
logging: false,  // Change to: console.log
```

#### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action (login, apply for job)
4. Click request and check:
   - Request headers (includes Authorization)
   - Response status code
   - Response body

#### Test API Manually
```bash
# Login
curl -X POST http://localhost:5000/api/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"password123"}'

# Get token from response, then use it
curl -X GET http://localhost:5000/api/students/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📞 Getting Help

If issue persists:
1. **Check Error Message**: Read the exact error carefully
2. **Check Logs**: Look at console and terminal
3. **Check Network**: Use DevTools → Network tab
4. **Verify Setup**: Follow README.md setup steps again
5. **Search Error**: Google the exact error message

---

## ✅ Verification Checklist

- [ ] Node.js installed (`node --version`)
- [ ] MySQL running (can login with `mysql -u root -p`)
- [ ] Database created (`training_placement_db`)
- [ ] Backend dependencies installed (`npm install`)
- [ ] .env file configured with correct DB credentials
- [ ] Backend running (`npm start` shows "Server running on port 5000")
- [ ] Frontend running (`http://localhost:8000` loads)
- [ ] Can signup/login
- [ ] Can view jobs (student)
- [ ] Can post job (company)
- [ ] Can view applicants (company)

---

**Last Updated**: March 26, 2024
