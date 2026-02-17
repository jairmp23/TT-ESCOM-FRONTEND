<template>
  <AppLayout>
    <div class="mb-6">
      <h2 class="text-3xl font-bold">Mi Perfil</h2>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <!-- Columna izquierda -->
      <div class="col-span-1 space-y-4">
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <div
            class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <span class="text-3xl font-bold text-blue-600">{{ initials }}</span>
          </div>
          <h3 class="text-xl font-semibold">{{ fullName }}</h3>
          <p class="text-gray-500 text-sm mt-1">Psicólogo</p>
          <p class="text-gray-500 text-sm">{{ profile.email }}</p>

          <div class="mt-4 pt-4 border-t text-left space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Cédula</span>
              <span class="font-semibold">{{ profile.cedula }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Estado</span>
              <span
                class="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold"
              >
                Activo
              </span>
            </div>
          </div>
        </div>

        <!-- Horarios actuales -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-3">Horario de Atención</h3>
          <div class="space-y-2">
            <div
              v-for="day in profile.schedule"
              :key="day.key"
              class="flex justify-between text-sm"
            >
              <span class="text-gray-600">{{ day.label }}</span>
              <span v-if="day.active" class="font-semibold text-gray-800">
                {{ day.start }} - {{ day.end }}
              </span>
              <span v-else class="text-gray-400">No disponible</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna derecha -->
      <div class="col-span-2 space-y-6">
        <!-- Información personal -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold">Información Personal</h3>
            <button
              v-if="!editingPersonal"
              @click="startEditPersonal"
              class="text-blue-600 hover:text-blue-800 font-semibold text-sm"
            >
              Editar
            </button>
          </div>

          <form v-if="editingPersonal" @submit.prevent="savePersonal">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-gray-700 font-semibold mb-2"
                  >Nombre(s)</label
                >
                <input
                  v-model="personalForm.nombre"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-gray-700 font-semibold mb-2"
                  >Apellido Paterno</label
                >
                <input
                  v-model="personalForm.apellido_paterno"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-gray-700 font-semibold mb-2"
                  >Apellido Materno</label
                >
                <input
                  v-model="personalForm.apellido_materno"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-gray-700 font-semibold mb-2"
                  >Teléfono</label
                >
                <input
                  v-model="personalForm.telefono"
                  type="tel"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div
              v-if="personalSuccess"
              class="mb-3 p-3 bg-green-100 text-green-700 rounded-lg text-sm"
            >
              Información actualizada correctamente.
            </div>

            <div class="flex gap-3">
              <button
                type="button"
                @click="cancelPersonal"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="savingPersonal"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
              >
                {{ savingPersonal ? "Guardando..." : "Guardar Cambios" }}
              </button>
            </div>
          </form>

          <div v-else class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-gray-500">Nombre(s)</p>
              <p class="font-semibold mt-1">{{ profile.nombre }}</p>
            </div>
            <div>
              <p class="text-gray-500">Apellido Paterno</p>
              <p class="font-semibold mt-1">{{ profile.apellido_paterno }}</p>
            </div>
            <div>
              <p class="text-gray-500">Apellido Materno</p>
              <p class="font-semibold mt-1">{{ profile.apellido_materno }}</p>
            </div>
            <div>
              <p class="text-gray-500">Teléfono</p>
              <p class="font-semibold mt-1">{{ profile.telefono }}</p>
            </div>
            <div>
              <p class="text-gray-500">Email</p>
              <p class="font-semibold mt-1">{{ profile.email }}</p>
            </div>
            <div>
              <p class="text-gray-500">Cédula Profesional</p>
              <p class="font-semibold mt-1">{{ profile.cedula }}</p>
            </div>
          </div>
        </div>

        <!-- Editar horarios -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold">Horarios de Atención</h3>
            <button
              v-if="!editingSchedule"
              @click="startEditSchedule"
              class="text-blue-600 hover:text-blue-800 font-semibold text-sm"
            >
              Editar
            </button>
          </div>

          <form v-if="editingSchedule" @submit.prevent="saveSchedule">
            <div class="space-y-3 mb-4">
              <div
                v-for="day in scheduleForm"
                :key="day.key"
                class="flex items-center gap-4"
              >
                <input type="checkbox" v-model="day.active" class="w-5 h-5" />
                <label class="w-24 font-semibold">{{ day.label }}</label>
                <input
                  type="time"
                  v-model="day.start"
                  :disabled="!day.active"
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                />
                <span class="text-gray-600">a</span>
                <input
                  type="time"
                  v-model="day.end"
                  :disabled="!day.active"
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                />
              </div>
            </div>

            <div
              v-if="scheduleSuccess"
              class="mb-3 p-3 bg-green-100 text-green-700 rounded-lg text-sm"
            >
              Horarios actualizados correctamente.
            </div>

            <div class="flex gap-3">
              <button
                type="button"
                @click="cancelSchedule"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="savingSchedule"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
              >
                {{ savingSchedule ? "Guardando..." : "Guardar Horarios" }}
              </button>
            </div>
          </form>
        </div>

        <!-- Cambiar contraseña -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold">Cambiar Contraseña</h3>
            <button
              v-if="!editingPassword"
              @click="editingPassword = true"
              class="text-blue-600 hover:text-blue-800 font-semibold text-sm"
            >
              Cambiar
            </button>
          </div>

          <form v-if="editingPassword" @submit.prevent="savePassword">
            <div class="space-y-4 mb-4">
              <div>
                <label class="block text-gray-700 font-semibold mb-2"
                  >Contraseña Actual</label
                >
                <input
                  v-model="passwordForm.current"
                  type="password"
                  placeholder="••••••••"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-gray-700 font-semibold mb-2"
                  >Nueva Contraseña</label
                >
                <input
                  v-model="passwordForm.new"
                  type="password"
                  placeholder="••••••••"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-gray-700 font-semibold mb-2"
                  >Confirmar Nueva Contraseña</label
                >
                <input
                  v-model="passwordForm.confirm"
                  type="password"
                  placeholder="••••••••"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div
              v-if="passwordError"
              class="mb-3 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
            >
              {{ passwordError }}
            </div>
            <div
              v-if="passwordSuccess"
              class="mb-3 p-3 bg-green-100 text-green-700 rounded-lg text-sm"
            >
              Contraseña actualizada correctamente.
            </div>

            <div class="flex gap-3">
              <button
                type="button"
                @click="cancelPassword"
                class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="savingPassword"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
              >
                {{ savingPassword ? "Guardando..." : "Actualizar Contraseña" }}
              </button>
            </div>
          </form>

          <div v-else class="text-sm text-gray-500">
            Por seguridad, tu contraseña no se muestra. Haz clic en "Cambiar"
            para actualizarla.
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import AppLayout from "@/layouts/AppLayout.vue";

const profile = ref({
  nombre: "María",
  apellido_paterno: "López",
  apellido_materno: "Hernández",
  email: "maria.lopez@ipn.mx",
  telefono: "55-9876-5432",
  cedula: "7654321",
  schedule: [
    {
      key: "lunes",
      label: "Lunes",
      active: true,
      start: "09:00",
      end: "17:00",
    },
    {
      key: "martes",
      label: "Martes",
      active: true,
      start: "09:00",
      end: "17:00",
    },
    {
      key: "miercoles",
      label: "Miércoles",
      active: true,
      start: "09:00",
      end: "17:00",
    },
    {
      key: "jueves",
      label: "Jueves",
      active: true,
      start: "09:00",
      end: "17:00",
    },
    {
      key: "viernes",
      label: "Viernes",
      active: false,
      start: "09:00",
      end: "17:00",
    },
  ],
});

const fullName = computed(
  () =>
    `${profile.value.nombre} ${profile.value.apellido_paterno} ${profile.value.apellido_materno}`,
);
const initials = computed(
  () => `${profile.value.nombre[0]}${profile.value.apellido_paterno[0]}`,
);

// --- Personal ---
const editingPersonal = ref(false);
const savingPersonal = ref(false);
const personalSuccess = ref(false);
const personalForm = ref({});

function startEditPersonal() {
  personalForm.value = { ...profile.value };
  editingPersonal.value = true;
}
function cancelPersonal() {
  editingPersonal.value = false;
  personalSuccess.value = false;
}
async function savePersonal() {
  savingPersonal.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 800));
    Object.assign(profile.value, personalForm.value);
    personalSuccess.value = true;
    setTimeout(() => {
      editingPersonal.value = false;
      personalSuccess.value = false;
    }, 2000);
  } finally {
    savingPersonal.value = false;
  }
}

