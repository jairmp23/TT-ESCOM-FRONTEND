<template>
  <AppLayout>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold">Gestión de Usuarios</h2>
      <RouterLink
        to="/admin/create-psychologist"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
      >
        + Crear Psicólogo
      </RouterLink>
    </div>

    <!-- Buscador y filtro -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex gap-4">
        <input
          v-model="search"
          type="text"
          placeholder="Buscar por nombre, boleta, email..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          v-model="roleFilter"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los roles</option>
          <option value="student">Alumnos</option>
          <option value="psychologist">Psicólogos</option>
        </select>
      </div>
    </div>

    <!-- Tabla de usuarios -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-left font-semibold">Usuario</th>
            <th class="px-6 py-3 text-left font-semibold">Rol</th>
            <th class="px-6 py-3 text-left font-semibold">Identificador</th>
            <th class="px-6 py-3 text-left font-semibold">Fecha Registro</th>
            <th class="px-6 py-3 text-left font-semibold">Estado</th>
            <th class="px-6 py-3 text-left font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr
            v-for="user in filteredUsers"
            :key="user.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4">
              <div class="font-semibold">{{ user.nombre }}</div>
              <div class="text-sm text-gray-600">{{ user.email }}</div>
            </td>
            <td class="px-6 py-4">
              <span
                class="px-2 py-1 rounded-full text-xs font-semibold"
                :class="
                  user.role === 'psychologist'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                "
              >
                {{ user.role === "psychologist" ? "Psicólogo" : "Alumno" }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-700">{{ user.identifier }}</td>
            <td class="px-6 py-4 text-gray-700">{{ user.createdAt }}</td>
            <td class="px-6 py-4">
              <span
                class="px-2 py-1 rounded-full text-xs font-semibold"
                :class="
                  user.activo
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                "
              >
                {{ user.activo ? "Activo" : "Inactivo" }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex gap-2">
                <button
                  @click="toggleStatus(user)"
                  class="text-sm font-semibold"
                  :class="
                    user.activo
                      ? 'text-red-600 hover:text-red-800'
                      : 'text-green-600 hover:text-green-800'
                  "
                >
                  {{ user.activo ? "Desactivar" : "Activar" }}
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="filteredUsers.length === 0">
            <td colspan="6" class="px-6 py-8 text-center text-gray-500">
              No se encontraron usuarios.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div class="flex justify-between items-center mt-6">
      <div class="text-gray-600">
        Mostrando {{ filteredUsers.length }} de {{ users.length }} usuarios
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
const roleFilter = ref("all");

const users = ref([
  {
    id: 1,
    nombre: "Dra. María López Hernández",
    email: "maria.lopez@ipn.mx",
    role: "psychologist",
    identifier: "Cédula: 7654321",
    createdAt: "15 Ene 2024",
    activo: true,
  },
  {
    id: 2,
    nombre: "Dr. Carlos Ramírez Soto",
    email: "carlos.ramirez@ipn.mx",
    role: "psychologist",
    identifier: "Cédula: 8765432",
    createdAt: "20 Ene 2024",
    activo: true,
  },
  {
    id: 3,
    nombre: "Juan Pérez García",
    email: "juan.perez@alumno.ipn.mx",
    role: "student",
    identifier: "Boleta: 2024123456",
    createdAt: "10 Feb 2024",
    activo: true,
  },
  {
    id: 4,
    nombre: "Ana Martínez López",
    email: "ana.martinez@alumno.ipn.mx",
    role: "student",
    identifier: "Boleta: 2024123457",
    createdAt: "12 Feb 2024",
    activo: true,
  },
  {
    id: 5,
    nombre: "Luis García Ramírez",
    email: "luis.garcia@alumno.ipn.mx",
    role: "student",
    identifier: "Boleta: 2024123459",
    createdAt: "5 Mar 2024",
    activo: false,
  },
]);

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchesSearch =
      search.value === "" ||
      user.nombre.toLowerCase().includes(search.value.toLowerCase()) ||
      user.email.toLowerCase().includes(search.value.toLowerCase()) ||
      user.identifier.toLowerCase().includes(search.value.toLowerCase());

    const matchesRole =
      roleFilter.value === "all" || user.role === roleFilter.value;

    return matchesSearch && matchesRole;
  });
});

function toggleStatus(user) {
  // Mock - reemplazar con llamada a API
  user.activo = !user.activo;
}
</script>
