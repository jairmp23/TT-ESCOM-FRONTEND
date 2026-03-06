<template>
  <AppLayout>
    <LoadingSpinner v-if="loading" message="Cargando expedientes..." />

    <div v-else>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold">Expedientes Clínicos</h2>
        <RouterLink
          to="/psychologist/records/create"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold">
          + Crear Expediente
        </RouterLink>
      </div>

      <!-- Buscador -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <input
          v-model="search"
          type="text"
          placeholder="Buscar por nombre, boleta..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="onSearchInput"
        />
      </div>

      <!-- Error -->
      <div v-if="error" class="bg-red-100 text-red-700 rounded-lg p-4 mb-6">
        {{ error }}
      </div>

      <!-- Tabla -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3 text-left font-semibold">Paciente</th>
              <th class="px-6 py-3 text-left font-semibold">Boleta</th>
              <th class="px-6 py-3 text-left font-semibold">Fecha Apertura</th>
              <th class="px-6 py-3 text-left font-semibold">Estado</th>
              <th class="px-6 py-3 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="record in records" :key="record.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="font-semibold">{{ record.student }}</div>
                <div class="text-sm text-gray-600">{{ record.email }}</div>
              </td>
              <td class="px-6 py-4 text-gray-700">{{ record.boleta }}</td>
              <td class="px-6 py-4 text-gray-700">{{ record.openedAt }}</td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-sm font-semibold"
                  :class="record.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                  {{ record.activo ? "Activo" : "Cerrado" }}
                </span>
              </td>
              <td class="px-6 py-4">
                <RouterLink :to="`/psychologist/records/${record.id}`"
                  class="text-blue-600 hover:text-blue-800 font-semibold">
                  Ver Detalle
                </RouterLink>
              </td>
            </tr>

            <tr v-if="records.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                No se encontraron expedientes.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="flex justify-between items-center mt-6">
        <span class="text-gray-600">Mostrando {{ records.length }} de {{ total }} expedientes</span>
        <div class="flex gap-2">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
            Anterior
          </button>
          <button
            v-for="page in totalPages" :key="page"
            @click="goToPage(page)"
            class="px-4 py-2 border rounded-lg"
            :class="page === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-100'">
            {{ page }}
          </button>
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AppLayout from "@/layouts/AppLayout.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import { useRecordsStore } from "@/stores/records";

const recordsStore = useRecordsStore();

const search = ref("");
const records = ref([]);
const total = ref(0);
const totalPages = ref(1);
const currentPage = ref(1);
const loading = ref(false);
const error = ref("");

let searchTimeout = null;

function fullName(user) {
  return [user.first_name, user.middle_name, user.last_name]
    .filter(Boolean)
    .join(" ");
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function mapRecord(r) {
  const user = r.student_info?.user ?? {};
  return {
    id: r.id,
    student: fullName(user),
    email: user.email ?? "—",
    boleta: r.student_info?.student_id ?? "—",
    openedAt: formatDate(r.opening_date),
    activo: r.is_active,
  };
}

async function fetchRecords() {
  loading.value = true;
  error.value = "";
  try {
    const params = { skip: (currentPage.value - 1) * 20 };
    if (search.value) params.search = search.value;
    const data = await recordsStore.listRecords(params);
    records.value = (data?.items ?? data ?? []).map(mapRecord);
    total.value = data?.total ?? records.value.length;
    totalPages.value = data?.total_pages ?? 1;
  } catch (err) {
    error.value = err.response?.data?.detail ?? "Error al cargar los expedientes.";
  } finally {
    loading.value = false;
  }
}

function onSearchInput() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    fetchRecords();
  }, 350);
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchRecords();
}

onMounted(fetchRecords);
</script>
