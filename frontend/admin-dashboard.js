// Admin Dashboard Management

async function initAdminDashboard() {
  const container = document.getElementById('admin-content');
  
  container.innerHTML = `
    <div class="dashboard-nav" style="margin-bottom: 30px; display: flex; gap: 10px; flex-wrap: wrap;">
      <button class="btn btn-primary" onclick="showAdminSection('stats')">Dashboard</button>
      <button class="btn btn-primary" onclick="showAdminSection('students')">Students</button>
      <button class="btn btn-primary" onclick="showAdminSection('companies')">Companies</button>
      <button class="btn btn-primary" onclick="showAdminSection('jobs')">Jobs</button>
      <button class="btn btn-primary" onclick="showAdminSection('applications')">Applications</button>
    </div>
    <div id="section-content"></div>
  `;

  showAdminSection('stats');
}

async function showAdminSection(section) {
  const container = document.getElementById('section-content');

  if (section === 'stats') {
    await showAdminStats(container);
  } else if (section === 'students') {
    await showAdminStudents(container);
  } else if (section === 'companies') {
    await showAdminCompanies(container);
  } else if (section === 'jobs') {
    await showAdminJobs(container);
  } else if (section === 'applications') {
    await showAdminApplications(container);
  }
}

async function showAdminStats(container) {
  try {
    const response = await api.getDashboardStats();
    const stats = response.stats;

    let html = `
      <h2>Dashboard Overview</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Students</h3>
          <div class="value">${stats.totalStudents}</div>
        </div>
        <div class="stat-card">
          <h3>Total Companies</h3>
          <div class="value">${stats.totalCompanies}</div>
        </div>
        <div class="stat-card">
          <h3>Total Jobs</h3>
          <div class="value">${stats.totalJobs}</div>
        </div>
        <div class="stat-card">
          <h3>Total Applications</h3>
          <div class="value">${stats.totalApplications}</div>
        </div>
      </div>
      
      <h3 style="margin-top: 30px;">Application Status Breakdown</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Applied</h3>
          <div class="value" style="color: #1976d2;">${stats.applicationStatuses.applied}</div>
        </div>
        <div class="stat-card">
          <h3>Shortlisted</h3>
          <div class="value" style="color: #f57c00;">${stats.applicationStatuses.shortlisted}</div>
        </div>
        <div class="stat-card">
          <h3>Selected</h3>
          <div class="value" style="color: #388e3c;">${stats.applicationStatuses.selected}</div>
        </div>
        <div class="stat-card">
          <h3>Rejected</h3>
          <div class="value" style="color: #d32f2f;">${stats.applicationStatuses.rejected}</div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  } catch (error) {
    container.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
  }
}

async function showAdminStudents(container) {
  try {
    const response = await api.adminGetAllStudents();
    const students = response.data;

    let html = '<h2>All Students</h2>';
    
    if (students.length === 0) {
      html += '<p>No students registered yet.</p>';
    } else {
      html += '<div class="table-container"><table>';
      html += '<thead><tr><th>Roll No</th><th>Name</th><th>Email</th><th>Branch</th><th>Batch</th><th>CGPA</th><th>Phone</th></tr></thead><tbody>';

      students.forEach(student => {
        html += `
          <tr>
            <td>${student.roll_no}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.branch}</td>
            <td>${student.batch}</td>
            <td>${student.cgpa}</td>
            <td>${student.phone || 'N/A'}</td>
          </tr>
        `;
      });

      html += '</tbody></table></div>';
    }

    container.innerHTML = html;
  } catch (error) {
    container.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
  }
}

async function showAdminCompanies(container) {
  try {
    const response = await api.adminGetAllCompanies();
    const companies = response.data;

    let html = '<h2>All Companies</h2>';
    
    if (companies.length === 0) {
      html += '<p>No companies registered yet.</p>';
    } else {
      html += '<div class="table-container"><table>';
      html += '<thead><tr><th>Company Name</th><th>Email</th><th>Phone</th><th>Locations</th></tr></thead><tbody>';

      companies.forEach(company => {
        const locations = company.CompanyLocations 
          ? company.CompanyLocations.map(l => l.location).join(', ') 
          : 'N/A';
        
        html += `
          <tr>
            <td>${company.company_name}</td>
            <td>${company.email || 'N/A'}</td>
            <td>${company.phone || 'N/A'}</td>
            <td>${locations}</td>
          </tr>
        `;
      });

      html += '</tbody></table></div>';
    }

    container.innerHTML = html;
  } catch (error) {
    container.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
  }
}

async function showAdminJobs(container) {
  try {
    const response = await api.adminGetAllJobs();
    const jobs = response.data;

    let html = '<h2>All Jobs Posted</h2>';
    
    if (jobs.length === 0) {
      html += '<p>No jobs posted yet.</p>';
    } else {
      html += '<div class="table-container"><table>';
      html += '<thead><tr><th>Job Title</th><th>Company</th><th>Type</th><th>Min CGPA</th><th>Salary</th></tr></thead><tbody>';

      jobs.forEach(job => {
        html += `
          <tr>
            <td>${job.job_title}</td>
            <td>${job.Company.company_name}</td>
            <td>${job.job_type}</td>
            <td>${job.min_cgpa || 'None'}</td>
            <td>${job.salary || 'N/A'}</td>
          </tr>
        `;
      });

      html += '</tbody></table></div>';
    }

    container.innerHTML = html;
  } catch (error) {
    container.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
  }
}

async function showAdminApplications(container) {
  try {
    const response = await api.adminGetAllApplications();
    const applications = response.data;

    let html = '<h2>All Applications</h2>';
    
    if (applications.length === 0) {
      html += '<p>No applications submitted yet.</p>';
    } else {
      html += '<div class="table-container"><table>';
      html += '<thead><tr><th>Student</th><th>Job</th><th>Company</th><th>Applied Date</th><th>Status</th></tr></thead><tbody>';

      applications.forEach(app => {
        html += `
          <tr>
            <td>${app.Student.name} (${app.Student.roll_no})</td>
            <td>${app.Job.job_title}</td>
            <td>${app.Job.Company.company_name}</td>
            <td>${new Date(app.application_date).toLocaleDateString()}</td>
            <td><span class="status status-${app.status.toLowerCase()}">${app.status}</span></td>
          </tr>
        `;
      });

      html += '</tbody></table></div>';
    }

    container.innerHTML = html;
  } catch (error) {
    container.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
  }
}

// Call on page load if admin is logged in
if (currentUser && currentUser.role === 'admin') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const content = document.getElementById('admin-content');
      if (content) {
        initAdminDashboard();
      }
    }, 100);
  });

  // Also call when loadHome is called
  const originalLoadHome = window.loadHome;
  window.loadHome = function() {
    originalLoadHome.call(this);
    if (currentUser && currentUser.role === 'admin') {
      setTimeout(() => {
        const content = document.getElementById('admin-content');
        if (content) {
          initAdminDashboard();
        }
      }, 100);
    }
  };
}
