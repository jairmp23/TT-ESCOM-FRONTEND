<template>
  <AppLayout>
    <h2 class="text-3xl font-bold mb-6">Welcome, {{ auth.user?.nombre }}</h2>

    <!-- Stats cards -->
    <div class="grid grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-gray-600 mb-2">Citas Pendientes</div>
        <div class="text-3xl font-bold text-blue-600">{{ stats.pending }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-gray-600 mb-2">Citas Completadas</div>
        <div class="text-3xl font-bold text-green-600">
          {{ stats.completed }}
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-gray-600 mb-2">Próxima Cita</div>
        <div class="text-lg font-bold text-gray-800">
          {{ nextAppointment ? nextAppointment.date : "None scheduled" }}
        </div>
      </div>
    </div>

    <!-- Upcoming appointments -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h3 class="text-xl font-semibold mb-4">Próximas Citas</h3>

      <div
        v-if="upcomingAppointments.length === 0"
        class="text-center py-8 text-gray-500"
      >
        No upcoming appointments.
        <RouterLink
          to="/student/schedule"
          class="text-blue-600 hover:underline ml-1"
        >
          Agenda una ahora.
        </RouterLink>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="appointment in upcomingAppointments"
          :key="appointment.id"
          class="border border-gray-200 rounded-lg p-4"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
              <h4 class="font-semibold text-lg">
                {{ appointment.psychologist }}
              </h4>
            </div>
            <StatusBadge :status="appointment.status" />
          </div>
          <div class="flex gap-4 text-sm text-gray-600 mt-3">
            <span>📅 {{ appointment.date }}</span>
            <span>🕐 {{ appointment.time }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Schedule button -->
    <div class="text-center">
      <RouterLink
        to="/student/schedule"
        class="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold text-lg"
      >
        Agendar Nueva Cita
      </RouterLink>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import AppLayout from "@/layouts/AppLayout.vue";
import StatusBadge from "@/components/ui/StatusBadge.vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

// Mock data - reemplazar con llamada a API
const appointments = ref([
  {
    id: 1,
    psychologist: "María López Hernández",
    date: "November 15, 2024",
    time: "10:00 AM - 11:00 AM",
    status: "pending",
  },
  {
    id: 2,
    psychologist: "María López Hernández",
    date: "November 18, 2024",
    time: "2:00 PM - 3:00 PM",
    status: "confirmed",
  },
]);

const upcomingAppointments = computed(() =>
  appointments.value.filter(
    (a) => a.status === "pending" || a.status === "confirmed",
  ),
);

const stats = computed(() => ({
  pending: appointments.value.filter((a) => a.status === "pending").length,
  completed: appointments.value.filter((a) => a.status === "completed").length,
}));

const nextAppointment = computed(() => upcomingAppointments.value[0] || null);
</script>
