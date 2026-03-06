<template>
  <AppLayout>
    <h2 class="text-3xl font-bold mb-6">Agendar Nueva Cita</h2>

    <!-- Loading psicólogos -->
    <LoadingSpinner v-if="loading" message="Cargando información..." />

    <!-- Error al cargar psicólogos -->
    <div v-else-if="psychologistsError && !loading" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
      {{ psychologistsError }}
    </div>

    <div v-else class="bg-white rounded-lg shadow p-6 mb-8">
      <form @submit.prevent="handleSubmit">
        <!-- Seleccionar Psicólogo -->
        <div class="mb-6">
          <label class="block text-gray-700 font-semibold mb-3">Seleccionar Psicólogo</label>

          <div v-if="psychologists.length === 0" class="text-gray-500 text-sm">
            No hay psicólogos disponibles en este momento.
          </div>

          <div v-else class="space-y-3">
            <div v-for="psychologist in psychologists" :key="psychologist.id"
              @click="form.psychologistId = psychologist.id"
              class="border rounded-lg p-4 cursor-pointer transition-colors" :class="form.psychologistId === psychologist.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400'
                ">
              <div class="flex items-start gap-3">
                <input type="radio" :value="psychologist.id" v-model="form.psychologistId" class="mt-1" />
                <div class="flex-1">
                  <h4 class="font-semibold text-lg">
                    {{ getFullName(psychologist) }}
                  </h4>
                  <p class="text-sm text-gray-500 mt-1">
                    Cédula: {{ psychologist.license_number }}
                  </p>
                  <p class="text-sm text-blue-600 mt-1">
                    Horarios: {{ formatScheduleText(psychologist.schedule) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p v-if="errors.psychologistId" class="text-red-600 text-sm mt-1">
            {{ errors.psychologistId }}
          </p>
        </div>

        <!-- Seleccionar Fecha -->
        <div class="mb-6">
          <label class="block text-gray-700 font-semibold mb-2">Fecha</label>
          <input v-model="form.date" type="date" :min="minDate" @change="onDateChange"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p v-if="errors.date" class="text-red-600 text-sm mt-1">
            {{ errors.date }}
          </p>
        </div>

        <!-- Seleccionar Hora -->
        <div class="mb-6">
          <label class="block text-gray-700 font-semibold mb-3">Horarios Disponibles</label>

          <div v-if="!form.date || !form.psychologistId" class="text-gray-500 text-sm">
            Selecciona un psicólogo y una fecha para ver los horarios disponibles.
          </div>

          <div v-else-if="slotsError" class="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {{ slotsError }}
          </div>

          <div v-else-if="availableSlots.length === 0"
            class="text-gray-500 text-sm bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
            No hay horarios disponibles para esta fecha.
          </div>

          <div class="grid grid-cols-4 gap-3">
            <button v-for="slot in availableSlots" :key="slot.start_time" type="button"
              @click="form.selectedSlot = slot" class="px-4 py-2 border rounded-lg transition-colors" :class="isSelectedSlot(slot)
                ? 'bg-blue-100 border-blue-500 text-blue-700 font-semibold'
                : 'border-gray-300 hover:bg-blue-50 hover:border-blue-400'
                ">
              {{ slotToLabel(slot.start_time) }}
            </button>
          </div>

          <p v-if="errors.selectedSlot" class="text-red-600 text-sm mt-1">
            {{ errors.selectedSlot }}
          </p>
        </div>

        <!-- Motivo (opcional) -->
        <div class="mb-6">
          <label class="block text-gray-700 font-semibold mb-2">
            Motivo de la Consulta
            <span class="text-gray-400 font-normal">(Opcional)</span>
          </label>
          <textarea v-model="form.record_reason" rows="3" placeholder="Describe brevemente el motivo de tu consulta..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>

        <!-- Error general -->
        <div v-if="submitError" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {{ submitError }}
        </div>

        <!-- Success -->
        <div v-if="submitSuccess" class="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
          ¡Cita solicitada exitosamente! Redirigiendo a Mis Citas...
        </div>

        <!-- Botones -->
        <div class="flex gap-4">
          <RouterLink to="/student/appointments"
            class="flex-1 text-center bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 font-semibold">
            Cancelar
          </RouterLink>
          <button type="submit" :disabled="submitting || submitSuccess"
            class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50">
            {{ submitting ? "Enviando..." : "Solicitar Cita" }}
          </button>
        </div>
      </form>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import { useAuthStore } from "@/stores/auth";
import { usePsychologistsStore } from "@/stores/psychologists";
import { useAppointmentsStore } from "@/stores/appointments";
import { localDateStr } from "@/utils/dates";

const router = useRouter();
const auth = useAuthStore();
const psychologistsStore = usePsychologistsStore();
const appointmentsStore = useAppointmentsStore();

const psychologists = ref([]);
const loading = ref(true);
const psychologistsError = ref("");

// Cada slot es { start_time: "HH:MM:SS.sssZ", end_time: "HH:MM:SS.sssZ" }
const availableSlots = ref([]);
const slotsError = ref("");

const form = ref({
  psychologistId: null,
  date: "",
  selectedSlot: null,
  record_reason: "",
});

const errors = ref({
  psychologistId: "",
  date: "",
  selectedSlot: "",
});

const submitting = ref(false);
const submitError = ref("");
const submitSuccess = ref(false);

const minDate = computed(() => localDateStr());

function isWeekend(dateStr) {
  if (!dateStr) return false;
  const [y, m, d] = dateStr.split("-").map(Number);
  const day = new Date(y, m - 1, d).getDay(); // local time, 0=domingo, 6=sábado
  return day === 0 || day === 6;
}

function onDateChange() {
  if (isWeekend(form.value.date)) {
    errors.value.date = "No se pueden agendar citas los fines de semana (sábado o domingo).";
    form.value.date = "";
    availableSlots.value = [];
  } else {
    errors.value.date = "";
  }
}

function getFullName(psychologist) {
  const { first_name, middle_name, last_name } = psychologist.user;
  return [first_name, middle_name, last_name].filter(Boolean).join(" ");
}

function formatScheduleText(schedule) {
  if (!Array.isArray(schedule)) return "Sin horario";
  const active = schedule.filter((s) => s.active);
  if (!active.length) return "Sin horario";
  return active.map((s) => `${s.label}: ${s.start}–${s.end}`).join(", ");
}

// "09:00:00.000Z" → "9:00 AM"
function slotToLabel(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

function isSelectedSlot(slot) {
  return form.value.selectedSlot?.start_time === slot.start_time;
}

async function loadAvailableSlots() {
  availableSlots.value = [];
  slotsError.value = "";
  form.value.selectedSlot = null;

  if (!form.value.psychologistId || !form.value.date) return;

  submitting.value = true;
  try {
    availableSlots.value = await appointmentsStore.getAvailableSlots(
      form.value.psychologistId,
      form.value.date
    );
  } catch (e) {
    slotsError.value =
      e.response?.data?.detail || "Error al cargar los horarios disponibles.";
    console.error(e);
  } finally {
    submitting.value = false;
  }
}

watch(
  () => [form.value.psychologistId, form.value.date],
  () => loadAvailableSlots()
);

function validate() {
  let valid = true;
  errors.value = { psychologistId: "", date: "", selectedSlot: "" };

  if (!form.value.psychologistId) {
    errors.value.psychologistId = "Por favor selecciona un psicólogo.";
    valid = false;
  }
  if (!form.value.date) {
    errors.value.date = "Por favor selecciona una fecha.";
    valid = false;
  } else if (isWeekend(form.value.date)) {
    errors.value.date = "No se pueden agendar citas los fines de semana (sábado o domingo).";
    valid = false;
  }
  if (!form.value.selectedSlot) {
    errors.value.selectedSlot = "Por favor selecciona un horario.";
    valid = false;
  }

  return valid;
}

async function handleSubmit() {
  if (!validate()) return;

  submitting.value = true;
  submitError.value = "";

  try {
    await appointmentsStore.createAppointment({
      student_id: auth.profile.id,
      psychologist_id: form.value.psychologistId,
      date: form.value.date,
      start_time: form.value.selectedSlot.start_time,
      end_time: form.value.selectedSlot.end_time,
      status: "scheduled",
      record_reason: form.value.record_reason || null,
    });

    submitSuccess.value = true;
    setTimeout(() => router.push("/student/appointments"), 2000);
  } catch (err) {
    submitError.value =
      err.response?.data?.detail ||
      "Error al solicitar la cita. Intenta de nuevo.";
  } finally {
    submitting.value = false;
  }
}

async function fetchPsychologists() {
  loading.value = true;
  psychologistsError.value = "";
  try {
    const res = await psychologistsStore.listPsychologists({ skip: 0, limit: 100 });
    psychologists.value = (res.items ?? res).filter((p) => p.is_active);
  } catch (e) {
    psychologistsError.value = "Error al cargar los psicólogos. Intenta de nuevo.";
    console.error(e);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchPsychologists);
</script>
