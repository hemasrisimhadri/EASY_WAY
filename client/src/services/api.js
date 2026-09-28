import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('easyway_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for consistent error message handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'An unexpected error occurred. Please try again.',
      status: error.response?.status,
      data: error.response?.data
    };
    return Promise.reject(customError);
  }
);

// Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData)
};

// Department Services
export const departmentService = {
  getDepartments: (params) => api.get('/departments', { params }),
  getDepartmentById: (id) => api.get(`/departments/${id}`),
  createDepartment: (data) => api.post('/departments', data),
  updateDepartment: (id, data) => api.put(`/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/departments/${id}`)
};

// Hospital Services (NO HOSPITAL SEARCH BAR - uses filters/departments)
export const hospitalService = {
  getHospitals: (params) => api.get('/hospitals', { params }),
  getHospitalById: (id) => api.get(`/hospitals/${id}`),
  createHospital: (data) => api.post('/hospitals', data),
  updateHospital: (id, data) => api.put(`/hospitals/${id}`, data),
  deleteHospital: (id) => api.delete(`/hospitals/${id}`)
};

// Doctor Services
export const doctorService = {
  getDoctors: (params) => api.get('/doctors', { params }),
  getDoctorById: (id, date) => api.get(`/doctors/${id}${date ? `?date=${date}` : ''}`),
  createDoctor: (data) => api.post('/doctors', data),
  updateDoctor: (id, data) => api.put(`/doctors/${id}`, data),
  deleteDoctor: (id) => api.delete(`/doctors/${id}`)
};

// Appointment Services
export const appointmentService = {
  bookAppointment: (data) => api.post('/appointments', data),
  getMyAppointments: (params) => api.get('/appointments/my', { params }),
  getAppointmentById: (id) => api.get(`/appointments/${id}`),
  cancelAppointment: (id, reason) => api.put(`/appointments/${id}/cancel`, { cancellationReason: reason }),
  rescheduleAppointment: (id, data) => api.put(`/appointments/${id}/reschedule`, data),
  // Admin appointments
  getAllAppointments: (params) => api.get('/appointments', { params }),
  updateStatus: (id, status, notes) => api.put(`/appointments/${id}/status`, { status, notes }),
  deleteAppointment: (id) => api.delete(`/appointments/${id}`)
};

// Admin Metrics & Patients
export const adminService = {
  getMetrics: () => api.get('/admin/metrics'),
  getPatients: () => api.get('/admin/patients')
};

// System / Platform Config
export const configService = {
  getConfig: () => api.get('/config')
};

export default api;
