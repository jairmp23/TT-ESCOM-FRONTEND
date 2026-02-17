<template>
  <AuthLayout>
    <div class="bg-white p-8 rounded-lg shadow-lg w-96">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-blue-600 mb-2">Psicología ESCOM</h1>
        <p class="text-gray-600">ESCOM - IPN</p>
      </div>

      <h2 class="text-2xl font-semibold mb-6 text-center">
        Registro de Alumnos
      </h2>

      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Boleta</label>
          <input
            v-model="form.boleta"
            type="text"
            placeholder="2024123456"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Nombre(s)</label>
          <input
            v-model="form.nombre"
            type="text"
            placeholder="Juan"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Apellido Paterno</label>
          <input
            v-model="form.apellido_paterno"
            type="text"
            placeholder="Pérez"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Apellido Materno</label>
          <input
            v-model="form.apellido_materno"
            type="text"
            placeholder="García"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Correo Institucional</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="example@alumno.ipn.mx"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Contraseña</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 mb-2">Confirmar Contraseña</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <!-- Error message -->
        <div
          v-if="error"
          class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
        >
          {{ error }}
        </div>

        <!-- Success message -->
        <div
          v-if="success"
          class="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm"
        >
          Cuenta creada exitosamente! Redirigiendo a iniciar sesión...
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
        >
          {{ loading ? "Creando cuenta..." : "Registrar" }}
        </button>

        <div class="mt-4 text-center">
          <RouterLink
            to="/login"
            class="text-sm text-blue-600 hover:underline font-semibold"
          >
            Ya tienes una cuenta? Iniciar Sesión
          </RouterLink>
        </div>
      </form>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { registerApi } from "@/api/auth";
import AuthLayout from "@/layouts/AuthLayout.vue";

const router = useRouter();

const form = ref({
  boleta: "",
  nombre: "",
  apellido_paterno: "",
  apellido_materno: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const loading = ref(false);
const error = ref("");
const success = ref(false);

async function handleRegister() {
  error.value = "";

  // Basic validations
  if (form.value.password !== form.value.confirmPassword) {
    error.value = "Passwords do not match.";
    return;
  }

  if (form.value.password.length < 8) {
    error.value = "Password must be at least 8 characters.";
    return;
  }

  loading.value = true;
  try {
    await registerApi({
      boleta: form.value.boleta,
      nombre: form.value.nombre,
      apellido_paterno: form.value.apellido_paterno,
      apellido_materno: form.value.apellido_materno,
      email: form.value.email,
      password: form.value.password,
    });
    success.value = true;
    setTimeout(() => router.push("/login"), 2000);
  } catch (err) {
    error.value =
      err.response?.data?.detail || "Error creating account. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>
