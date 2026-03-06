<template>
  <AppLayout>
    <LoadingSpinner v-if="loading" message="Cargando expediente..." />

    <div v-else>
      <div class="mb-6">
        <div class="flex flex-wrap justify-between items-center gap-3">
          <h2 class="text-3xl font-bold">Expediente</h2>
          <div v-if="record" class="flex flex-wrap gap-2">
            <RouterLink v-if="record.activo" :to="`/psychologist/records/${record.id}/note`"
              class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-semibold text-sm">
              + Nueva Nota
            </RouterLink>
            <button v-if="record.activo" :disabled="savingEdit" @click="startEdit"
              class="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 font-semibold text-sm disabled:opacity-50">
              Editar Expediente
            </button>
            <button v-if="record.activo" :disabled="closingRecord" @click="handleClose"
              class="bg-red-100 text-red-700 px-5 py-2 rounded-lg hover:bg-red-200 font-semibold text-sm disabled:opacity-50">
              {{ closingRecord ? "Cerrando..." : "Cerrar Expediente" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Error general -->
      <div v-if="error" class="bg-red-100 text-red-700 rounded-lg p-4 mb-6">
        {{ error }}
      </div>

      <!-- Error de acciones -->
      <div v-if="actionError" class="bg-red-100 text-red-700 rounded-lg p-4 mb-6">
        {{ actionError }}
      </div>

      <template v-if="record">
        <!-- Info del paciente -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <div class="flex flex-wrap justify-between items-start gap-4">
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
              <span class="px-4 py-2 rounded-full font-semibold"
                :class="record.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'">
                {{ record.activo ? "Expediente Activo" : "Expediente Cerrado" }}
              </span>
              <p class="text-sm text-gray-600 mt-3">
                <strong>Fecha Apertura:</strong> {{ record.openedAt }}
              </p>
              <p v-if="!record.activo && record.closedAt !== '—'" class="text-sm text-gray-600 mt-1">
                <strong>Fecha Cierre:</strong> {{ record.closedAt }}
              </p>
            </div>
          </div>
        </div>

        <!-- Observaciones generales -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold">Información General</h3>
          </div>

          <!-- Modo lectura -->
          <div v-if="!editMode">
            <strong class="text-gray-900">Observaciones Generales:</strong>
            <p class="text-gray-700 mt-1 whitespace-pre-line">
              {{ record.observations || "Sin observaciones registradas." }}
            </p>
          </div>

          <!-- Modo edición -->
          <div v-else>
            <label class="block text-gray-700 font-semibold mb-2">Observaciones Generales</label>
            <textarea v-model="editObservations" rows="6"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Observaciones generales del expediente..." />
            <div v-if="editError" class="mt-2 text-sm text-red-600">{{ editError }}</div>
            <div class="flex gap-3 mt-4">
              <button :disabled="savingEdit" @click="saveEdit"
                class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50">
                {{ savingEdit ? "Guardando..." : "Guardar" }}
              </button>
              <button :disabled="savingEdit" @click="cancelEdit"
                class="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 font-semibold disabled:opacity-50">
                Cancelar
              </button>
            </div>
          </div>
        </div>

        <!-- Historial de notas -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-xl font-semibold mb-4">Historial de Notas</h3>

          <div v-if="notes.length === 0" class="text-center py-8 text-gray-500">
            No hay notas clínicas registradas.
          </div>

          <div v-else class="space-y-4">
            <div v-for="note in notes" :key="note.id" class="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <p class="font-semibold text-lg">
                    {{ note.date }}<span v-if="note.time"> • {{ note.time }}</span>
                  </p>
                  <p class="text-sm text-gray-600">{{ note.psychologist }}</p>
                </div>
                <RouterLink :to="`/psychologist/records/${record.id}/note/${note.id}`"
                  class="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                  Ver / Editar
                </RouterLink>
              </div>
              <p class="text-gray-700 mt-3 whitespace-pre-line">{{ note.content }}</p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import { useRecordsStore } from "@/stores/records";
import { useNotesStore } from "@/stores/notes";
import { localDateStr } from "@/utils/dates";

const route = useRoute();
const recordsStore = useRecordsStore();
const notesStore = useNotesStore();

const recordId = computed(() => route.params.id);

const record = ref(null);
const notes = ref([]);
const loading = ref(false);
const error = ref("");

// ── Editar observaciones ──────────────────────────────────────────────────────
const editMode = ref(false);
const editObservations = ref("");
const savingEdit = ref(false);
const editError = ref("");

function startEdit() {
  editObservations.value = record.value.observations;
  editError.value = "";
  editMode.value = true;
}

function cancelEdit() {
  editMode.value = false;
  editError.value = "";
}

async function saveEdit() {
  savingEdit.value = true;
  editError.value = "";
  try {
    await recordsStore.updateRecord(recordId.value, {
      general_observations: editObservations.value,
    });
    record.value.observations = editObservations.value;
    editMode.value = false;
  } catch (err) {
    editError.value =
      err.response?.data?.detail ?? "Error al guardar los cambios.";
  } finally {
    savingEdit.value = false;
  }
}

// ── Cerrar expediente ─────────────────────────────────────────────────────────
const closingRecord = ref(false);
const actionError = ref("");

async function handleClose() {
  if (!confirm("¿Estás seguro de cerrar este expediente? Esta acción marcará el expediente como inactivo.")) return;
  closingRecord.value = true;
  actionError.value = "";
  try {
    const today = localDateStr();
    await recordsStore.updateRecord(recordId.value, {
      is_active: false,
      closing_date: today,
    });
    record.value.activo = false;
    record.value.closedAt = formatDate(today);
  } catch (err) {
    actionError.value =
      err.response?.data?.detail ?? "Error al cerrar el expediente.";
  } finally {
    closingRecord.value = false;
  }
}

function fullName(user) {
  return [user.first_name, user.middle_name, user.last_name]
    .filter(Boolean)
    .join(" ");
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(isoStr) {
  if (!isoStr) return "—";
  const d = new Date(isoStr);
  return d.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(isoStr) {
  if (!isoStr) return "";
  return new Date(isoStr).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

onMounted(async () => {
  loading.value = true;
  error.value = "";
  try {
    const [recordData, notesData] = await Promise.all([
      recordsStore.getRecord(recordId.value),
      notesStore.listNotes({ record_id: recordId.value }),
    ]);

    const user = recordData.student_info?.user ?? {};
    const info = recordData.student_info ?? {};

    record.value = {
      id: recordData.id,
      student: fullName(user),
      boleta: info.student_id ?? "—",
      email: user.email ?? "—",
      telefono: user.phone ?? "—",
      carrera: info.career ?? "—",
      semestre: info.semester ? `${info.semester}°` : "—",
      openedAt: formatDate(recordData.opening_date),
      closedAt: formatDate(recordData.closing_date),
      activo: recordData.is_active,
      observations: recordData.general_observations ?? "",
    };

    notes.value = (notesData ?? []).map((n) => ({
      id: n.id,
      date: formatDateTime(n.created_at ?? n.date),
      time: formatTime(n.created_at ?? n.date),
      psychologist: n.psychologist_name ?? "—",
      content: n.content ?? n.observations ?? "",
    }));
  } catch (err) {
    error.value =
      err.response?.data?.detail ?? "Error al cargar el expediente.";
  } finally {
    loading.value = false;
  }
});
</script>
