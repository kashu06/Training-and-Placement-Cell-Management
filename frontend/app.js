let currentUser = null;

window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  if (token && user) {
    currentUser = JSON.parse(user);
    api.token = token;
  }
  loadHome();
});

function showPage(pageName) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  const page = document.getElementById(pageName);
  if (page) {
    page.classList.add('active');
  }
}

function showAlert(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  
  const container = document.querySelector('.container');
  if (container) {
    container.insertBefore(alertDiv, container.firstChild);
    setTimeout(() => alertDiv.remove(), 5000);
  }
}

function openModal(content) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = content;
  modal.style.display = 'block';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

window.onclick = (event) => {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUser = null;
  api.token = null;
  loadHome();
}

function renderHeader() {
  let headerHTML = `
    <div class="header-content">
      <div class="logo" onclick="loadHome()" style="cursor: pointer;">TPO NIT Hamirpur</div>
      <div class="nav-buttons">
  `;

  if (currentUser) {
    headerHTML += `
      <div class="user-info">
        Welcome, ${currentUser.name} (${currentUser.role})
      </div>
      <button class="btn btn-danger logout-btn" onclick="logout()">Logout</button>
    `;
  } else {
    headerHTML += `
      <button class="btn btn-primary" onclick="showLoginSignupModal('admin')">Admin</button>
      <button class="btn btn-secondary" onclick="showLoginSignupModal('student')">Student</button>
      <button class="btn btn-secondary" onclick="showLoginSignupModal('company')">Company</button>
    `;
  }

  headerHTML += `
      </div>
    </div>
  `;

  return headerHTML;
}

function loadHome() {
  const app = document.getElementById('app');
  let content = renderHeader();
  
  if (!currentUser) {
    content += `
      <div class="home-hero">
        <h1>Training & Placement Cell</h1>
        <p>Connecting Students with Best Job & Internship Opportunities</p>
      </div>
      <div class="container">
        <div class="role-cards">
          <div class="role-card">
            <h2>👨‍🎓 Student</h2>
            <p>Apply for internships and job placements, track your applications, and manage your profile.</p>
            <button class="btn btn-primary" onclick="showLoginSignupModal('student')">Get Started</button>
          </div>
          <div class="role-card">
            <h2>🏢 Company</h2>
            <p>Post job openings, manage applicants, and find the best talent for your organization.</p>
            <button class="btn btn-secondary" onclick="showLoginSignupModal('company')">Get Started</button>
          </div>
          <div class="role-card">
            <h2>👨‍💼 Admin</h2>
            <p>Monitor all activities, manage student profiles, companies, and view analytics.</p>
            <button class="btn btn-info" onclick="showLoginSignupModal('admin')">Get Started</button>
          </div>
        </div>
      </div>
    `;
  } else {
    // Render appropriate dashboard
    if (currentUser.role === 'student') {
      content += loadStudentDashboard();
    } else if (currentUser.role === 'company') {
      content += loadCompanyDashboard();
    } else if (currentUser.role === 'admin') {
      content += loadAdminDashboard();
    }
  }

  content += `<footer>&copy; 2026 Training & Placement Cell. .</footer>`;
  app.innerHTML = content;
  
  // Initialize dashboard if user is logged in
  if (currentUser) {
    setTimeout(() => {
      if (currentUser.role === 'student' && typeof initStudentDashboard === 'function') {
        initStudentDashboard();
      } else if (currentUser.role === 'company' && typeof initCompanyDashboard === 'function') {
        initCompanyDashboard();
      } else if (currentUser.role === 'admin' && typeof initAdminDashboard === 'function') {
        initAdminDashboard();
      }
    }, 100);
  }
}

function showLoginSignupModal(role) {
  let title = role.charAt(0).toUpperCase() + role.slice(1);
  const content = `
    <h2 id="form-title">${title} Login</h2>
    <div id="form-container"></div>
    <div class="form-links">
      <span>Don't have an account? <a onclick="switchForm('${role}', 'signup')">Sign Up</a></span>
      <br><br>
      <a onclick="closeModal()">Close</a>
    </div>
  `;
  openModal(content);
  renderLoginForm(role);
}

