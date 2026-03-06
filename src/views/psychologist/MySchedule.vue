<template>
  <AppLayout>
    <LoadingSpinner v-if="loading" message="Cargando agenda..." />

    <div v-else>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold">Mi Agenda</h2>
        <span class="text-sm text-gray-500">{{ appointmentCount }} cita(s) esta semana</span>
      </div>

      <!-- Selector de semana -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="flex justify-between items-center">
          <button @click="previousWeek" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            ← Semana Anterior
          </button>
          <h3 class="text-xl font-semibold">{{ weekLabel }}</h3>
          <button @click="nextWeek" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Semana Siguiente →
          </button>
        </div>
      </div>

      <!-- Error -->
      <div
        v-if="error"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
      >
        {{ error }}
      </div>

      <!-- Calendario semanal -->
      <div v-else class="bg-white rounded-lg shadow overflow-x-auto">
        <table class="w-full min-w-[640px]">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left w-24 text-sm">Hora</th>
              <th
                v-for="day in weekDays"
                :key="day.date"
                class="px-4 py-3 text-center"
                :class="day.isToday ? 'bg-blue-50' : ''"
              >
                <div class="font-semibold text-sm">{{ day.label }}</div>
                <div
                  class="text-sm mt-0.5"
                  :class="day.isToday ? 'text-blue-600 font-bold' : 'text-gray-600'"
                >
                  {{ day.dateLabel }}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="slot in timeSlots" :key="slot.hour" class="border-t hover:bg-gray-50/50">
              <td class="px-4 py-2 text-gray-600 font-semibold text-sm whitespace-nowrap">
                {{ slot.label }}
              </td>
              <td
                v-for="day in weekDays"
                :key="day.date"
                class="px-2 py-2"
                :class="day.isToday ? 'bg-blue-50/30' : ''"
              >
                <AppointmentCell
                  :appointment="getAppointment(day.date, slot.hour)"
                  :working="isWorkingHour(day.key, slot.hour)"
                  @click="openDetail"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Leyenda -->
      <div class="mt-6 flex gap-4 justify-center flex-wrap">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-yellow-100 border-l-4 border-yellow-500 rounded"></div>
          <span class="text-sm text-gray-600">Agendada</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-blue-100 border-l-4 border-blue-600 rounded"></div>
          <span class="text-sm text-gray-600">Confirmada</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-green-100 border-l-4 border-green-600 rounded"></div>
          <span class="text-sm text-gray-600">Completada</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-gray-100 border-l-4 border-gray-400 opacity-60 rounded"></div>
          <span class="text-sm text-gray-600">No se presentó</span>
        </div>
      </div>
    </div>

    <!-- Modal detalle de cita -->
    <Transition name="modal">
      <div
        v-if="selectedAppointment"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="closeDetail"
      >
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md">
          <div class="p-6">
            <div class="flex justify-between items-start mb-5">
              <h3 class="text-xl font-bold">Detalle de Cita</h3>
              <button
                @click="closeDetail"
                class="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                ×
              </button>
            </div>

            <div class="space-y-3 mb-6 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-gray-500">Estudiante</span>
                <span class="font-semibold">{{ selectedStudentName }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">Fecha</span>
                <span class="font-semibold">{{ formatDate(selectedAppointment.date) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">Hora</span>
                <span class="font-semibold">
                  {{ formatTimeRange(selectedAppointment.start_time, selectedAppointment.end_time) }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">Estado</span>
                <StatusBadge :status="selectedAppointment.status" size="sm" />
              </div>
              <div v-if="selectedAppointment.record_reason" class="pt-3 border-t">
                <p class="text-gray-500 mb-1">Motivo</p>
                <p class="text-gray-800">{{ selectedAppointment.record_reason }}</p>
              </div>
            </div>

            <!-- Mensaje de éxito temporal -->
            <div
              v-if="actionSuccess"
              class="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm text-center"
            >
              {{ actionSuccess }}
            </div>

            <!-- Error en modal -->
            <div
              v-if="actionError"
              class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
            >
              {{ actionError }}
            </div>

            <!-- Acciones -->
            <!-- Acciones según estado -->
            <div v-if="selectedAppointment.status === 'scheduled'" class="flex gap-3">
              <button
                @click="confirmAppointment(selectedAppointment)"
                :disabled="actioning"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ actioning ? "Procesando..." : "Confirmar" }}
              </button>
              <button
                @click="cancelAppointment(selectedAppointment)"
                :disabled="actioning"
                class="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ actioning ? "Procesando..." : "Cancelar" }}
              </button>
            </div>

            <div v-else-if="selectedAppointment.status === 'confirmed'" class="flex gap-3">
              <button
                @click="markNoShow(selectedAppointment)"
                :disabled="actioning"
                class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ actioning ? "Procesando..." : "No se presentó" }}
              </button>
              <button
                @click="cancelAppointment(selectedAppointment)"
                :disabled="actioning"
                class="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ actioning ? "Procesando..." : "Cancelar" }}
              </button>
            </div>

            <div v-else class="text-center text-gray-400 text-sm py-2">
              No hay acciones disponibles para esta cita.
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </AppLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import AppLayout from "@/layouts/AppLayout.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import StatusBadge from "@/components/ui/StatusBadge.vue";
import AppointmentCell from "@/components/ui/AppointmentCell.vue";
import { STATUS_CONFIG } from "@/utils/statusConfig";
import { useAuthStore } from "@/stores/auth";
import { useAppointmentsStore } from "@/stores/appointments";
import { localDateStr } from "@/utils/dates";

