<template>
  <AppLayout>
    <h2 class="text-3xl font-bold mb-6">Agendar Nueva Cita</h2>

    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <form @submit.prevent="handleSubmit">
        <!-- Seleccionar Psicólogo -->
        <div class="mb-6">
          <label class="block text-gray-700 font-semibold mb-3"
            >Seleccionar Psicólogo</label
          >
          <div class="space-y-3">
            <div
              v-for="psychologist in psychologists"
              :key="psychologist.id"
              @click="form.psychologistId = psychologist.id"
              class="border rounded-lg p-4 cursor-pointer transition-colors"
              :class="
                form.psychologistId === psychologist.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400'
              "
            >
              <div class="flex items-start gap-3">
                <input
                  type="radio"
                  :value="psychologist.id"
                  v-model="form.psychologistId"
                  class="mt-1"
                />
                <div class="flex-1">
                  <h4 class="font-semibold text-lg">
                    {{ psychologist.nombre }}
                  </h4>
                  <p class="text-sm text-gray-500 mt-1">
                    Cédula: {{ psychologist.cedula }}
                  </p>
                  <p class="text-sm text-blue-600 mt-1">
                    Horarios: {{ psychologist.horario }}
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
          <input
            v-model="form.date"
            type="date"
            :min="minDate"
            @change="onDateChange"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="errors.date" class="text-red-600 text-sm mt-1">
            {{ errors.date }}
          </p>
        </div>

        <!-- Seleccionar Hora -->
        <div class="mb-6">
          <label class="block text-gray-700 font-semibold mb-3"
            >Horarios Disponibles</label
          >

          <div
            v-if="!form.date || !form.psychologistId"
            class="text-gray-500 text-sm"
          >
            Selecciona un psicólogo y una fecha para ver los horarios
            disponibles.
          </div>

          <div
            v-else-if="availableSlots.length === 0"
            class="text-gray-500 text-sm"
          >
            No hay horarios disponibles para esta fecha.
          </div>

          <div v-else class="grid grid-cols-4 gap-3">
            <button
              v-for="slot in availableSlots"
              :key="slot"
              type="button"
              @click="form.time = slot"
              class="px-4 py-2 border rounded-lg transition-colors"
              :class="
                form.time === slot
                  ? 'bg-blue-100 border-blue-500 text-blue-700 font-semibold'
                  : 'border-gray-300 hover:bg-blue-50 hover:border-blue-400'
              "
            >
              {{ slot }}
            </button>
          </div>
          <p v-if="errors.time" class="text-red-600 text-sm mt-1">
            {{ errors.time }}
          </p>
        </div>

        <!-- Motivo (opcional) -->
        <div class="mb-6">
          <label class="block text-gray-700 font-semibold mb-2">
            Motivo de la Consulta
            <span class="text-gray-400 font-normal">(Opcional)</span>
          </label>
          <textarea
            v-model="form.notes"
            rows="3"
            placeholder="Describe brevemente el motivo de tu consulta..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Error general -->
        <div
          v-if="submitError"
          class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
        >
          {{ submitError }}
        </div>

        <!-- Success -->
        <div
          v-if="submitSuccess"
          class="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm"
        >
          ¡Cita solicitada exitosamente! Redirigiendo a Mis Citas...
        </div>

        <!-- Botones -->
        <div class="flex gap-4">
          <RouterLink
            to="/student/appointments"
            class="flex-1 text-center bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 font-semibold"
          >
            Cancelar
          </RouterLink>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
          >
            {{ loading ? "Enviando..." : "Solicitar Cita" }}
          </button>
        </div>
      </form>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";

const router = useRouter();

// Mock data - reemplazar con llamada a API
const psychologists = ref([
  {
    id: 1,
    nombre: "María López Hernández",
    cedula: "7654321",
    horario: "Lunes a Viernes 9:00 AM - 5:00 PM",
  },
  {
    id: 2,
    nombre: "Carlos Ramírez Soto",
    cedula: "8765432",
    horario: "Lunes a Jueves 1:00 PM - 7:00 PM",
  },
]);

// Todos los slots posibles
const allSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

// Mock de slots ocupados - reemplazar con llamada a API
const bookedSlots = ref({
  "2024-11-15": ["9:00 AM", "2:00 PM"],
  "2024-11-18": ["10:00 AM"],
});

const form = ref({
  psychologistId: null,
  date: "",
  time: "",
  notes: "",
});

const errors = ref({
  psychologistId: "",
  date: "",
  time: "",
});

const loading = ref(false);
const submitError = ref("");
const submitSuccess = ref(false);

// Fecha mínima = hoy
const minDate = computed(() => {
  return new Date().toISOString().split("T")[0];
});

// Slots disponibles según fecha seleccionada
const availableSlots = computed(() => {
  if (!form.value.date) return allSlots;
  const booked = bookedSlots.value[form.value.date] || [];
  return allSlots.filter((slot) => !booked.includes(slot));
});

function onDateChange() {
  // Resetear hora si cambia la fecha
  form.value.time = "";
}

function validate() {
  let valid = true;
  errors.value = { psychologistId: "", date: "", time: "" };

  if (!form.value.psychologistId) {
    errors.value.psychologistId = "Por favor selecciona un psicólogo.";
    valid = false;
  }
  if (!form.value.date) {
    errors.value.date = "Por favor selecciona una fecha.";
    valid = false;
  }
  if (!form.value.time) {
    errors.value.time = "Por favor selecciona un horario.";
    valid = false;
  }

  return valid;
}

async function handleSubmit() {
  if (!validate()) return;

  loading.value = true;
  submitError.value = "";

  try {
    // Mock - reemplazar con llamada real a API
    // await createAppointment({ ...form.value })
    await new Promise((resolve) => setTimeout(resolve, 1000)); // simula delay

    submitSuccess.value = true;
    setTimeout(() => router.push("/student/appointments"), 2000);
  } catch (err) {
    submitError.value =
      err.response?.data?.detail ||
      "Error al solicitar la cita. Intenta de nuevo.";
  } finally {
    loading.value = false;
  }
}
</script>