// --- Horarios ---
const editingSchedule = ref(false);
const savingSchedule = ref(false);
const scheduleSuccess = ref(false);
const scheduleForm = ref([]);

function startEditSchedule() {
  scheduleForm.value = profile.value.schedule.map((d) => ({ ...d }));
  editingSchedule.value = true;
}
function cancelSchedule() {
  editingSchedule.value = false;
  scheduleSuccess.value = false;
}
async function saveSchedule() {
  savingSchedule.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 800));
    profile.value.schedule = scheduleForm.value.map((d) => ({ ...d }));
    scheduleSuccess.value = true;
    setTimeout(() => {
      editingSchedule.value = false;
      scheduleSuccess.value = false;
    }, 2000);
  } finally {
    savingSchedule.value = false;
  }
}

// --- Contraseña ---
const editingPassword = ref(false);
const savingPassword = ref(false);
const passwordError = ref("");
const passwordSuccess = ref(false);
const passwordForm = ref({ current: "", new: "", confirm: "" });

function cancelPassword() {
  passwordForm.value = { current: "", new: "", confirm: "" };
  editingPassword.value = false;
  passwordError.value = "";
  passwordSuccess.value = false;
}
async function savePassword() {
  passwordError.value = "";
  if (passwordForm.value.new.length < 8) {
    passwordError.value = "La contraseña debe tener al menos 8 caracteres.";
    return;
  }
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    passwordError.value = "Las contraseñas no coinciden.";
    return;
  }
  savingPassword.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 800));
    passwordSuccess.value = true;
    passwordForm.value = { current: "", new: "", confirm: "" };
    setTimeout(() => {
      editingPassword.value = false;
      passwordSuccess.value = false;
    }, 2000);
  } finally {
    savingPassword.value = false;
  }
}
</script>
