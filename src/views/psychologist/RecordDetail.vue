<template>
  <AppLayout>
    <div class="mb-6">
      <RouterLink
        to="/psychologist/records"
        class="text-blue-600 hover:text-blue-800 mb-2 inline-block"
      >
        ← Volver a Expedientes
      </RouterLink>
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-bold">Expediente Clínico</h2>
        <div class="flex gap-3">
          <RouterLink
            :to="`/psychologist/records/${record.id}/note`"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
          >
            + Nueva Nota
          </RouterLink>
          <button
            class="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 font-semibold"
          >
            Editar Expediente
          </button>
        </div>
      </div>
    </div>

    <!-- Info del paciente -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-2xl font-semibold mb-2">{{ record.student }}</h3>
          <div class="text-gray-600 space-y-1">
            <p><strong>Boleta:</strong> {{ record.boleta }}</p>
            <p><strong>Email:</strong> {{ record.email }}</p>
            <p><strong>Teléfono:</strong> {{ record.telefono }}</p>
            <p><strong>Carrera:</strong> {{ record.carrera }}</p>
            <p><strong>Semestre:</strong> {{ record.semestre }}</p>
          </div>
        </div>
        <div class="text-right">
          <span
            class="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold"
          >
            Expediente Activo
          </span>
          <p class="text-sm text-gray-600 mt-3">
            <strong>Fecha Apertura:</strong> {{ record.openedAt }}
          </p>
        </div>
      </div>
    </div>

    <!-- Observaciones generales -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h3 class="text-xl font-semibold mb-4">Información General</h3>
      <div>
        <strong class="text-gray-900">Observaciones Generales:</strong>
        <p class="text-gray-700 mt-1">{{ record.observations }}</p>
      </div>
    </div>

    <!-- Historial de notas -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-xl font-semibold mb-4">Historial de Notas Clínicas</h3>

      <div v-if="notes.length === 0" class="text-center py-8 text-gray-500">
        No hay notas clínicas registradas.
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="note in notes"
          :key="note.id"
          class="border-l-4 border-blue-500 bg-blue-50 p-4 rounded"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="font-semibold text-lg">
                {{ note.date }} • {{ note.time }}
              </p>
              <p class="text-sm text-gray-600">{{ note.psychologist }}</p>
            </div>
            <RouterLink
              :to="`/psychologist/records/${record.id}/note`"
              class="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Ver / Editar
            </RouterLink>
          </div>
          <p class="text-gray-700 mt-3">{{ note.content }}</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref } from "vue";
import AppLayout from "@/layouts/AppLayout.vue";

// Mock - reemplazar con llamada a API usando useRoute().params.id
const record = ref({
  id: 1,
  student: "Juan Pérez García",
  boleta: "2024123456",
  email: "juan.perez@alumno.ipn.mx",
  telefono: "55-1234-5678",
  carrera: "Ingeniería en Sistemas Computacionales",
  semestre: "5to",
  openedAt: "15 Oct 2024",
  observations:
    "Paciente muestra disposición al tratamiento. Presenta dificultades para manejar estrés académico. Se recomienda continuar con sesiones semanales.",
});

const notes = ref([
  {
    id: 1,
    date: "8 de Noviembre, 2024",
    time: "10:00 AM",
    psychologist: "Dra. María López Hernández",
    content:
      "El paciente muestra mejora significativa en manejo de ansiedad. Reporta haber aplicado técnicas de respiración durante examen con buenos resultados. Se trabajó en restructuración cognitiva...",
  },
  {
    id: 2,
    date: "1 de Noviembre, 2024",
    time: "10:00 AM",
    psychologist: "Dra. María López Hernández",
    content:
      "Se trabajó en identificación de pensamientos automáticos negativos. El paciente reporta mejor sueño desde la sesión anterior. Se asignaron tareas de registro de pensamientos...",
  },
  {
    id: 3,
    date: "25 de Octubre, 2024",
    time: "10:00 AM",
    psychologist: "Dra. María López Hernández",
    content:
      "Continuación de psicoeducación sobre ansiedad. Se enseñaron técnicas de relajación progresiva. El paciente reporta dificultades para dormir previo a exámenes...",
  },
]);
</script>
