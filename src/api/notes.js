import api from './axios'

export const getNoteApi = (id) =>
    api.get(`/notes/${id}`).then(response => response.data)

export const listNotesApi = () =>
    api.get(`/notes/`).then(response => response.data)

export const registerNoteApi = (data) =>
    api.post(`/notes/`, data).then(response => response.data)

export const updateNoteApi = (id, data) =>
    api.put(`/notes/${id}`, data).then(response => response.data)

