import api from '../config/api';

export const appointmentService = {
  // Get all appointments
  getAppointments: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/appointments?${params}`);
    return response.data;
  },

  // Get appointment by ID
  getAppointment: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  // Create appointment
  createAppointment: async (data) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  // Update appointment
  updateAppointment: async (id, data) => {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },

  // Cancel appointment
  cancelAppointment: async (id, reason) => {
    const response = await api.delete(`/appointments/${id}`, {
      data: { reason }
    });
    return response.data;
  },
};

export const prescriptionService = {
  // Get all prescriptions
  getPrescriptions: async () => {
    const response = await api.get('/prescriptions');
    return response.data;
  },

  // Get prescription by ID
  getPrescription: async (id) => {
    const response = await api.get(`/prescriptions/${id}`);
    return response.data;
  },
};

export const medicalRecordService = {
  // Get medical records
  getMedicalRecords: async (patientId) => {
    const params = patientId ? `?patientId=${patientId}` : '';
    const response = await api.get(`/medical-records${params}`);
    return response.data;
  },

  // Get medical timeline
  getTimeline: async (patientId) => {
    const response = await api.get(`/medical-records/patient/${patientId}/timeline`);
    return response.data;
  },
};

export const notificationService = {
  // Get notifications
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  // Mark as read
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  },
};

export const statsService = {
  // Get patient stats
  getPatientStats: async () => {
    const response = await api.get('/stats/patient');
    return response.data;
  },

  // Get doctor stats
  getDoctorStats: async () => {
    const response = await api.get('/stats/doctor');
    return response.data;
  },

  // Get health trends
  getHealthTrends: async (patientId) => {
    const response = await api.get(`/stats/health-trends/${patientId}`);
    return response.data;
  },
};

export const doctorService = {
  // Get all doctors
  getDoctors: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/doctors?${params}`);
    return response.data;
  },

  // Get doctor by ID
  getDoctor: async (id) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  // Get doctor availability
  getAvailability: async (id, date) => {
    const response = await api.get(`/doctors/${id}/availability?date=${date}`);
    return response.data;
  },
};

export const patientService = {
  // Get patient profile
  getMyProfile: async () => {
    const response = await api.get('/patients/me');
    return response.data;
  },

  // Update patient profile
  updateProfile: async (id, data) => {
    const response = await api.put(`/patients/${id}`, data);
    return response.data;
  },
};