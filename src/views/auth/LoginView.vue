<template>
  <AuthLayout>
    <div class="bg-white p-8 rounded-lg shadow-lg w-96">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-blue-600 mb-2">Psicología ESCOM</h1>
        <p class="text-gray-600">ESCOM - IPN</p>
      </div>

      <h2 class="text-2xl font-semibold mb-6 text-center">Iniciar Sesión</h2>

      <form @submit.prevent="handleLogin">
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

        <div class="mb-6">
          <label class="block text-gray-700 mb-2">Contraseña</label>
          <input
            v-model="form.password"
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

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
        >
          {{ loading ? "Iniciando sesión..." : "Iniciar Sesión" }}
        </button>

        <div class="mt-4 text-center">
          <RouterLink
            to="/register"
            class="text-sm text-blue-600 hover:underline font-semibold"
          >
            No tienes una cuenta? Registrate
          </RouterLink>
        </div>
      </form>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AuthLayout from "@/layouts/AuthLayout.vue";

const router = useRouter();
const auth = useAuthStore();

const form = ref({ email: "", password: "" });
const loading = ref(false);
const error = ref("");

async function handleLogin() {
  loading.value = true;
  error.value = "";
  try {
    await auth.login(form.value.email, form.value.password);
    // Redirect based on role
    const role = auth.user?.role;
    if (role === "student") router.push("/student");
    else if (role === "psychologist") router.push("/psychologist");
    else if (role === "admin") router.push("/admin");
  } catch (err) {
    error.value =
      err.response?.data?.detail || "Invalid credentials. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>
