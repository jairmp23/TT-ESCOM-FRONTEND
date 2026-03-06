import api from './axios'

export const getAppointmentApi = (id) =>
    api.get(`/appointments/${id}`).then(response => response.data)

export const listAppointmentsApi = (params = {}) =>
    api.get(`/appointments/`, { params }).then(response => response.data)

export const registerAppointmentApi = (data) =>
    api.post(`/appointments/`, data).then(response => response.data)

export const updateAppointmentApi = (id, data) =>
    api.put(`/appointments/${id}`, data).then(response => response.data)

export const getAvailableSlotsApi = (psychologist_id, date) =>
    api.get(`/appointments/available-slots`, { params: { psychologist_id, date } }).then(response => response.data)

