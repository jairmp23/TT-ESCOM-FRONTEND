<template>
  <AppLayout>
    <LoadingSpinner v-if="loading" message="Cargando alumnos..." />
    <div v-else>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold">Gestión de Alumnos</h2>
      </div>

      <!-- Buscador -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <input v-model="search" type="text" placeholder="Buscar por nombre, boleta, email..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <!-- Error -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        {{ error }}
      </div>

      <!-- Tabla -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3 text-left font-semibold">Alumno</th>
              <th class="px-6 py-3 text-left font-semibold">Boleta</th>
              <th class="px-6 py-3 text-left font-semibold">Carrera</th>
              <th class="px-6 py-3 text-left font-semibold">Semestre</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-if="loading">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500">Cargando...</td>
            </tr>

            <tr v-for="s in filteredStudents" :key="s.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="font-semibold">{{ fullName(s.user) }}</div>
                <div class="text-sm text-gray-500">{{ s.user.email }}</div>
              </td>
              <td class="px-6 py-4 text-gray-700">{{ s.student_id }}</td>
              <td class="px-6 py-4 text-gray-700">{{ s.career }}</td>
              <td class="px-6 py-4 text-gray-700">{{ s.semester }}</td>
            </tr>

            <tr v-if="!loading && filteredStudents.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                No se encontraron alumnos.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pie de tabla -->
      <div class="flex justify-between items-center mt-6">
        <span class="text-gray-600">Mostrando {{ filteredStudents.length }} de {{ total }} alumnos</span>
        <div class="flex gap-2">
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
            class="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
            Anterior
          </button>
          <button v-for="page in totalPages" :key="page" @click="goToPage(page)" class="px-4 py-2 border rounded-lg"
            :class="page === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-100'">
            {{ page }}
          </button>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
            class="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useStudentsStore } from '@/stores/students'
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

const search = ref('')
const students = ref([])
const total = ref(0)
const totalPages = ref(1)
const currentPage = ref(1)
const loading = ref(false)
const error = ref(null)

const studentsStore = useStudentsStore();

const fullName = (user) =>
  [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(' ')

const filteredStudents = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return students.value
  return students.value.filter((s) =>
    fullName(s.user).toLowerCase().includes(q) ||
    (s.user.email ?? '').toLowerCase().includes(q) ||
    (s.student_id ?? '').toLowerCase().includes(q)
  )
})

async function fetchStudents() {
  loading.value = true
  error.value = null
  try {
    const res = await studentsStore.listStudents({
      skip: (currentPage.value - 1) * 20,
    })
    students.value = res.items
    total.value = res.total
    totalPages.value = res.total_pages
  } catch (e) {
    error.value = 'Error al cargar los alumnos. Intenta de nuevo.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchStudents()
}

onMounted(fetchStudents)
</script>
