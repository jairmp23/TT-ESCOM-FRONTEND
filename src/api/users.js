import api from './axios'

export const getMeApi = () =>
    api.get('/users/me').then(response => response.data)
  