function switchForm(role, type) {
  renderLoginForm(role, type);
}

function renderLoginForm(role, type = 'login') {
  const container = document.getElementById('form-container');
  const title = document.getElementById('form-title');
  
  let formHTML = '';

  if (type === 'login') {
    title.textContent = `${role.charAt(0).toUpperCase() + role.slice(1)} Login`;
    formHTML = `
      <form onsubmit="handleLogin(event, '${role}')">
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="email" required>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="password" required>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
      </form>
    `;
  } else {
    title.textContent = `${role.charAt(0).toUpperCase() + role.slice(1)} Sign Up`;

    if (role === 'admin') {
      formHTML = `
        <form onsubmit="handleSignup(event, '${role}')">
          <div class="form-group">
            <label>Name</label>
            <input type="text" id="name" required>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="email" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="password" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Sign Up</button>
        </form>
      `;
    } else if (role === 'student') {
      formHTML = `
        <form onsubmit="handleSignup(event, '${role}')">
          <div class="form-group">
            <label>Roll No</label>
            <input type="text" id="roll_no" required>
          </div>
          <div class="form-group">
            <label>Name</label>
            <input type="text" id="name" required>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="email" required>
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="tel" id="phone">
          </div>
          <div class="form-group">
            <label>Branch</label>
            <select id="branch" required>
              <option value="">Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
            </select>
          </div>
          <div class="form-group">
            <label>Batch</label>
            <input type="number" id="batch" required>
          </div>
          <div class="form-group">
            <label>CGPA</label>
            <input type="number" id="cgpa" step="0.01" min="0" max="10">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="password" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Sign Up</button>
        </form>
      `;
    } else if (role === 'company') {
      formHTML = `
        <form onsubmit="handleSignup(event, '${role}')">
          <div class="form-group">
            <label>Company Name</label>
            <input type="text" id="company_name" required>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="email" required>
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="tel" id="phone">
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="password" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Sign Up</button>
        </form>
      `;
    }
  }

  container.innerHTML = formHTML;
}

async function handleLogin(event, role) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    let response;
    if (role === 'admin') {
      response = await api.adminLogin(email, password);
    } else if (role === 'student') {
      response = await api.studentLogin(email, password);
    } else if (role === 'company') {
      response = await api.companyLogin(email, password);
    }

    localStorage.setItem('token', response.token);
    const user = response.user;
    user.role = role;
    localStorage.setItem('user', JSON.stringify(user));
    currentUser = user;
    api.token = response.token;

    closeModal();
    showAlert('Login successful!', 'success');
    loadHome();
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

async function handleSignup(event, role) {
  event.preventDefault();

  try {
    let response;
    if (role === 'admin') {
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      response = await api.adminSignup(name, email, password);
    } else if (role === 'student') {
      const roll_no = document.getElementById('roll_no').value;
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const branch = document.getElementById('branch').value;
      const batch = document.getElementById('batch').value;
      const cgpa = document.getElementById('cgpa').value;
      const password = document.getElementById('password').value;
      response = await api.studentSignup(roll_no, name, email, phone, branch, batch, cgpa, password);
    } else if (role === 'company') {
      const company_name = document.getElementById('company_name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const password = document.getElementById('password').value;
      response = await api.companySignup(company_name, email, phone, password);
    }

    localStorage.setItem('token', response.token);
    const user = response.user;
    user.role = role;
    localStorage.setItem('user', JSON.stringify(user));
    currentUser = user;
    api.token = response.token;

    closeModal();
    showAlert('Sign up successful!', 'success');
    loadHome();
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

function loadStudentDashboard() {
  return `
    <div class="container">
      <div class="dashboard-header">
        <h1>Student Dashboard</h1>
      </div>
      <div id="student-content"></div>
    </div>
  `;
}

function loadCompanyDashboard() {
  return `
    <div class="container">
      <div class="dashboard-header">
        <h1>Company Dashboard</h1>
      </div>
      <div id="company-content"></div>
    </div>
  `;
}

function loadAdminDashboard() {
  return `
    <div class="container">
      <div class="dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>
      <div id="admin-content"></div>
    </div>
  `;
}

// Initialize app
loadHome();
