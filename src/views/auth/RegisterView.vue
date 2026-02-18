<template>
  <AuthLayout>
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-blue-600 mb-2">Psicología ESCOM</h1>
        <p class="text-gray-600">ESCOM - IPN</p>
      </div>

      <h2 class="text-2xl font-semibold mb-6 text-center">Registro de Alumnos</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">

        <!-- Boleta -->
        <div>
          <label class="block text-gray-700 mb-1">Boleta *</label>
          <input v-model="form.student_id" type="text" placeholder="2024123456"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="errors.student_id ? 'border-red-400' : 'border-gray-300'" />
          <p v-if="errors.student_id" class="text-red-500 text-xs mt-1">{{ errors.student_id }}</p>
        </div>

        <!-- Nombre(s) -->
        <div>
          <label class="block text-gray-700 mb-1">Nombre(s) *</label>
          <input v-model="form.first_name" type="text" placeholder="Juan"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="errors.first_name ? 'border-red-400' : 'border-gray-300'" />
          <p v-if="errors.first_name" class="text-red-500 text-xs mt-1">{{ errors.first_name }}</p>
        </div>

        <!-- Apellido Paterno -->
        <div>
          <label class="block text-gray-700 mb-1">Apellido Paterno *</label>
          <input v-model="form.last_name" type="text" placeholder="Pérez"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="errors.last_name ? 'border-red-400' : 'border-gray-300'" />
          <p v-if="errors.last_name" class="text-red-500 text-xs mt-1">{{ errors.last_name }}</p>
        </div>

        <!-- Apellido Materno -->
        <div>
          <label class="block text-gray-700 mb-1">Apellido Materno</label>
          <input v-model="form.middle_name" type="text" placeholder="García"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <!-- Correo -->
        <div>
          <label class="block text-gray-700 mb-1">Correo Institucional *</label>
          <input v-model="form.email" type="email" placeholder="boleta@alumno.ipn.mx"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="errors.email ? 'border-red-400' : 'border-gray-300'" />
          <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
        </div>

        <!-- Teléfono -->
        <div>
          <label class="block text-gray-700 mb-1">Teléfono *</label>
          <input v-model="form.phone" type="tel" placeholder="5512345678"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="errors.phone ? 'border-red-400' : 'border-gray-300'" />
          <p v-if="errors.phone" class="text-red-500 text-xs mt-1">{{ errors.phone }}</p>
        </div>

        <!-- Sexo -->
        <div>
          <label class="block text-gray-700 mb-1">Sexo *</label>
          <select v-model="form.gender"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="errors.gender ? 'border-red-400' : 'border-gray-300'">
            <option value="" disabled>Selecciona...</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">Otro</option>
          </select>
          <p v-if="errors.gender" class="text-red-500 text-xs mt-1">{{ errors.gender }}</p>
        </div>

        <!-- Carrera -->
        <div>
          <label class="block text-gray-700 mb-1">Carrera *</label>
          <select v-model="form.career"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="errors.career ? 'border-red-400' : 'border-gray-300'">
            <option value="" disabled>Selecciona tu carrera...</option>
            <option value="ISC">ISC - Ing. en Sistemas Computacionales</option>
            <option value="LCD">LCD - Lic. en Ciencia de Datos</option>
            <option value="IIA">IIA - Ing. en Inteligencia Artificial</option>
          </select>
          <p v-if="errors.career" class="text-red-500 text-xs mt-1">{{ errors.career }}</p>
        </div>

        <!-- Semestre -->
        <div>
          <label class="block text-gray-700 mb-1">Semestre *</label>
          <input v-model.number="form.semester" type="number" min="1" max="12" placeholder="4"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="errors.semester ? 'border-red-400' : 'border-gray-300'" />
          <p v-if="errors.semester" class="text-red-500 text-xs mt-1">{{ errors.semester }}</p>
        </div>

        <!-- Contraseña -->
        <div>
          <label class="block text-gray-700 mb-1">Contraseña *</label>
          <input v-model="form.password" type="password" placeholder="••••••••"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="errors.password ? 'border-red-400' : 'border-gray-300'" />
          <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
        </div>

        <!-- Confirmar Contraseña -->
        <div>
          <label class="block text-gray-700 mb-1">Confirmar Contraseña *</label>
          <input v-model="form.confirm_password" type="password" placeholder="••••••••"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="errors.confirm_password ? 'border-red-400' : 'border-gray-300'" />
          <p v-if="errors.confirm_password" class="text-red-500 text-xs mt-1">{{ errors.confirm_password }}</p>
        </div>

        <!-- Error general -->
        <div v-if="submitError" class="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {{ submitError }}
        </div>

        <!-- Éxito -->
        <div v-if="success" class="p-3 bg-green-100 text-green-700 rounded-lg text-sm">
          ¡Cuenta creada exitosamente! Redirigiendo a iniciar sesión...
        </div>

        <button type="submit" :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50">
          {{ loading ? 'Creando cuenta...' : 'Registrar' }}
        </button>

        <div class="text-center">
          <RouterLink to="/login" class="text-sm text-blue-600 hover:underline font-semibold">
            ¿Ya tienes una cuenta? Iniciar Sesión
          </RouterLink>
        </div>
      </form>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useStudentsStore } from '@/stores/students'

const router = useRouter()
const studentsStore = useStudentsStore()

const loading = ref(false)
const submitError = ref('')
const errors = ref({})
const success = ref(false)

const form = ref({
  student_id: '',
  career: '',
  semester: '',
  first_name: '',
  last_name: '',
  middle_name: '',
  email: '',
  phone: '',
  gender: '',
  password: '',
  confirm_password: '',
})

function buildApiPayload() {
  return {
    student_id: form.value.student_id,
    career: form.value.career,
    semester: form.value.semester,
    user: {
      email: form.value.email,
      password: form.value.password,
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      middle_name: form.value.middle_name,
      phone: form.value.phone,
      gender: form.value.gender,
    },
  }
}

function validate() {
  const e = {}
  if (!form.value.first_name) e.first_name = 'El nombre es requerido.'
  if (!form.value.last_name) e.last_name = 'El apellido paterno es requerido.'
  if (!form.value.gender) e.gender = 'El sexo es requerido.'
  if (!form.value.email) e.email = 'El email es requerido.'
  else if (!form.value.email.endsWith('@alumno.ipn.mx')) e.email = 'Debe ser un correo institucional (@alumno.ipn.mx).'
  if (!form.value.phone) e.phone = 'El teléfono es requerido.'
  if (!form.value.student_id) e.student_id = 'La boleta es requerida.'
  if (!form.value.career) e.career = 'La carrera es requerida.'
  if (!form.value.semester) e.semester = 'El semestre es requerido.'
  if (!form.value.password) e.password = 'La contraseña es requerida.'
  else if (form.value.password.length < 8) e.password = 'Mínimo 8 caracteres.'
  if (form.value.password !== form.value.confirm_password)
    e.confirm_password = 'Las contraseñas no coinciden.'
  errors.value = e
  return Object.keys(e).length === 0
}

async function handleSubmit() {
  if (!validate()) return

  loading.value = true
  submitError.value = ''

  try {
    await studentsStore.registerStudent(buildApiPayload())
    success.value = true
    setTimeout(() => router.push('/login'), 2000)
  } catch (err) {
    submitError.value =
      err.response?.data?.detail || 'Error al crear la cuenta. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>
