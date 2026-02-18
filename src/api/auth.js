// src/api/auth.js
import api from './axios'

export const loginApi = (email, password) =>
  api.post('/auth/login', { email, password }).then(response => response.data)

export const registerApi = async (data) => {
    // Temporal mock
    console.log('Register data:', data)
    return { success: true }
  }


