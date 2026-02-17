<template>
  <AppLayout>
    <div class="mb-6">
      <RouterLink
        to="/admin/users"
        class="text-blue-600 hover:text-blue-800 mb-2 inline-block"
      >
        ← Volver a Gestión de Usuarios
      </RouterLink>
      <h2 class="text-3xl font-bold">Crear Nuevo Psicólogo</h2>
    </div>

    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <form @submit.prevent="handleSubmit">
        <!-- Información Personal -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold mb-4 pb-2 border-b">
            Información Personal
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-semibold mb-2"
                >Nombre(s) *</label
              >
              <input
                v-model="form.nombre"
                type="text"
                placeholder="María"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errors.nombre ? 'border-red-500' : 'border-gray-300'"
              />
              <p v-if="errors.nombre" class="text-red-600 text-sm mt-1">
                {{ errors.nombre }}
              </p>
            </div>

            <div>
              <label class="block text-gray-700 font-semibold mb-2"
                >Apellido Paterno *</label
              >
              <input
                v-model="form.apellido_paterno"
                type="text"
                placeholder="López"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="
                  errors.apellido_paterno ? 'border-red-500' : 'border-gray-300'
                "
              />
              <p
                v-if="errors.apellido_paterno"
                class="text-red-600 text-sm mt-1"
              >
                {{ errors.apellido_paterno }}
              </p>
            </div>

            <div>
              <label class="block text-gray-700 font-semibold mb-2"
                >Apellido Materno *</label
              >
              <input
                v-model="form.apellido_materno"
                type="text"
                placeholder="Hernández"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="
                  errors.apellido_materno ? 'border-red-500' : 'border-gray-300'
                "
              />
              <p
                v-if="errors.apellido_materno"
                class="text-red-600 text-sm mt-1"
              >
                {{ errors.apellido_materno }}
              </p>
            </div>

            <div>
              <label class="block text-gray-700 font-semibold mb-2"
                >Sexo *</label
              >
              <select
                v-model="form.sexo"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errors.sexo ? 'border-red-500' : 'border-gray-300'"
              >
                <option value="">Seleccionar...</option>
                <option value="F">Femenino</option>
                <option value="M">Masculino</option>
                <option value="O">Otro</option>
              </select>
              <p v-if="errors.sexo" class="text-red-600 text-sm mt-1">
                {{ errors.sexo }}
              </p>
            </div>

            <div>
              <label class="block text-gray-700 font-semibold mb-2"
                >Email Institucional *</label
              >
              <input
                v-model="form.email"
                type="email"
                placeholder="maria.lopez@ipn.mx"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errors.email ? 'border-red-500' : 'border-gray-300'"
              />
              <p v-if="errors.email" class="text-red-600 text-sm mt-1">
                {{ errors.email }}
              </p>
            </div>

            <div>
              <label class="block text-gray-700 font-semibold mb-2"
                >Teléfono *</label
              >
              <input
                v-model="form.telefono"
                type="tel"
                placeholder="55-1234-5678"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errors.telefono ? 'border-red-500' : 'border-gray-300'"
              />
              <p v-if="errors.telefono" class="text-red-600 text-sm mt-1">
                {{ errors.telefono }}
              </p>
            </div>
          </div>
        </div>

        <!-- Información Profesional -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold mb-4 pb-2 border-b">
            Información Profesional
          </h3>
          <div>
            <label class="block text-gray-700 font-semibold mb-2"
              >Cédula Profesional *</label
            >
            <input
              v-model="form.cedula"
              type="text"
              placeholder="7654321"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="errors.cedula ? 'border-red-500' : 'border-gray-300'"
            />
            <p v-if="errors.cedula" class="text-red-600 text-sm mt-1">
              {{ errors.cedula }}
            </p>
          </div>
        </div>

        <!-- Horarios de Atención -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold mb-4 pb-2 border-b">
            Horarios de Atención
          </h3>
          <div class="space-y-3">
            <div
              v-for="day in schedule"
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
          <p class="text-sm text-gray-500 mt-3">
            * Marca los días y horarios en que el psicólogo estará disponible
            para atender citas.
          </p>
        </div>

        <!-- Contraseña -->
        <div class="mb-8">
          <h3 class="text-xl font-semibold mb-4 pb-2 border-b">
            Contraseña Inicial
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 font-semibold mb-2"
                >Contraseña *</label
              >
              <input
                v-model="form.password"
                type="password"
                placeholder="••••••••"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="errors.password ? 'border-red-500' : 'border-gray-300'"
              />
              <p v-if="errors.password" class="text-red-600 text-sm mt-1">
                {{ errors.password }}
              </p>
            </div>
            <div>
              <label class="block text-gray-700 font-semibold mb-2"
                >Confirmar Contraseña *</label
              >
              <input
                v-model="form.confirmPassword"
                type="password"
                placeholder="••••••••"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                "
              />
              <p
                v-if="errors.confirmPassword"
                class="text-red-600 text-sm mt-1"
              >
                {{ errors.confirmPassword }}
              </p>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-2">
            El psicólogo podrá cambiar esta contraseña después del primer inicio
            de sesión.
          </p>
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
          ¡Psicólogo creado exitosamente! Redirigiendo...
        </div>

        <!-- Botones -->
        <div class="flex gap-4 pt-6 border-t">
          <RouterLink
            to="/admin/users"
            class="flex-1 text-center bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 font-semibold"
          >
            Cancelar
          </RouterLink>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
          >
            {{ loading ? "Creando..." : "Crear Psicólogo" }}
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

const router = useRouter();

const form = ref({
  nombre: "",
  apellido_paterno: "",
  apellido_materno: "",
  sexo: "",
  email: "",
  telefono: "",
  cedula: "",
  password: "",
  confirmPassword: "",
});

const schedule = ref([
  { key: "lunes", label: "Lunes", active: true, start: "09:00", end: "17:00" },
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
    active: true,
    start: "09:00",
    end: "17:00",
  },
]);

const errors = ref({});
const loading = ref(false);
const submitError = ref("");
const submitSuccess = ref(false);

function validate() {
  const e = {};
  if (!form.value.nombre) e.nombre = "El nombre es requerido.";
  if (!form.value.apellido_paterno)
    e.apellido_paterno = "El apellido paterno es requerido.";
  if (!form.value.apellido_materno)
    e.apellido_materno = "El apellido materno es requerido.";
  if (!form.value.sexo) e.sexo = "El sexo es requerido.";
  if (!form.value.email) e.email = "El email es requerido.";
  if (!form.value.telefono) e.telefono = "El teléfono es requerido.";
  if (!form.value.cedula) e.cedula = "La cédula profesional es requerida.";
  if (!form.value.password) e.password = "La contraseña es requerida.";
  else if (form.value.password.length < 8) e.password = "Mínimo 8 caracteres.";
  if (form.value.password !== form.value.confirmPassword)
    e.confirmPassword = "Las contraseñas no coinciden.";
  errors.value = e;
  return Object.keys(e).length === 0;
}

async function handleSubmit() {
  if (!validate()) return;

  loading.value = true;
  submitError.value = "";

  try {
    // Mock - reemplazar con llamada real a API
    // await createPsychologist({ ...form.value, schedule: schedule.value })
    await new Promise((resolve) => setTimeout(resolve, 1000));

    submitSuccess.value = true;
    setTimeout(() => router.push("/admin/users"), 2000);
  } catch (err) {
    submitError.value =
      err.response?.data?.detail ||
      "Error al crear el psicólogo. Intenta de nuevo.";
  } finally {
    loading.value = false;
  }
}
</script>
