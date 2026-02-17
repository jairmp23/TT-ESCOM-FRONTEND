<template>
  <AppLayout>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold">Expedientes Clínicos</h2>
      <button
        @click="showCreateModal = true"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
      >
        + Crear Expediente
      </button>
    </div>

    <!-- Buscador -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <input
        v-model="search"
        type="text"
        placeholder="Buscar por nombre, boleta..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
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
          <tr
            v-for="record in filteredRecords"
            :key="record.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4">
              <div class="font-semibold">{{ record.student }}</div>
              <div class="text-sm text-gray-600">{{ record.email }}</div>
            </td>
            <td class="px-6 py-4 text-gray-700">{{ record.boleta }}</td>
            <td class="px-6 py-4 text-gray-700">{{ record.openedAt }}</td>
            <td class="px-6 py-4">
              <span
                class="px-3 py-1 rounded-full text-sm font-semibold"
                :class="
                  record.activo
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                "
              >
                {{ record.activo ? "Activo" : "Cerrado" }}
              </span>
            </td>
            <td class="px-6 py-4">
              <RouterLink
                :to="`/psychologist/records/${record.id}`"
                class="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Ver Detalle
              </RouterLink>
            </td>
          </tr>

          <tr v-if="filteredRecords.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-gray-500">
              No se encontraron expedientes.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="flex justify-between items-center mt-6">
      <div class="text-gray-600">
        Mostrando {{ filteredRecords.length }} de
        {{ records.length }} expedientes
      </div>
      <div class="flex gap-2">
        <button class="px-4 py-2 border rounded-lg hover:bg-gray-100">
          Anterior
        </button>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
        <button class="px-4 py-2 border rounded-lg hover:bg-gray-100">
          Siguiente
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import AppLayout from "@/layouts/AppLayout.vue";

const search = ref("");
const showCreateModal = ref(false);

const records = ref([
  {
    id: 1,
    student: "Juan Pérez García",
    email: "juan.perez@alumno.ipn.mx",
    boleta: "2024123456",
    openedAt: "15 Oct 2024",
    activo: true,
  },
  {
    id: 2,
    student: "Ana Martínez López",
    email: "ana.martinez@alumno.ipn.mx",
    boleta: "2024123457",
    openedAt: "8 Oct 2024",
    activo: true,
  },
  {
    id: 3,
    student: "Carlos Rodríguez Soto",
    email: "carlos.rodriguez@alumno.ipn.mx",
    boleta: "2024123458",
    openedAt: "22 Oct 2024",
    activo: true,
  },
  {
    id: 4,
    student: "Luis García Ramírez",
    email: "luis.garcia@alumno.ipn.mx",
    boleta: "2024123459",
    openedAt: "1 Nov 2024",
    activo: true,
  },
  {
    id: 5,
    student: "María Fernández Cruz",
    email: "maria.fernandez@alumno.ipn.mx",
    boleta: "2024123460",
    openedAt: "5 Sep 2024",
    activo: false,
  },
]);

const filteredRecords = computed(() => {
  if (!search.value) return records.value;
  const q = search.value.toLowerCase();
  return records.value.filter(
    (r) =>
      r.student.toLowerCase().includes(q) ||
      r.boleta.includes(q) ||
      r.email.toLowerCase().includes(q),
  );
});
</script>