const auth = useAuthStore();
const appointmentsStore = useAppointmentsStore();

const currentWeekStart = ref(getMonday(new Date()));
const appointments = ref([]);
const loading = ref(true);
const error = ref(null);

const selectedAppointment = ref(null);
const actioning = ref(false);
const actionError = ref("");
const actionSuccess = ref("");

const selectedStudentName = computed(() => {
  const u = selectedAppointment.value?.student_info?.user;
  if (!u) return "Estudiante";
  return [u.first_name, u.last_name].filter(Boolean).join(" ");
});

const DAY_NAMES = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const DAY_KEYS  = ["monday", "tuesday", "wednesday", "thursday", "friday"];

/**
 * Genera las filas de hora a partir del horario del psicólogo.
 * Toma la unión de todos los rangos activos (ej: lunes 9-13, miércoles 14-17
 * → filas 9, 10, 11, 12, 14, 15, 16).
 */
const timeSlots = computed(() => {
  const schedule = auth.profile?.schedule ?? [];
  const hours = new Set();

  for (const day of schedule) {
    if (!day.active || !day.start || !day.end) continue;
    const startH = parseInt(day.start.split(":")[0], 10);
    const endH   = parseInt(day.end.split(":")[0], 10);
    for (let h = startH; h < endH; h++) {
      hours.add(h);
    }
  }

  // Fallback: si el perfil aún no tiene schedule, mostrar rango típico
  if (hours.size === 0) {
    for (let h = 8; h < 18; h++) hours.add(h);
  }

  return Array.from(hours)
    .sort((a, b) => a - b)
    .map((h) => ({ hour: h, label: formatHour(h) }));
});

/** Mapa { "monday": { start:"09:00", end:"17:00", active:true }, ... } */
const scheduleByKey = computed(() => {
  const schedule = auth.profile?.schedule ?? [];
  return Object.fromEntries(schedule.map((d) => [d.key, d]));
});

const today = localDateStr();

const weekDays = computed(() => {
  return DAY_NAMES.map((label, i) => {
    const date = new Date(currentWeekStart.value);
    date.setDate(date.getDate() + i);
    const dateStr = localDateStr(date);
    return {
      label,
      key: DAY_KEYS[i],
      date: dateStr,
      isToday: dateStr === today,
      dateLabel: date.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
      }),
    };
  });
});

const weekLabel = computed(() => {
  const start = weekDays.value[0];
  const end = weekDays.value[4];
  return `Semana del ${start.dateLabel} – ${end.dateLabel}`;
});

const appointmentCount = computed(() =>
  appointments.value.filter(
    (a) => a.status !== "cancelled"
  ).length
);

// ── Helpers de fecha/hora ─────────────────────────────────────────────────────

