<template>
  <AppLayout>
    <LoadingSpinner v-if="pageLoading" message="Cargando expediente..." />

    <div v-else>
      <div class="mb-6">
        <RouterLink :to="`/psychologist/records/${recordId}`"
          class="text-blue-600 hover:text-blue-800 mb-2 inline-block">
          ← Volver al Expediente
        </RouterLink>
        <h2 class="text-3xl font-bold">{{ isEditMode ? "Editar Nota Clínica" : "Nueva Nota Clínica" }}</h2>
      </div>

      <!-- Error de carga -->
      <div v-if="pageError" class="bg-red-100 text-red-700 rounded-lg p-4 mb-6">
        {{ pageError }}
      </div>

      <template v-if="patient">
        <!-- Info del paciente (solo lectura) -->
        <div class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-semibold text-blue-900 mb-1">
                {{ patient.nombre }}
              </h3>
              <div class="text-sm text-blue-800">
                <span>Boleta: {{ patient.boleta }}</span>
                <span class="mx-2">•</span>
              </div>
            </div>
            <div class="text-right text-sm text-blue-800">
              <div>Fecha: {{ today }}</div>
            </div>
          </div>
        </div>

        <!-- Formulario -->
        <div class="bg-white rounded-lg shadow p-6">
          <form @submit.prevent="handleSubmit">
            <!-- Información de la sesión -->
            <div class="mb-6">
              <h3 class="text-xl font-semibold mb-4 pb-2 border-b">
                Información de la Sesión
              </h3>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 font-semibold mb-2">Fecha de la Sesión *</label>
                  <input v-model="form.date" type="date"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="errors.date ? 'border-red-500' : 'border-gray-300'" />
                  <p v-if="errors.date" class="text-red-600 text-sm mt-1">
                    {{ errors.date }}
                  </p>
                </div>

                <div>
                  <label class="block text-gray-700 font-semibold mb-2">Cita Asociada</label>
                  <select v-model="form.appointmentId"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Ninguna</option>
                    <option v-for="appt in appointments" :key="appt.id" :value="appt.id">
                      {{ appt.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Observaciones -->
            <div class="mb-6">
              <label class="block text-gray-700 font-semibold mb-2">
                Observaciones y Evolución de la Sesión *
              </label>
              <textarea v-model="form.observations" rows="10"
                placeholder="Describe el desarrollo de la sesión, observaciones del paciente, técnicas utilizadas, evolución..."
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errors.observations ? 'border-red-500' : 'border-gray-300'"></textarea>
              <p v-if="errors.observations" class="text-red-600 text-sm mt-1">
                {{ errors.observations }}
              </p>
            </div>

            <!-- Info del psicólogo -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
              <div class="text-sm text-gray-600">
                <p>
                  <strong>Psicólogo:</strong>
                  {{ psychologistName }}
                </p>
              </div>
            </div>

            <!-- Error general -->
            <div v-if="submitError" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {{ submitError }}
            </div>

            <!-- Success -->
            <div v-if="submitSuccess" class="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
              {{ isEditMode ? "¡Nota actualizada exitosamente! Redirigiendo..." : "¡Nota clínica guardada exitosamente! Redirigiendo..." }}
            </div>

            <!-- Botones -->
            <div class="flex gap-4 pt-6 border-t">
              <RouterLink :to="`/psychologist/records/${recordId}`"
                class="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">
                Cancelar
              </RouterLink>
              <button type="submit" :disabled="loading"
                class="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50">
                {{ loading ? "Guardando..." : isEditMode ? "Actualizar Nota" : "Guardar Nota Clínica" }}
              </button>
            </div>
          </form>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import { useAuthStore } from "@/stores/auth";
import { useRecordsStore } from "@/stores/records";
import { useNotesStore } from "@/stores/notes";
import { useAppointmentsStore } from "@/stores/appointments";
import { localDateStr } from "@/utils/dates";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const recordsStore = useRecordsStore();
const notesStore = useNotesStore();
const appointmentsStore = useAppointmentsStore();

const recordId = computed(() => route.params.id);
const noteId = computed(() => route.params.noteId ?? null);
const isEditMode = computed(() => !!noteId.value);

const today = new Date().toLocaleDateString("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const patient = ref(null);
const appointments = ref([]);
const pageLoading = ref(false);
const pageError = ref("");

const form = ref({
  date: localDateStr(),
  appointmentId: "",
  observations: "",
});

const errors = ref({});
const loading = ref(false);
const submitError = ref("");
const submitSuccess = ref(false);

const psychologistName = computed(() => {
  const u = auth.profile?.user;
  if (!u) return "—";
  return [u.first_name, u.middle_name, u.last_name].filter(Boolean).join(" ");
});

function fullName(user) {
  return [user.first_name, user.middle_name, user.last_name]
    .filter(Boolean)
    .join(" ");
}

function formatAppointmentLabel(appt) {
  if (!appt.date && !appt.scheduled_date) return `Cita #${appt.id}`;
  const dateStr = appt.date ?? appt.scheduled_date;
  const d = new Date(dateStr + "T00:00:00").toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = appt.start_time
    ? ` - ${formatTime(appt.start_time)}`
    : "";
  return `Cita del ${d}${timeStr}`;
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

function validate() {
  const e = {};
  if (!form.value.date) e.date = "La fecha es requerida.";
  if (!form.value.observations.trim())
    e.observations = "Las observaciones son requeridas.";
  errors.value = e;
  return Object.keys(e).length === 0;
}

async function handleSubmit() {
  if (!validate()) return;
  loading.value = true;
  submitError.value = "";
  try {
    if (isEditMode.value) {
      const payload = {
        session_date: form.value.date,
        observations: form.value.observations,
        appointment_id: form.value.appointmentId || null,
      };
      await notesStore.updateNote(noteId.value, payload);
    } else {
      const payload = {
        clinical_record_id: recordId.value,
        psychologist_id: auth.profile?.id,
        session_date: form.value.date,
        observations: form.value.observations,
      };
      if (form.value.appointmentId) {
        payload.appointment_id = form.value.appointmentId;
      }
      await notesStore.registerNote(payload);
    }
    submitSuccess.value = true;
    setTimeout(
      () => router.push(`/psychologist/records/${recordId.value}`),
      2000,
    );
  } catch (err) {
    submitError.value =
      err.response?.data?.detail ||
      "Error al guardar la nota. Intenta de nuevo.";
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  pageLoading.value = true;
  pageError.value = "";
  try {
    const requests = [
      recordsStore.getRecord(recordId.value),
      appointmentsStore.listAppointments({ record_id: recordId.value }),
    ];
    if (isEditMode.value) {
      requests.push(notesStore.getNote(noteId.value));
    }

    const [recordData, appointmentsData, noteData] = await Promise.allSettled(requests);

    if (recordData.status === "fulfilled") {
      const user = recordData.value.student_info?.user ?? {};
      const info = recordData.value.student_info ?? {};
      patient.value = {
        nombre: fullName(user),
        boleta: info.student_id ?? "—",
      };
    } else {
      pageError.value =
        recordData.reason?.response?.data?.detail ??
        "Error al cargar el expediente.";
    }

    if (appointmentsData.status === "fulfilled") {
      const items = appointmentsData.value?.items ?? appointmentsData.value ?? [];
      appointments.value = items
        .filter((a) => a.status !== "cancelled")
        .map((a) => ({ id: a.id, label: formatAppointmentLabel(a) }));
    }

    if (isEditMode.value && noteData) {
      if (noteData.status === "fulfilled") {
        const n = noteData.value;
        form.value.date = n.session_date ?? n.date ?? localDateStr();
        form.value.observations = n.observations ?? n.content ?? "";
        form.value.appointmentId = n.appointment_id ?? "";
      } else {
        pageError.value =
          noteData.reason?.response?.data?.detail ??
          "Error al cargar la nota clínica.";
      }
    }
  } finally {
    pageLoading.value = false;
  }
});
</script>
