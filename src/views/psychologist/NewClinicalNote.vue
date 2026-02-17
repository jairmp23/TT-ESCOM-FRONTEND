<template>
  <AppLayout>
    <div class="mb-6">
      <RouterLink
        :to="`/psychologist/records/${recordId}`"
        class="text-blue-600 hover:text-blue-800 mb-2 inline-block"
      >
        ← Volver al Expediente
      </RouterLink>
      <h2 class="text-3xl font-bold">Nueva Nota Clínica</h2>
    </div>

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
            <span>Expediente #{{ patient.recordId }}</span>
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
              <label class="block text-gray-700 font-semibold mb-2"
                >Fecha de la Sesión *</label
              >
              <input
                v-model="form.date"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p v-if="errors.date" class="text-red-600 text-sm mt-1">
                {{ errors.date }}
              </p>
            </div>

            <div>
              <label class="block text-gray-700 font-semibold mb-2"
                >Cita Asociada</label
              >
              <select
                v-model="form.appointmentId"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Ninguna</option>
                <option
                  v-for="appointment in appointments"
                  :key="appointment.id"
                  :value="appointment.id"
                >
                  {{ appointment.label }}
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
          <textarea
            v-model="form.observations"
            rows="10"
            placeholder="Describe el desarrollo de la sesión, observaciones del paciente, técnicas utilizadas, evolución..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="errors.observations ? 'border-red-500' : 'border-gray-300'"
          ></textarea>
          <p v-if="errors.observations" class="text-red-600 text-sm mt-1">
            {{ errors.observations }}
          </p>
        </div>

        <!-- Info del psicólogo -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <div class="text-sm text-gray-600">
            <p>
              <strong>Psicólogo:</strong> {{ auth.user?.nombre }}
              {{ auth.user?.apellido_paterno }}
            </p>
          </div>
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
          ¡Nota clínica guardada exitosamente! Redirigiendo...
        </div>

        <!-- Botones -->
        <div class="flex gap-4 pt-6 border-t">
          <RouterLink
            :to="`/psychologist/records/${recordId}`"
            class="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold"
          >
            Cancelar
          </RouterLink>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
          >
            {{ loading ? "Guardando..." : "Guardar Nota Clínica" }}
          </button>
        </div>
      </form>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const recordId = computed(() => route.params.id);

// Mock data - reemplazar con llamada a API
const patient = ref({
  nombre: "Juan Pérez García",
  boleta: "2024123456",
  recordId: 1,
});

const appointments = ref([
  { id: 1, label: "Cita del 11 Nov 2024 - 10:00 AM" },
  { id: 2, label: "Cita del 8 Nov 2024 - 10:00 AM" },
]);

const today = new Date().toLocaleDateString("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const form = ref({
  date: new Date().toISOString().split("T")[0],
  appointmentId: "",
  observations: "",
});

const errors = ref({});
const loading = ref(false);
const submitError = ref("");
const submitSuccess = ref(false);

function validate() {
  const e = {};
  if (!form.value.date) e.date = "La fecha es requerida.";
  if (!form.value.observations)
    e.observations = "Las observaciones son requeridas.";
  errors.value = e;
  return Object.keys(e).length === 0;
}

async function handleSubmit() {
  if (!validate()) return;
  loading.value = true;
  submitError.value = "";
  try {
    // Mock - reemplazar con llamada real a API
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
</script>