function formatHour(h) {
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:00 ${period}`;
}

/** Devuelve true si `slotHour` cae dentro del horario activo del día `dayKey`. */
function isWorkingHour(dayKey, slotHour) {
  const entry = scheduleByKey.value[dayKey];
  if (!entry || !entry.active || !entry.start || !entry.end) return false;
  const startH = parseInt(entry.start.split(":")[0], 10);
  const endH   = parseInt(entry.end.split(":")[0], 10);
  return slotHour >= startH && slotHour < endH;
}

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d;
}

function previousWeek() {
  const d = new Date(currentWeekStart.value);
  d.setDate(d.getDate() - 7);
  currentWeekStart.value = d;
}

function nextWeek() {
  const d = new Date(currentWeekStart.value);
  d.setDate(d.getDate() + 7);
  currentWeekStart.value = d;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function formatTimeRange(startTime, endTime) {
  const toLabel = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, "0")} ${period}`;
  };
  return endTime ? `${toLabel(startTime)} – ${toLabel(endTime)}` : toLabel(startTime);
}

// ── Búsqueda en grilla ────────────────────────────────────────────────────────

function getAppointment(date, slotHour) {
  return (
    appointments.value.find((a) => {
      if (a.status === "cancelled") return false;
      if (a.date !== date || !a.start_time) return false;
      const appointmentHour = parseInt(a.start_time.split(":")[0], 10);
      return appointmentHour === slotHour;
    }) || null
  );
}

function statusLabel(status) { return STATUS_CONFIG[status]?.label ?? status; }

// ── API ───────────────────────────────────────────────────────────────────────

async function fetchAppointments() {
  loading.value = true;
  error.value = null;
  try {
    const res = await appointmentsStore.listAppointments({
      psychologist_id: auth.profile.id,
      date_from: weekDays.value[0].date,
      date_to:   weekDays.value[4].date,
      limit: 100,
    });
    appointments.value = res.items ?? res;
  } catch (e) {
    error.value = "Error al cargar la agenda. Intenta de nuevo.";
    console.error(e);
  } finally {
    loading.value = false;
  }
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function openDetail(appointment) {
  selectedAppointment.value = { ...appointment };
  actionError.value = "";
  actionSuccess.value = "";
}

function closeDetail() {
  selectedAppointment.value = null;
  actionError.value = "";
  actionSuccess.value = "";
}

async function confirmAppointment(appointment) {
  if (!confirm("¿Confirmar esta cita?")) return;
  actioning.value = true;
  actionError.value = "";
  try {
    await appointmentsStore.updateAppointment(appointment.id, { status: "confirmed" });
    const idx = appointments.value.findIndex((a) => a.id === appointment.id);
    if (idx !== -1) appointments.value[idx].status = "confirmed";
    selectedAppointment.value.status = "confirmed";
    actionSuccess.value = "Cita confirmada correctamente.";
    setTimeout(closeDetail, 1500);
  } catch (e) {
    actionError.value = e.response?.data?.detail || "Error al confirmar la cita.";
    console.error(e);
  } finally {
    actioning.value = false;
  }
}

async function markNoShow(appointment) {
  if (!confirm("¿Marcar que el estudiante no se presentó?")) return;
  actioning.value = true;
  actionError.value = "";
  try {
    await appointmentsStore.updateAppointment(appointment.id, { status: "no_show" });
    const idx = appointments.value.findIndex((a) => a.id === appointment.id);
    if (idx !== -1) appointments.value[idx].status = "no_show";
    selectedAppointment.value.status = "no_show";
    actionSuccess.value = "Marcada como no presentado.";
    setTimeout(closeDetail, 1500);
  } catch (e) {
    actionError.value = e.response?.data?.detail || "Error al actualizar la cita.";
    console.error(e);
  } finally {
    actioning.value = false;
  }
}

async function cancelAppointment(appointment) {
  if (!confirm("¿Cancelar esta cita? Esta acción no se puede deshacer.")) return;
  actioning.value = true;
  actionError.value = "";
  try {
    await appointmentsStore.updateAppointment(appointment.id, { status: "cancelled" });
    const idx = appointments.value.findIndex((a) => a.id === appointment.id);
    if (idx !== -1) appointments.value[idx].status = "cancelled";
    selectedAppointment.value.status = "cancelled";
    actionSuccess.value = "Cita cancelada.";
    setTimeout(closeDetail, 1500);
  } catch (e) {
    actionError.value = e.response?.data?.detail || "Error al cancelar la cita.";
    console.error(e);
  } finally {
    actioning.value = false;
  }
}

watch(currentWeekStart, fetchAppointments);
onMounted(fetchAppointments);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
