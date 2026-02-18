import api from './axios'

export const getAdminApi = (id) =>
    api.get(`/admins/${id}`).then(response => response.data)

export const listAdminsApi = () =>
    api.get(`/admins/`).then(response => response.data)

export const registerAdminApi = (data) =>
    api.post(`/admins/`, data).then(response => response.data)

export const updateAdminApi = (id, data) =>
    api.put(`/admins/${id}`, data).then(response => response.data)

