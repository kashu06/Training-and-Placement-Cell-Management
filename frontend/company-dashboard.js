// Company Dashboard Management

async function initCompanyDashboard() {
  const container = document.getElementById('company-content');
  
  container.innerHTML = `
    <div class="dashboard-nav" style="margin-bottom: 30px; display: flex; gap: 10px; flex-wrap: wrap;">
      <button class="btn btn-primary" onclick="showCompanySection('jobs')">My Jobs</button>
      <button class="btn btn-primary" onclick="showCompanySection('post-job')">Post New Job</button>
      <button class="btn btn-primary" onclick="showCompanySection('applicants')">View Applicants</button>
    </div>
    <div id="section-content"></div>
  `;

  showCompanySection('jobs');
}

async function showCompanySection(section) {
  const container = document.getElementById('section-content');

  if (section === 'jobs') {
    await showCompanyJobs(container);
  } else if (section === 'post-job') {
    showPostJobForm(container);
  } else if (section === 'applicants') {
    await showCompanyApplicants(container);
  }
}

async function showCompanyJobs(container) {
  try {
    const response = await api.getJobsByCompany(currentUser.company_id);
    const jobs = response.data;

    let html = '<h2>My Job Postings</h2>';
    
    if (jobs.length === 0) {
      html += '<p>You haven\'t posted any jobs yet.</p>';
    } else {
      html += '<div class="table-container"><table>';
      html += '<thead><tr><th>Job Title</th><th>Type</th><th>Min CGPA</th><th>Salary</th><th>Action</th></tr></thead><tbody>';

      jobs.forEach(job => {
        html += `
          <tr>
            <td>${job.job_title}</td>
            <td>${job.job_type}</td>
            <td>${job.min_cgpa || 'None'}</td>
            <td>${job.salary || 'N/A'}</td>
            <td>
              <button class="btn btn-info" onclick="viewJobDetails(${job.job_id})">View</button>
              <button class="btn btn-danger" onclick="deleteJobModal(${job.job_id})">Delete</button>
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

function showPostJobForm(container) {
  const formHTML = `
    <h2>Post New Job</h2>
    <div class="form-container" style="max-width: 100%;">
      <form onsubmit="handlePostJob(event)">
        <div class="form-group">
          <label>Job Title</label>
          <input type="text" id="job_title" required>
        </div>
        <div class="form-group">
          <label>Job Type</label>
          <select id="job_type" required>
            <option value="">Select Type</option>
            <option value="Internship">Internship</option>
            <option value="Full-Time">Full-Time</option>
          </select>
        </div>
        <div class="form-group">
          <label>Minimum CGPA</label>
          <input type="number" id="min_cgpa" step="0.01" min="0" max="10" value="0">
        </div>
        <div class="form-group">
          <label>Salary</label>
          <input type="number" id="salary" min="0">
        </div>
        <div class="form-group">
          <label>Eligible Branches (Select Multiple)</label>
          <select id="eligible_branches" multiple size="5">
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
          </select>
          <small>Hold Ctrl/Cmd to select multiple. Leave empty for all branches.</small>
        </div>
        <button type="submit" class="btn btn-success" style="width: 100%; margin-top: 20px;">Post Job</button>
      </form>
    </div>
  `;
  container.innerHTML = formHTML;
}

async function handlePostJob(event) {
  event.preventDefault();

  const job_title = document.getElementById('job_title').value;
  const job_type = document.getElementById('job_type').value;
  const min_cgpa = parseFloat(document.getElementById('min_cgpa').value) || 0;
  const salary = parseInt(document.getElementById('salary').value) || null;
  
  const selectElement = document.getElementById('eligible_branches');
  const eligible_branches = Array.from(selectElement.selectedOptions).map(opt => opt.value);

  try {
    await api.createJob(
      currentUser.company_id,
      job_title,
      job_type,
      min_cgpa,
      salary,
      eligible_branches
    );

    showAlert('Job posted successfully!', 'success');
    showCompanyJobs(document.getElementById('section-content'));
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

function viewJobDetails(jobId) {
  openModal(`
    <h2>Job Details</h2>
    <div id="job-details-content"></div>
  `);
  
  api.getJobById(jobId)
    .then(response => {
      const job = response.data;
      const branches = job.JobEligibilities ? job.JobEligibilities.map(e => e.branch).join(', ') : 'All branches';
      
      const html = `
        <p><strong>Title:</strong> ${job.job_title}</p>
        <p><strong>Type:</strong> ${job.job_type}</p>
        <p><strong>Min CGPA:</strong> ${job.min_cgpa || 'None'}</p>
        <p><strong>Salary:</strong> ${job.salary || 'Not specified'}</p>
        <p><strong>Eligible Branches:</strong> ${branches}</p>
        <p><strong>Total Applications:</strong> <span id="app-count">Loading...</span></p>
        <div id="applicants-list" style="margin-top: 20px;"></div>
        <div style="text-align: center; margin-top: 20px;">
          <a onclick="closeModal()" style="cursor: pointer; color: #667eea;">Close</a>
        </div>
      `;
      
      document.getElementById('job-details-content').innerHTML = html;
      
      // Load applicants for this job
      api.getApplicationsForJob(jobId)
        .then(appResponse => {
          const applications = appResponse.data;
          let appHTML = '<h3>Applicants</h3>';
          
          if (applications.length === 0) {
            appHTML += '<p>No applicants yet.</p>';
          } else {
            appHTML += '<table style="width: 100%; margin-top: 15px;">';
            appHTML += '<thead><tr><th>Name</th><th>Roll No</th><th>Status</th><th>Action</th></tr></thead><tbody>';
            
            applications.forEach(app => {
              appHTML += `
                <tr>
                  <td>${app.Student.name}</td>
                  <td>${app.Student.roll_no}</td>
                  <td>
                    <span class="status status-${app.status.toLowerCase()}">${app.status}</span>
                  </td>
                  <td>
                    <select onchange="updateAppStatus(${app.application_id}, this.value)" style="padding: 5px;">
                      <option value="${app.status}">${app.status}</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              `;
            });
            
            appHTML += '</tbody></table>';
          }
          
          document.getElementById('applicants-list').innerHTML = appHTML;
          document.getElementById('app-count').textContent = applications.length;
        })
        .catch(error => {
          document.getElementById('job-details-content').innerHTML += `<div class="alert alert-error">${error.message}</div>`;
        });
    })
    .catch(error => {
      document.getElementById('job-details-content').innerHTML = `<div class="alert alert-error">${error.message}</div>`;
    });
}

async function updateAppStatus(appId, status) {
  try {
    await api.updateApplicationStatus(appId, status);
    showAlert('Status updated successfully!', 'success');
    // Refresh the modal by calling the parent job details again
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

function deleteJobModal(jobId) {
  openModal(`
    <h2>Delete Job</h2>
    <p>Are you sure you want to delete this job? This action cannot be undone.</p>
    <div style="display: flex; gap: 10px; justify-content: center;">
      <button class="btn btn-danger" onclick="deleteJobConfirm(${jobId})">Yes, Delete</button>
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    </div>
  `);
}

async function deleteJobConfirm(jobId) {
  try {
    await api.deleteJob(jobId);
    closeModal();
    showAlert('Job deleted successfully!', 'success');
    showCompanyJobs(document.getElementById('section-content'));
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

async function showCompanyApplicants(container) {
  try {
    const jobsResponse = await api.getJobsByCompany(currentUser.company_id);
    const jobs = jobsResponse.data;

    if (jobs.length === 0) {
      container.innerHTML = '<p>You haven\'t posted any jobs yet.</p>';
      return;
    }

    let html = '<h2>Applicants Overview</h2>';
    html += '<div class="table-container"><table>';
    html += '<thead><tr><th>Job</th><th>Applicant Name</th><th>Roll No</th><th>CGPA</th><th>Status</th><th>Applied Date</th><th>Action</th></tr></thead><tbody>';

    for (const job of jobs) {
      const appsResponse = await api.getApplicationsForJob(job.job_id);
      const applications = appsResponse.data;

      if (applications.length === 0) {
        html += `<tr><td colspan="7" style="text-align: center;">No applicants for ${job.job_title}</td></tr>`;
      } else {
        applications.forEach((app, idx) => {
          html += `
            <tr>
              <td>${job.job_title}</td>
              <td>${app.Student.name}</td>
              <td>${app.Student.roll_no}</td>
              <td>${app.Student.cgpa}</td>
              <td><span class="status status-${app.status.toLowerCase()}">${app.status}</span></td>
              <td>${new Date(app.application_date).toLocaleDateString()}</td>
              <td>
                <select onchange="updateAppStatus(${app.application_id}, this.value)" style="padding: 5px;">
                  <option value="${app.status}">${app.status}</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
            </tr>
          `;
        });
      }
    }

    html += '</tbody></table></div>';
    container.innerHTML = html;
  } catch (error) {
    container.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
  }
}

// Call on page load if company is logged in
if (currentUser && currentUser.role === 'company') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const content = document.getElementById('company-content');
      if (content) {
        initCompanyDashboard();
      }
    }, 100);
  });

  // Also call when loadHome is called
  const originalLoadHome = window.loadHome;
  window.loadHome = function() {
    originalLoadHome.call(this);
    if (currentUser && currentUser.role === 'company') {
      setTimeout(() => {
        const content = document.getElementById('company-content');
        if (content) {
          initCompanyDashboard();
        }
      }, 100);
    }
  };
}
