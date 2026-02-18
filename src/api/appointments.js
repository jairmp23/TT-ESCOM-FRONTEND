import api from './axios'

export const getAppointmentApi = (id) =>
    api.get(`/appointments/${id}`).then(response => response.data)

export const listAppointmentsApi = () =>
    api.get(`/appointments/`).then(response => response.data)

export const registerAppointmentApi = (data) =>
    api.post(`/appointments/`, data).then(response => response.data)

export const updateAppointmentApi = (id, data) =>
    api.put(`/appointments/${id}`, data).then(response => response.data)

