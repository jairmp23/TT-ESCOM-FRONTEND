<template>
  <AppLayout>
    <LoadingSpinner v-if="loading" message="Cargando dashboard..." />

    <div v-else>
      <div class="mb-6">
        <h2 class="text-3xl font-bold">Bienvenido(a), {{ firstName }}</h2>
        <p class="text-gray-500 mt-1 capitalize">{{ todayLabel }}</p>
      </div>

      <!-- Estadísticas -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-lg shadow p-5">
          <p class="text-gray-500 text-sm mb-1">Citas Hoy</p>
          <p class="text-3xl font-bold text-blue-600">{{ stats.today }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-5">
          <p class="text-gray-500 text-sm mb-1">Por Confirmar</p>
          <p class="text-3xl font-bold text-yellow-600">{{ stats.pending }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-5">
          <p class="text-gray-500 text-sm mb-1">Pacientes esta semana</p>
          <p class="text-3xl font-bold text-green-600">{{ stats.patients }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-5">
          <p class="text-gray-500 text-sm mb-1">Citas esta Semana</p>
          <p class="text-3xl font-bold text-purple-600">{{ stats.week }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Citas de hoy -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-xl font-semibold mb-4">Citas de Hoy</h3>

          <div v-if="errorToday" class="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {{ errorToday }}
          </div>

          <div v-else-if="todayAppointments.length === 0" class="text-center py-8 text-gray-400">
            No hay citas programadas para hoy.
          </div>

          <div v-else class="space-y-3">
            <div v-for="appt in todayAppointments" :key="appt.id" class="border-l-4 p-3 rounded-r-lg"
              :class="appt.status === 'confirmed' ? 'border-blue-500 bg-blue-50' : 'border-yellow-400 bg-yellow-50'">
              <div class="flex justify-between items-start">
                <div class="min-w-0 flex-1">
                  <p class="font-semibold truncate">{{ getStudentName(appt) }}</p>
                  <p class="text-sm text-gray-500 mt-0.5">
                    Boleta: {{ appt.student_info?.student_id ?? "—" }}
                  </p>
                </div>
                <div class="ml-3 text-right shrink-0">
                  <p class="text-sm font-semibold text-gray-700">{{ formatTime(appt.start_time) }}</p>
                  <StatusBadge :status="appt.status" size="sm" class="mt-1" />
                </div>
              </div>
              <p v-if="appt.record_reason" class="text-xs text-gray-500 mt-2 truncate">
                {{ appt.record_reason }}
              </p>
            </div>
          </div>
        </div>

        <!-- Solicitudes por confirmar -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-xl font-semibold mb-4">Solicitudes por Confirmar</h3>

          <div v-if="errorPending" class="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {{ errorPending }}
          </div>

          <div v-else-if="pendingAppointments.length === 0" class="text-center py-8 text-gray-400">
            No hay solicitudes pendientes de confirmación.
          </div>

          <div v-else class="space-y-3">
            <div v-for="appt in pendingAppointments" :key="appt.id"
              class="border border-gray-200 rounded-lg p-4 transition-opacity"
              :class="{ 'opacity-40 pointer-events-none': actioningId === appt.id }">
              <div class="flex justify-between items-start mb-2">
                <div class="min-w-0 flex-1">
                  <p class="font-semibold truncate">{{ getStudentName(appt) }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">
                    Boleta: {{ appt.student_info?.student_id ?? "—" }}
                  </p>
                </div>
                <StatusBadge status="scheduled" size="sm" class="ml-2 shrink-0" />
              </div>

              <p class="text-sm text-gray-600 mb-3">
                📅 {{ formatDate(appt.date) }} &nbsp;·&nbsp; 🕐 {{ formatTime(appt.start_time) }}
              </p>

              <p v-if="appt.record_reason" class="text-xs text-gray-500 mb-3 truncate">
                {{ appt.record_reason }}
              </p>

              <div class="flex gap-2">
                <button @click="confirmAppointment(appt)"
                  class="flex-1 bg-blue-600 text-white py-1.5 rounded-lg text-sm hover:bg-blue-700 font-semibold transition-colors">
                  Confirmar
                </button>
                <button @click="cancelAppointment(appt)"
                  class="flex-1 bg-red-100 text-red-700 py-1.5 rounded-lg text-sm hover:bg-red-200 font-semibold transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import AppLayout from "@/layouts/AppLayout.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import StatusBadge from "@/components/ui/StatusBadge.vue";
import { useAuthStore } from "@/stores/auth";
import { useAppointmentsStore } from "@/stores/appointments";
import { localDateStr } from "@/utils/dates";

const auth = useAuthStore();
const appointmentsStore = useAppointmentsStore();

// ── Estado ────────────────────────────────────────────────────────────────────

const todayAppointments = ref([]);
const pendingAppointments = ref([]);
const actioningId = ref(null);
const loading = ref(true);

const errorToday = ref(null);
const errorPending = ref(null);

const weekStats = ref({ total: 0, patients: 0 });

// ── Computed ──────────────────────────────────────────────────────────────────

const firstName = computed(() => auth.profile?.user?.first_name ?? "");

const todayLabel = computed(() =>
  new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
);

const stats = computed(() => ({
  today: todayAppointments.value.length,
  pending: pendingAppointments.value.length,
  week: weekStats.value.total,
  patients: weekStats.value.patients,
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function getStudentName(appt) {
  const u = appt.student_info?.user;
  if (!u) return "Estudiante";
  return [u.first_name, u.last_name].filter(Boolean).join(" ");
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
  return localDateStr(d);
}

function getFriday(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1) + 4);
  return localDateStr(d);
}

// ── API ───────────────────────────────────────────────────────────────────────

async function fetchAll() {
  loading.value = true;
  errorToday.value = null;
  errorPending.value = null;

  const today = localDateStr();
  const now = new Date();

  await Promise.all([
    // Citas de hoy
    appointmentsStore.listAppointments({
      psychologist_id: auth.profile.id,
      date_from: today,
      date_to: today,
    }).then((res) => {
      const items = res.items ?? res;
      todayAppointments.value = items
        .filter((a) => a.status !== "cancelled" && a.date === today)
        .sort((a, b) => (a.start_time > b.start_time ? 1 : -1));
    }).catch((e) => {
      errorToday.value = "Error al cargar las citas de hoy.";
      console.error(e);
    }),

    // Solicitudes por confirmar
    appointmentsStore.listAppointments({
      psychologist_id: auth.profile.id,
      status: "scheduled",
    }).then((res) => {
      pendingAppointments.value = (res.items ?? res).sort(
        (a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : a.start_time > b.start_time ? 1 : -1),
      );
    }).catch((e) => {
      errorPending.value = "Error al cargar las solicitudes pendientes.";
      console.error(e);
    }),

    // Stats de la semana
    appointmentsStore.listAppointments({
      psychologist_id: auth.profile.id,
      date_from: getMonday(now),
      date_to: getFriday(now),
    }).then((res) => {
      const items = (res.items ?? res).filter((a) => a.status !== "cancelled");
      const uniqueStudents = new Set(items.map((a) => a.student_info?.id));
      weekStats.value = { total: items.length, patients: uniqueStudents.size };
    }).catch(() => {
      weekStats.value = { total: 0, patients: 0 };
    }),
  ]);

  loading.value = false;
}

async function confirmAppointment(appt) {
  actioningId.value = appt.id;
  try {
    await appointmentsStore.updateAppointment(appt.id, { status: "confirmed" });
    pendingAppointments.value = pendingAppointments.value.filter((a) => a.id !== appt.id);
    // Si la cita es hoy, actualizarla en la lista de hoy
    const idx = todayAppointments.value.findIndex((a) => a.id === appt.id);
    if (idx !== -1) todayAppointments.value[idx].status = "confirmed";
    else await fetchAll();
  } catch (e) {
    alert(e.response?.data?.detail || "Error al confirmar la cita.");
    console.error(e);
  } finally {
    actioningId.value = null;
  }
}

async function cancelAppointment(appt) {
  if (!confirm("¿Cancelar esta solicitud?")) return;
  actioningId.value = appt.id;
  try {
    await appointmentsStore.updateAppointment(appt.id, { status: "cancelled" });
    pendingAppointments.value = pendingAppointments.value.filter((a) => a.id !== appt.id);
    todayAppointments.value = todayAppointments.value.filter((a) => a.id !== appt.id);
  } catch (e) {
    alert(e.response?.data?.detail || "Error al cancelar la cita.");
    console.error(e);
  } finally {
    actioningId.value = null;
  }
}

onMounted(fetchAll);
</script>
