<template>
  <AppLayout>
    <h2 class="text-3xl font-bold mb-6">
      Bienvenida, {{ auth.user?.nombre }} {{ auth.user?.apellido_paterno }}
    </h2>

    <!-- Estadísticas -->
    <div class="grid grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-gray-600 mb-2">Citas Hoy</div>
        <div class="text-3xl font-bold text-blue-600">{{ stats.today }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-gray-600 mb-2">Solicitudes Pendientes</div>
        <div class="text-3xl font-bold text-yellow-600">
          {{ stats.pending }}
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-gray-600 mb-2">Pacientes</div>
        <div class="text-3xl font-bold text-green-600">
          {{ stats.patients }}
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-gray-600 mb-2">Citas Esta Semana</div>
        <div class="text-3xl font-bold text-purple-600">{{ stats.week }}</div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <!-- Citas de hoy -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold mb-2">Citas de Hoy</h3>
        <p class="text-sm text-gray-500 mb-4">{{ todayLabel }}</p>

        <div
          v-if="todayAppointments.length === 0"
          class="text-center py-8 text-gray-500"
        >
          No tienes citas programadas para hoy.
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="appointment in todayAppointments"
            :key="appointment.id"
            class="border-l-4 border-blue-500 bg-blue-50 p-3 rounded"
          >
            <div class="flex justify-between items-start mb-1">
              <h4 class="font-semibold">{{ appointment.student }}</h4>
              <span class="text-sm text-gray-600">{{ appointment.time }}</span>
            </div>
            <p class="text-sm text-gray-600">
              Boleta: {{ appointment.boleta }}
            </p>
            <div class="mt-2">
              <span
                class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold"
              >
                Confirmada
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Solicitudes pendientes -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-xl font-semibold mb-4">Solicitudes Pendientes</h3>

        <div
          v-if="pendingAppointments.length === 0"
          class="text-center py-8 text-gray-500"
        >
          No tienes solicitudes pendientes.
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="appointment in pendingAppointments"
            :key="appointment.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex justify-between items-start mb-2">
              <div>
                <h4 class="font-semibold">{{ appointment.student }}</h4>
                <p class="text-sm text-gray-600">
                  Boleta: {{ appointment.boleta }}
                </p>
              </div>
              <span
                class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold"
              >
                Pendiente
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-3">
              📅 {{ appointment.date }} • 🕐 {{ appointment.time }}
            </p>
            <div class="flex gap-2">
              <button
                @click="acceptAppointment(appointment)"
                class="flex-1 bg-green-600 text-white py-1.5 rounded text-sm hover:bg-green-700 font-semibold"
              >
                Aceptar
              </button>
              <button
                @click="rejectAppointment(appointment)"
                class="flex-1 bg-red-600 text-white py-1.5 rounded text-sm hover:bg-red-700 font-semibold"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import AppLayout from "@/layouts/AppLayout.vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

const stats = ref({
  today: 3,
  pending: 5,
  patients: 12,
  week: 8,
});

const todayAppointments = ref([
  {
    id: 1,
    student: "Juan Pérez García",
    boleta: "2024123456",
    time: "10:00 - 11:00 AM",
  },
  {
    id: 2,
    student: "Ana Martínez López",
    boleta: "2024123457",
    time: "2:00 - 3:00 PM",
  },
  {
    id: 3,
    student: "Carlos Rodríguez Soto",
    boleta: "2024123458",
    time: "4:00 - 5:00 PM",
  },
]);

const pendingAppointments = ref([
  {
    id: 4,
    student: "Luis García Ramírez",
    boleta: "2024123459",
    date: "15 Nov 2024",
    time: "11:00 AM",
  },
  {
    id: 5,
    student: "María Fernández Cruz",
    boleta: "2024123460",
    date: "16 Nov 2024",
    time: "3:00 PM",
  },
  {
    id: 6,
    student: "Pedro Sánchez Vega",
    boleta: "2024123461",
    date: "18 Nov 2024",
    time: "10:00 AM",
  },
]);

const todayLabel = computed(() => {
  return new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

function acceptAppointment(appointment) {
  // Mock - reemplazar con llamada a API
  pendingAppointments.value = pendingAppointments.value.filter(
    (a) => a.id !== appointment.id,
  );
  stats.value.pending--;
}

function rejectAppointment(appointment) {
  // Mock - reemplazar con llamada a API
  pendingAppointments.value = pendingAppointments.value.filter(
    (a) => a.id !== appointment.id,
  );
  stats.value.pending--;
}
</script>
