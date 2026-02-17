import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)

  async function login(email, password) {
    // Temporal mock - reemplazar con llamada real al backend
    const mockUsers = {
      'student@alumno.ipn.mx': { role: 'student', nombre: 'Juan', apellido_paterno: 'Pérez' },
      'psychologist@ipn.mx': { role: 'psychologist', nombre: 'María', apellido_paterno: 'López' },
      'admin@ipn.mx': { role: 'admin', nombre: 'Admin', apellido_paterno: 'Principal' },
    }

    const mockUser = mockUsers[email]
    if (!mockUser || password !== '12345678') {
      throw { response: { data: { detail: 'Invalid credentials' } } }
    }

    token.value = 'mock-token-123'
    user.value = mockUser
    localStorage.setItem('token', 'mock-token-123')
    localStorage.setItem('user', JSON.stringify(mockUser))
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { token, user, isAuthenticated, login, logout }
})