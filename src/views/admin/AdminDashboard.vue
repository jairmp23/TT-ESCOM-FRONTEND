<template>
  <AppLayout>
    <h2 class="text-3xl font-bold mb-6">Panel de Administración</h2>

    <LoadingSpinner v-if="loading" message="Cargando datos..." />

    <div v-else>
      <!-- Estadísticas -->
      <div class="grid grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-gray-600 mb-2">Total Usuarios</div>
          <div class="text-3xl font-bold text-blue-600">{{ stats.totalUsers }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-gray-600 mb-2">Alumnos</div>
          <div class="text-3xl font-bold text-green-600">{{ stats.students }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-gray-600 mb-2">Psicólogos</div>
          <div class="text-3xl font-bold text-purple-600">{{ stats.psychologists }}</div>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        {{ error }}
      </div>

      <!-- Psicólogos registrados -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold">Psicólogos</h3>
          <RouterLink to="/admin/psychologists" class="text-sm text-blue-600 hover:underline font-semibold">
            Ver todos
          </RouterLink>
        </div>

        <div v-if="psychologists.length === 0" class="text-center text-gray-500 py-6">
          No hay psicólogos registrados.
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div v-for="p in psychologists" :key="p.id" class="border rounded-lg p-4 text-center">
            <div class="font-semibold text-lg">{{ fullName(p.user) }}</div>
            <div class="text-sm text-gray-500 mt-1">{{ p.user.email }}</div>
            <div class="text-sm text-gray-600 mt-1">Cédula: {{ p.license_number }}</div>
            <span class="inline-block mt-2 px-2 py-1 rounded-full text-xs font-semibold"
              :class="p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
              {{ p.is_active ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { listPsychologistsApi } from '@/api/psychologists'
import { listStudentsApi } from '@/api/students'

const loading = ref(true)
const error = ref(null)
const psychologists = ref([])

const stats = ref({
  totalUsers: 0,
  students: 0,
  psychologists: 0,
  appointments: 0,
})

const fullName = (user) =>
  [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(' ')

async function fetchData() {
  loading.value = true
  error.value = null
  try {
    const [psychologistsRes, studentsRes, appointmentsRes] = await Promise.all([
      listPsychologistsApi(),
      listStudentsApi(),
    ])

    psychologists.value = psychologistsRes.items
    stats.value = {
      psychologists: psychologistsRes.total,
      students: studentsRes.total,
      totalUsers: psychologistsRes.total + studentsRes.total,
    }
  } catch (e) {
    error.value = 'Error al cargar los datos del panel.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>
