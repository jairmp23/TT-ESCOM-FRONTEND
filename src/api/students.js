import api from './axios'

export const getStudentApi = (id) =>
    api.get(`/students/${id}`).then(response => response.data)

export const listStudentsApi = () =>
    api.get(`/students/`).then(response => response.data)

export const registerStudentApi = (data) =>
    api.post(`/students/`, data).then(response => response.data)

export const updateStudentApi = (id, data) =>
    api.put(`/students/${id}`, data).then(response => response.data)

