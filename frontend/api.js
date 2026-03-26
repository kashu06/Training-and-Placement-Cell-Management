const API_BASE_URL = 'http://localhost:5000/api';

class APIClient {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` })
    };
  }

  async request(endpoint, method = 'GET', body = null) {
    try {
      const options = {
        method,
        headers: this.getHeaders()
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Auth APIs
  async adminSignup(name, email, password) {
    return this.request('/auth/admin/signup', 'POST', { name, email, password });
  }

  async adminLogin(email, password) {
    return this.request('/auth/admin/login', 'POST', { email, password });
  }

  async studentSignup(roll_no, name, email, phone, branch, batch, cgpa, password) {
    return this.request('/auth/student/signup', 'POST', {
      roll_no, name, email, phone, branch, batch, cgpa, password
    });
  }

  async studentLogin(email, password) {
    return this.request('/auth/student/login', 'POST', { email, password });
  }

  async companySignup(company_name, email, phone, password) {
    return this.request('/auth/company/signup', 'POST', { company_name, email, phone, password });
  }

  async companyLogin(email, password) {
    return this.request('/auth/company/login', 'POST', { email, password });
  }

  // Student APIs
  async getAllStudents() {
    return this.request('/students');
  }

  async getStudentById(id) {
    return this.request(`/students/${id}`);
  }

  async updateStudentProfile(id, phone, cgpa, resume_link) {
    return this.request(`/students/${id}`, 'PUT', { phone, cgpa, resume_link });
  }

  // Company APIs
  async getAllCompanies() {
    return this.request('/companies');
  }

  async getCompanyById(id) {
    return this.request(`/companies/${id}`);
  }

  async updateCompany(id, company_name, phone) {
    return this.request(`/companies/${id}`, 'PUT', { company_name, phone });
  }

  async addCompanyLocation(id, location) {
    return this.request(`/companies/${id}/locations`, 'POST', { location });
  }

  // Job APIs
  async createJob(company_id, job_title, job_type, min_cgpa, salary, eligible_branches) {
    return this.request('/jobs', 'POST', {
      company_id, job_title, job_type, min_cgpa, salary, eligible_branches
    });
  }

  async getAllJobs() {
    return this.request('/jobs');
  }

  async getJobById(id) {
    return this.request(`/jobs/${id}`);
  }

  async getJobsByCompany(company_id) {
    return this.request(`/jobs/company/${company_id}`);
  }

  async updateJob(id, job_title, min_cgpa, salary, eligible_branches) {
    return this.request(`/jobs/${id}`, 'PUT', {
      job_title, min_cgpa, salary, eligible_branches
    });
  }

  async deleteJob(id) {
    return this.request(`/jobs/${id}`, 'DELETE');
  }

  // Application APIs
  async applyForJob(student_id, job_id) {
    return this.request('/applications/apply', 'POST', { student_id, job_id });
  }

  async getAllApplications() {
    return this.request('/applications');
  }

  async getApplicationsByStudent(student_id) {
    return this.request(`/applications/student/${student_id}`);
  }

  async getApplicationsForJob(job_id) {
    return this.request(`/applications/job/${job_id}`);
  }

  async updateApplicationStatus(id, status) {
    return this.request(`/applications/${id}`, 'PUT', { status });
  }

  async deleteApplication(id) {
    return this.request(`/applications/${id}`, 'DELETE');
  }

  // Admin APIs
  async getDashboardStats() {
    return this.request('/admin/dashboard/stats');
  }

  async adminGetAllStudents() {
    return this.request('/admin/students');
  }

  async adminGetAllCompanies() {
    return this.request('/admin/companies');
  }

  async adminGetAllJobs() {
    return this.request('/admin/jobs');
  }

  async adminGetAllApplications() {
    return this.request('/admin/applications');
  }
}

const api = new APIClient();
