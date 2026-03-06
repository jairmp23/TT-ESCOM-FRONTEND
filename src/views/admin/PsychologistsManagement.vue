<template>
  <AppLayout>
    <LoadingSpinner v-if="loading" message="Cargando psicólogos..." />
    <div v-else>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold">Gestión de Psicólogos</h2>
        <RouterLink to="/admin/create-psychologist"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold">
          + Crear Psicólogo
        </RouterLink>
      </div>

      <!-- Buscador -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <input v-model="search" type="text" placeholder="Buscar por nombre, cédula, email..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="onSearchInput" />
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
              <th class="px-6 py-3 text-left font-semibold">Psicólogo</th>
              <th class="px-6 py-3 text-left font-semibold">Cédula</th>
              <th class="px-6 py-3 text-left font-semibold">Horarios</th>
              <th class="px-6 py-3 text-left font-semibold">Estado</th>
              <th class="px-6 py-3 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="p in psychologists" :key="p.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="font-semibold">{{ fullName(p.user) }}</div>
                <div class="text-sm text-gray-500">{{ p.user.email }}</div>
              </td>
              <td class="px-6 py-4 text-gray-700">{{ p.license_number }}</td>
              <td class="px-6 py-4">
                <template v-if="activeSchedule(p.schedule).length">
                  <div v-for="slot in activeSchedule(p.schedule)" :key="slot.key"
                    class="text-sm text-gray-700 leading-5">
                    <span class="font-medium">{{ slot.label }}:</span>
                    {{ slot.start }} – {{ slot.end }}
                  </div>
                </template>
                <span v-else class="text-gray-400 text-sm">Sin horario</span>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-full text-xs font-semibold"
                  :class="p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                  {{ p.is_active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button @click="toggleStatus(p)" class="text-sm font-semibold"
                  :class="p.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'">
                  {{ p.is_active ? 'Desactivar' : 'Activar' }}
                </button>
              </td>
            </tr>

            <tr v-if="psychologists.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                No se encontraron psicólogos.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pie de tabla -->
      <div class="flex justify-between items-center mt-6">
        <span class="text-gray-600">Mostrando {{ psychologists.length }} de {{ total }} psicólogos</span>
        <div class="flex gap-2">
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
            class="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
            Anterior
          </button>
          <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
            class="px-4 py-2 border rounded-lg"
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
import { ref, onMounted } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { usePsychologistsStore } from '@/stores/psychologists'
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

const psychologistsStore = usePsychologistsStore()

const search = ref('')
const psychologists = ref([])
const total = ref(0)
const totalPages = ref(1)
const currentPage = ref(1)
const loading = ref(true)
const error = ref(null)

let searchTimeout = null

const fullName = (user) =>
  [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(' ')

const activeSchedule = (schedule) =>
  Array.isArray(schedule) ? schedule.filter((s) => s.active) : []

async function fetchPsychologists() {
  loading.value = true
  error.value = null
  try {
    const params = { skip: (currentPage.value - 1) * 20 }
    if (search.value) params.search = search.value
    const res = await psychologistsStore.listPsychologists(params)
    psychologists.value = res.items
    total.value = res.total
    totalPages.value = res.total_pages
  } catch (e) {
    error.value = 'Error al cargar los psicólogos. Intenta de nuevo.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

function onSearchInput() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchPsychologists()
  }, 350)
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchPsychologists()
}

function toggleStatus(p) {
  p.is_active = !p.is_active
}

onMounted(fetchPsychologists)
</script>
