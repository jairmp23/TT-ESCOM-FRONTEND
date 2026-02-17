<template>
  <AppLayout>
    <h2 class="text-3xl font-bold mb-6">Panel de Administración</h2>

    <!-- Estadísticas -->
    <div class="grid grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-gray-600 mb-2">Total Usuarios</div>
        <div class="text-3xl font-bold text-blue-600">
          {{ stats.totalUsers }}
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-gray-600 mb-2">Alumnos</div>
        <div class="text-3xl font-bold text-green-600">
          {{ stats.students }}
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-gray-600 mb-2">Psicólogos</div>
        <div class="text-3xl font-bold text-purple-600">
          {{ stats.psychologists }}
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-gray-600 mb-2">Citas Totales</div>
        <div class="text-3xl font-bold text-yellow-600">
          {{ stats.appointments }}
        </div>
        <div class="text-sm text-gray-500 mt-2">Este año</div>
      </div>
    </div>

    <!-- Psicólogos registrados -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold">Psicólogos</h3>
        <RouterLink
          to="/admin/create-psychologist"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold text-sm"
        >
          + Agregar Psicólogo
        </RouterLink>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="psychologist in psychologists"
          :key="psychologist.id"
          class="border rounded-lg p-4 text-center"
        >
          <div class="font-semibold text-lg">{{ psychologist.nombre }}</div>
          <div class="text-sm text-gray-600 mt-1">Cédula Profesional</div>
          <div class="text-sm text-gray-600">{{ psychologist.cedula }}</div>
          <span
            class="inline-block mt-2 px-2 py-1 rounded-full text-xs font-semibold"
            :class="
              psychologist.activo
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            "
          >
            {{ psychologist.activo ? "Activo" : "Inactivo" }}
          </span>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref } from "vue";
import AppLayout from "@/layouts/AppLayout.vue";

const stats = ref({
  totalUsers: 156,
  students: 142,
  psychologists: 3,
  appointments: 487,
});

const psychologists = ref([
  { id: 1, nombre: "Dra. María López", cedula: "43545", activo: true },
  { id: 2, nombre: "Dr. Carlos Ramírez", cedula: "4532453", activo: true },
  { id: 3, nombre: "Lic. Ana Martínez", cedula: "451223", activo: false },
]);
</script>
