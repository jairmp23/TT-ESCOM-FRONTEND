<template>
  <AppLayout>
    <div class="mb-6">
      <h2 class="text-3xl font-bold">Nuevo Expediente Clínico</h2>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <form @submit.prevent="handleSubmit">

        <!-- Búsqueda de paciente -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold mb-4 pb-2 border-b">Datos del Paciente</h3>

          <div class="relative">
            <label class="block text-gray-700 font-semibold mb-2">Buscar Estudiante *</label>
            <input v-model="searchQuery" type="text" placeholder="Buscar por nombre o boleta..." autocomplete="off"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="errors.student_id ? 'border-red-500' : 'border-gray-300'" @input="onSearchInput"
              @focus="showDropdown = searchResults.length > 0" @blur="hideDropdownDelayed" />
            <p v-if="errors.student_id" class="text-red-600 text-sm mt-1">
              {{ errors.student_id }}
            </p>

            <!-- Spinner de búsqueda -->
            <div v-if="searching" class="absolute right-3 top-[2.6rem] text-gray-400 text-sm">
              Buscando...
            </div>

            <!-- Dropdown de resultados -->
            <ul v-if="showDropdown && searchResults.length > 0"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <li v-for="student in searchResults" :key="student.id"
                class="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                @mousedown.prevent="selectStudent(student)">
                <div class="font-semibold text-gray-800">{{ getStudentFullName(student) }}</div>
                <div class="text-sm text-gray-500">
                  Boleta: {{ student.student_id }} &nbsp;·&nbsp; {{ student.career }}
                </div>
              </li>
            </ul>

            <div v-if="showDropdown && searchQuery.length >= 2 && !searching && searchResults.length === 0"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm text-gray-500">
              No se encontraron estudiantes.
            </div>
          </div>

          <!-- Tarjeta del estudiante seleccionado -->
          <div v-if="selectedStudent" class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-semibold text-blue-900 text-lg">{{ getStudentFullName(selectedStudent) }}</p>
                <div class="mt-1 text-sm text-blue-800 space-y-0.5">
                  <p><strong>Boleta:</strong> {{ selectedStudent.student_id }}</p>
                  <p><strong>Email:</strong> {{ selectedStudent.user?.email ?? '—' }}</p>
                  <p><strong>Carrera:</strong> {{ selectedStudent.career ?? '—' }}</p>
                  <p><strong>Semestre:</strong> {{ selectedStudent.semester ? `${selectedStudent.semester}°` : '—' }}
                  </p>
                </div>
              </div>
              <button type="button" class="text-blue-400 hover:text-blue-700 text-xl font-bold leading-none"
                title="Quitar selección" @click="clearStudent">
                ×
              </button>
            </div>
          </div>
        </div>

        <!-- Información del expediente -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold mb-4 pb-2 border-b">Información del Expediente</h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Fecha de Apertura *</label>
              <input v-model="form.opening_date" type="date"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errors.opening_date ? 'border-red-500' : 'border-gray-300'" />
              <p v-if="errors.opening_date" class="text-red-600 text-sm mt-1">
                {{ errors.opening_date }}
              </p>
            </div>
          </div>

          <div>
            <label class="block text-gray-700 font-semibold mb-2">Observaciones Generales</label>
            <textarea v-model="form.general_observations" rows="5"
              placeholder="Descripción inicial del caso, motivo de consulta, antecedentes relevantes..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
        </div>

        <!-- Error general -->
        <div v-if="submitError" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {{ submitError }}
        </div>

        <!-- Éxito -->
        <div v-if="submitSuccess" class="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
          ¡Expediente creado exitosamente! Redirigiendo...
        </div>

        <!-- Botones -->
        <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <RouterLink to="/psychologist/records"
            class="sm:w-auto px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold text-center">
            Cancelar
          </RouterLink>
          <button type="submit" :disabled="loading"
            class="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 transition-colors">
            {{ loading ? "Creando..." : "Crear Expediente" }}
          </button>
        </div>

      </form>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";
import { useRecordsStore } from "@/stores/records";
import { useStudentsStore } from "@/stores/students";
import { useAuthStore } from "@/stores/auth";
import { localDateStr } from "@/utils/dates";

const router = useRouter();
const recordsStore = useRecordsStore();
const studentsStore = useStudentsStore();
const auth = useAuthStore();

// ── Búsqueda de estudiante ────────────────────────────────────────────────────

const searchQuery = ref("");
const searchResults = ref([]);
const selectedStudent = ref(null);
const searching = ref(false);
const showDropdown = ref(false);

let searchTimeout = null;

function getStudentFullName(student) {
  const u = student.user ?? {};
  return [u.first_name, u.middle_name, u.last_name].filter(Boolean).join(" ");
}

function onSearchInput() {
  selectedStudent.value = null;
  clearTimeout(searchTimeout);
  if (searchQuery.value.length < 2) {
    searchResults.value = [];
    showDropdown.value = false;
    return;
  }
  searching.value = true;
  searchTimeout = setTimeout(async () => {
    try {
      const data = await studentsStore.listStudents({ search: searchQuery.value });
      searchResults.value = (data?.items ?? data ?? []).slice(0, 10);
      showDropdown.value = true;
    } catch {
      searchResults.value = [];
    } finally {
      searching.value = false;
    }
  }, 350);
}

function selectStudent(student) {
  selectedStudent.value = student;
  searchQuery.value = getStudentFullName(student);
  showDropdown.value = false;
}

function clearStudent() {
  selectedStudent.value = null;
  searchQuery.value = "";
  searchResults.value = [];
}

function hideDropdownDelayed() {
  setTimeout(() => { showDropdown.value = false; }, 150);
}

// ── Formulario ────────────────────────────────────────────────────────────────

const form = ref({
  opening_date: localDateStr(),
  general_observations: "",
});

const errors = ref({});
const loading = ref(false);
const submitError = ref("");
const submitSuccess = ref(false);

function validate() {
  const e = {};
  if (!selectedStudent.value) e.student_id = "Debes seleccionar un estudiante.";
  if (!form.value.opening_date) e.opening_date = "La fecha de apertura es requerida.";
  errors.value = e;
  return Object.keys(e).length === 0;
}

async function handleSubmit() {
  if (!validate()) return;
  loading.value = true;
  submitError.value = "";
  try {
    const payload = {
      student_id: selectedStudent.value.id,
      psychologist_id: auth.profile.id,
      opening_date: form.value.opening_date,
      general_observations: form.value.general_observations || "",
    };
    const created = await recordsStore.registerRecord(payload);
    submitSuccess.value = true;
    setTimeout(() => {
      router.push(`/psychologist/records/${created.id}`);
    }, 1500);
  } catch (err) {
    submitError.value =
      err.response?.data?.detail ?? "Error al crear el expediente. Intenta de nuevo.";
  } finally {
    loading.value = false;
  }
}
</script>
