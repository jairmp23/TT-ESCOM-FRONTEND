import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginApi } from '@/api/auth'
import { getMeApi } from '@/api/users'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const profile  = ref(JSON.parse(localStorage.getItem('profile') || 'null'))

  const isAuthenticated = computed(() => !!token.value)

  async function login(email, password) {
    // 1. Obtener el token
    const tokenResponse = await loginApi(email, password)
    const accessToken = tokenResponse.access_token
  
    // Guardar token primero para que el interceptor lo use
    token.value = accessToken
    localStorage.setItem('token', accessToken)
  
    // 2. Con el token ya guardado, obtener los datos del usuario
    const userResponse = await getMeApi()
    profile.value = userResponse
    localStorage.setItem('profile', JSON.stringify(userResponse))
  }

  function logout() {
    token.value = null
    profile.value  = null
    localStorage.removeItem('token')
    localStorage.removeItem('profile')
  }

  return { token, profile, isAuthenticated, login, logout }
})