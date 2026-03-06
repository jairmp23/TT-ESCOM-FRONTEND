<template>
  <AppLayout>
    <LoadingSpinner v-if="loading" message="Cargando dashboard..." />

    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      {{ error }}
    </div>

    <template v-else>
      <h2 class="text-3xl font-bold mb-6">
        Bienvenido(a), {{ studentFirstName }}
      </h2>
      <!-- Tarjetas de estadísticas -->
      <div class="grid grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-gray-600 mb-2">Citas Agendadas</div>
          <div class="text-3xl font-bold text-blue-600">{{ stats.upcoming }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-gray-600 mb-2">Citas Completadas</div>
          <div class="text-3xl font-bold text-green-600">{{ stats.completed }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="text-gray-600 mb-2">Próxima Cita</div>
          <div v-if="nextAppointment" class="mt-1">
            <div class="text-lg font-bold text-gray-800">
              {{ formatDate(nextAppointment.date) }}
            </div>
            <div class="text-sm text-gray-500 mt-1">
              {{ formatTime(nextAppointment.start_time, nextAppointment.end_time) }}
            </div>
          </div>
          <div v-else class="text-lg font-bold text-gray-400 mt-1">Sin citas próximas</div>
        </div>
      </div>

      <!-- Próximas citas -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h3 class="text-xl font-semibold mb-4">Próximas Citas</h3>

        <div v-if="upcomingAppointments.length === 0" class="text-center py-8 text-gray-500">
          No tienes citas próximas.
          <RouterLink to="/student/schedule" class="text-blue-600 hover:underline ml-1">
            Agenda una ahora.
          </RouterLink>
        </div>

        <div v-else class="space-y-4">
          <div v-for="appointment in upcomingAppointments" :key="appointment.id"
            class="border border-gray-200 rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-semibold text-lg">
                {{ getPsychologistName(appointment) }}
              </h4>
              <StatusBadge :status="appointment.status" />
            </div>
            <div class="flex gap-4 text-sm text-gray-600 mt-3">
              <span>📅 {{ formatDate(appointment.date) }}</span>
              <span>🕐 {{ formatTime(appointment.start_time, appointment.end_time) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón agendar -->
      <div class="text-center">
        <RouterLink to="/student/schedule"
          class="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold text-lg">
          Agendar Nueva Cita
        </RouterLink>
      </div>
    </template>
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

const appointments = ref([]);
const loading = ref(true);
const error = ref(null);

const studentFirstName = computed(
  () => auth.profile?.user?.first_name ?? "Estudiante"
);

const upcomingAppointments = computed(() =>
  appointments.value
    .filter((a) => a.status === "scheduled" || a.status === "confirmed")
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.start_time}`);
      const dateB = new Date(`${b.date}T${b.start_time}`);
      return dateA - dateB;
    })
);

const stats = computed(() => ({
  upcoming: upcomingAppointments.value.length,
  completed: appointments.value.filter((a) => a.status === "completed").length,
}));

const nextAppointment = computed(() => upcomingAppointments.value[0] ?? null);

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

async function fetchAppointments() {
  loading.value = true;
  error.value = null;
  try {
    const res = await appointmentsStore.listAppointments({
      student_id: auth.profile.id,
      skip: 0,
    });
    appointments.value = res.items;
  } catch (e) {
    error.value = "Error al cargar el dashboard. Intenta de nuevo.";
    console.error(e);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchAppointments);
</script>
