// Student Dashboard Management

async function initStudentDashboard() {
  const container = document.getElementById('student-content');
  
  container.innerHTML = `
    <div class="dashboard-nav" style="margin-bottom: 30px; display: flex; gap: 10px; flex-wrap: wrap;">
      <button class="btn btn-primary" onclick="showStudentSection('profile')">My Profile</button>
      <button class="btn btn-primary" onclick="showStudentSection('jobs')">View Jobs</button>
      <button class="btn btn-primary" onclick="showStudentSection('applications')">My Applications</button>
    </div>
    <div id="section-content"></div>
  `;

  showStudentSection('profile');
}

async function showStudentSection(section) {
  const container = document.getElementById('section-content');

  if (section === 'profile') {
    await showStudentProfile(container);
  } else if (section === 'jobs') {
    await showStudentJobs(container);
  } else if (section === 'applications') {
    await showStudentApplications(container);
  }
}

async function showStudentProfile(container) {
  try {
    const response = await api.getStudentById(currentUser.student_id);
    const student = response.data;

    const content = `
      <div style="max-width: 600px;">
        <h2>My Profile</h2>
        <div class="stat-card">
          <p><strong>Roll No:</strong> ${student.roll_no}</p>
          <p><strong>Name:</strong> ${student.name}</p>
          <p><strong>Email:</strong> ${student.email}</p>
          <p><strong>Phone:</strong> ${student.phone || 'N/A'}</p>
          <p><strong>Branch:</strong> ${student.branch}</p>
          <p><strong>Batch:</strong> ${student.batch}</p>
          <p><strong>CGPA:</strong> ${student.cgpa}</p>
          <p><strong>Resume:</strong> ${student.resume_link ? `<a href="${student.resume_link}" target="_blank">${student.resume_link}</a>` : 'Not uploaded'}</p>
        </div>
        <button class="btn btn-primary mt-20" onclick="showEditProfileForm()">Edit Profile</button>
      </div>
    `;
    container.innerHTML = content;
  } catch (error) {
    container.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
  }
}

function showEditProfileForm() {
  openModal(`
    <h2>Edit Profile</h2>
    <form onsubmit="handleUpdateProfile(event)">
      <div class="form-group">
        <label>Phone</label>
        <input type="tel" id="phone" value="${currentUser.phone || ''}">
      </div>
      <div class="form-group">
        <label>CGPA</label>
        <input type="number" id="cgpa" step="0.01" min="0" max="10" value="${currentUser.cgpa || ''}">
      </div>
      <div class="form-group">
        <label>Resume Link</label>
        <input type="url" id="resume_link" value="">
      </div>
      <button type="submit" class="btn btn-primary" style="width: 100%;">Update</button>
    </form>
    <div style="text-align: center; margin-top: 15px;">
      <a onclick="closeModal()" style="cursor: pointer; color: #667eea;">Close</a>
    </div>
  `);
}

async function handleUpdateProfile(event) {
  event.preventDefault();

  const phone = document.getElementById('phone').value;
  const cgpa = parseFloat(document.getElementById('cgpa').value);
  const resume_link = document.getElementById('resume_link').value;

  try {
    await api.updateStudentProfile(currentUser.student_id, phone, cgpa, resume_link);
    closeModal();
    showAlert('Profile updated successfully!', 'success');
    showStudentProfile(document.getElementById('section-content'));
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

async function showStudentJobs(container) {
  try {
    const response = await api.getAllJobs();
    const jobs = response.data;

    let html = '<h2>Available Jobs</h2>';
    
    if (jobs.length === 0) {
      html += '<p>No jobs available at the moment.</p>';
    } else {
      html += '<div class="table-container"><table>';
      html += '<thead><tr><th>Job Title</th><th>Company</th><th>Type</th><th>Min CGPA</th><th>Salary</th><th>Action</th></tr></thead><tbody>';

      jobs.forEach(job => {
        const branches = job.JobEligibilities ? job.JobEligibilities.map(e => e.branch).join(', ') : 'All';
        html += `
          <tr>
            <td>${job.job_title}</td>
            <td>${job.Company.company_name}</td>
            <td>${job.job_type}</td>
            <td>${job.min_cgpa || 'None'}</td>
            <td>${job.salary || 'N/A'}</td>
            <td>
              <button class="btn btn-success" onclick="applyForJobModal(${job.job_id}, '${job.job_title}')">Apply</button>
            </td>
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

function applyForJobModal(jobId, jobTitle) {
  openModal(`
    <h2>Confirm Application</h2>
    <p>Are you sure you want to apply for <strong>${jobTitle}</strong>?</p>
    <div style="text-align: center; gap: 10px; display: flex;">
      <button class="btn btn-success" onclick="applyForJobConfirm(${jobId})" style="flex: 1;">Yes, Apply</button>
      <button class="btn btn-danger" onclick="closeModal()" style="flex: 1;">Cancel</button>
    </div>
  `);
}

async function applyForJobConfirm(jobId) {
  try {
    await api.applyForJob(currentUser.student_id, jobId);
    closeModal();
    showAlert('Application submitted successfully!', 'success');
    showStudentApplications(document.getElementById('section-content'));
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

async function showStudentApplications(container) {
  try {
    const response = await api.getApplicationsByStudent(currentUser.student_id);
    const applications = response.data;

    let html = '<h2>My Applications</h2>';
    
    if (applications.length === 0) {
      html += '<p>You haven\'t applied to any job yet.</p>';
    } else {
      html += '<div class="table-container"><table>';
      html += '<thead><tr><th>Job Title</th><th>Company</th><th>Applied Date</th><th>Status</th></tr></thead><tbody>';

      applications.forEach(app => {
        html += `
          <tr>
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

// Call on page load if student is logged in
if (currentUser && currentUser.role === 'student') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const content = document.getElementById('student-content');
      if (content) {
        initStudentDashboard();
      }
    }, 100);
  });

  // Also call when loadHome is called
  const originalLoadHome = window.loadHome;
  window.loadHome = function() {
    originalLoadHome.call(this);
    if (currentUser && currentUser.role === 'student') {
      setTimeout(() => {
        const content = document.getElementById('student-content');
        if (content) {
          initStudentDashboard();
        }
      }, 100);
    }
  };
}
