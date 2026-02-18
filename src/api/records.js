import api from './axios'

export const getRecordApi = (id) =>
    api.get(`/records/${id}`).then(response => response.data)

export const listRecordsApi = () =>
    api.get(`/records/`).then(response => response.data)

export const registerRecordApi = (data) =>
    api.post(`/records/`, data).then(response => response.data)

export const updateRecordApi = (id, data) =>
    api.put(`/records/${id}`, data).then(response => response.data)

