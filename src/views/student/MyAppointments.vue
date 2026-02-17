<template>
  <AppLayout>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold">My Appointments</h2>
      <RouterLink
        to="/student/schedule"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
      >
        + New Appointment
      </RouterLink>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex gap-4">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="activeFilter = filter.value"
          :class="
            activeFilter === filter.value
              ? 'bg-blue-100 text-blue-700 font-semibold'
              : 'hover:bg-gray-100 text-gray-600'
          "
          class="px-4 py-2 rounded-lg transition-colors"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Appointments list -->
    <div class="space-y-4">
      <div
        v-if="filteredAppointments.length === 0"
        class="bg-white rounded-lg shadow p-8 text-center text-gray-500"
      >
        No se encontraron citas para este filtro.
      </div>

      <div
        v-for="appointment in filteredAppointments"
        :key="appointment.id"
        class="bg-white rounded-lg shadow p-6"
        :class="{
          'opacity-75':
            appointment.status === 'completed' ||
            appointment.status === 'cancelled',
        }"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-xl font-semibold">
                {{ appointment.psychologist }}
              </h3>
              <StatusBadge :status="appointment.status" />
            </div>
            <div class="flex gap-6 text-gray-700">
              <span>📅 {{ appointment.date }}</span>
              <span>🕐 {{ appointment.time }}</span>
            </div>
          </div>

          <!-- Cancel button only for pending/confirmed -->
          <div
            v-if="
              appointment.status === 'pending' ||
              appointment.status === 'confirmed'
            "
          >
            <button
              @click="cancelAppointment(appointment.id)"
              class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>

        <div class="border-t pt-3 mt-3">
          <p class="text-sm text-gray-600">
            <strong>Status:</strong> {{ statusMessage(appointment.status) }}
          </p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import AppLayout from "@/layouts/AppLayout.vue";
import StatusBadge from "@/components/ui/StatusBadge.vue";

const activeFilter = ref("all");

const filters = [
  { label: "Todas", value: "all" },
  { label: "Pendientes", value: "pending" },
  { label: "Confirmadas", value: "confirmed" },
  { label: "Completadas", value: "completed" },
  { label: "Canceladas", value: "cancelled" },
];

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
  {
    id: 3,
    psychologist: "María López Hernández",
    date: "November 8, 2024",
    time: "10:00 AM - 11:00 AM",
    status: "completed",
  },
  {
    id: 4,
    psychologist: "María López Hernández",
    date: "November 5, 2024",
    time: "3:00 PM - 4:00 PM",
    status: "cancelled",
  },
]);

const filteredAppointments = computed(() => {
  if (activeFilter.value === "all") return appointments.value;
  return appointments.value.filter((a) => a.status === activeFilter.value);
});

function statusMessage(status) {
  const messages = {
    pending: "Waiting for psychologist confirmation",
    confirmed: "Appointment confirmed",
    completed: "Session completed successfully",
    cancelled: "Appointment cancelled",
  };
  return messages[status] || status;
}

function cancelAppointment(id) {
  // Mock - reemplazar con llamada a API
  const appointment = appointments.value.find((a) => a.id === id);
  if (appointment) appointment.status = "cancelled";
}
</script>
