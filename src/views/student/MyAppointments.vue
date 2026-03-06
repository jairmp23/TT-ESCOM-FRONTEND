<template>
  <AppLayout>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold">Mis Citas</h2>
      <RouterLink
        to="/student/schedule"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
      >
        + Agendar Cita
      </RouterLink>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="onFilterChange(filter.value)"
          class="px-4 py-2 rounded-lg transition-colors"
          :class="
            activeFilter === filter.value
              ? 'bg-blue-100 text-blue-700 font-semibold'
              : 'hover:bg-gray-100 text-gray-600'
          "
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <LoadingSpinner v-if="loading" message="Cargando citas..." />

    <!-- Error -->
    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
    >
      {{ error }}
    </div>

    <!-- Lista de citas -->
    <div v-else class="space-y-4">
      <div
        v-if="appointments.length === 0"
        class="bg-white rounded-lg shadow p-8 text-center text-gray-500"
      >
        No se encontraron citas para este filtro.
      </div>

      <div
        v-for="appointment in appointments"
        :key="appointment.id"
        class="bg-white rounded-lg shadow p-6 transition-opacity"
        :class="{
          'opacity-60':
            appointment.status === 'completed' ||
            appointment.status === 'cancelled',
        }"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-xl font-semibold">
                {{ getPsychologistName(appointment) }}
              </h3>
              <StatusBadge :status="appointment.status" />
            </div>
            <div class="flex flex-wrap gap-6 text-gray-700">
              <span>📅 {{ formatDate(appointment.date) }}</span>
              <span>🕐 {{ formatTime(appointment.start_time, appointment.end_time) }}</span>
            </div>
          </div>

          <!-- Cancelar solo si está agendada o confirmada -->
          <button
            v-if="appointment.status === 'scheduled' || appointment.status === 'confirmed'"
            @click="cancelAppointment(appointment.id)"
            :disabled="cancellingId === appointment.id"
            class="ml-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ cancellingId === appointment.id ? "Cancelando..." : "Cancelar" }}
          </button>
        </div>

        <div class="border-t pt-3 mt-3 space-y-1">
          <p class="text-sm text-gray-600">
            <strong>Estado:</strong> {{ statusMessage(appointment.status) }}
          </p>
          <p v-if="appointment.record_reason" class="text-sm text-gray-600">
            <strong>Motivo:</strong> {{ appointment.record_reason }}
          </p>
        </div>
      </div>

      <!-- Paginación -->
      <div class="flex justify-between items-center mt-6">
        <span class="text-gray-600">Mostrando {{ appointments.length }} de {{ total }} citas</span>
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
import { ref, computed, onMounted } from "vue";
import AppLayout from "@/layouts/AppLayout.vue";
import StatusBadge from "@/components/ui/StatusBadge.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import { useAuthStore } from "@/stores/auth";
import { useAppointmentsStore } from "@/stores/appointments";

const auth = useAuthStore();
const appointmentsStore = useAppointmentsStore();

const activeFilter = ref("all");
const appointments = ref([]);
const loading = ref(true);
const error = ref(null);
const cancellingId = ref(null);

const currentPage = ref(1);
const total = ref(0);
const totalPages = ref(1);

const filters = [
  { label: "Todas", value: "all" },
  { label: "Agendadas", value: "scheduled" },
  { label: "Confirmadas", value: "confirmed" },
  { label: "Completadas", value: "completed" },
  { label: "Canceladas", value: "cancelled" },
];


function getPsychologistName(appointment) {
  const u = appointment.psychologist_info?.user;
  if (!u) return "Psicólogo";
  return [u.first_name, u.middle_name, u.last_name].filter(Boolean).join(" ");
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function formatTime(startTime, endTime) {
  const toLabel = (t) => {
    if (!t) return "";
    const [h, min] = t.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${String(min).padStart(2, "0")} ${period}`;
  };
  return endTime
    ? `${toLabel(startTime)} – ${toLabel(endTime)}`
    : toLabel(startTime);
}

function statusMessage(status) {
  const messages = {
    scheduled: "Esperando confirmación del psicólogo",
    confirmed: "Cita confirmada",
    completed: "Sesión completada exitosamente",
    cancelled: "Cita cancelada",
  };
  return messages[status] || status;
}

async function fetchAppointments() {
  loading.value = true;
  error.value = null;
  try {
    const params = {
      student_id: auth.profile.id,
      skip: (currentPage.value - 1) * 20,
    };
    if (activeFilter.value !== "all") {
      params.status = activeFilter.value;
    }

    const res = await appointmentsStore.listAppointments(params);
    appointments.value = res.items;
    total.value = res.total;
    totalPages.value = Math.max(1, res.total_pages);
  } catch (e) {
    error.value = "Error al cargar las citas. Intenta de nuevo.";
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchAppointments();
}

function onFilterChange(value) {
  activeFilter.value = value;
  currentPage.value = 1;
  fetchAppointments();
}

async function cancelAppointment(id) {
  if (!confirm("¿Estás seguro de que deseas cancelar esta cita?")) return;
  cancellingId.value = id;
  try {
    await appointmentsStore.updateAppointment(id, { status: "cancelled" });
    const appt = appointments.value.find((a) => a.id === id);
    if (appt) appt.status = "cancelled";
  } catch (e) {
    alert(e.response?.data?.detail || "Error al cancelar la cita. Intenta de nuevo.");
    console.error(e);
  } finally {
    cancellingId.value = null;
  }
}

onMounted(fetchAppointments);
</script>
