import api from './axios'

export const getPsychologistApi = (id) =>
    api.get(`/psychologists/${id}`).then(response => response.data)

export const listPsychologistsApi = () =>
    api.get(`/psychologists/`).then(response => response.data)

export const registerPsychologistApi = (data) =>
    api.post(`/psychologists/`, data).then(response => response.data)

export const updatePsychologistApi = (id, data) =>
    api.put(`/psychologists/${id}`, data).then(response => response.data)

