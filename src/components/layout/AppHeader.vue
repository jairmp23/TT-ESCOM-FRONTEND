<template>
  <header class="bg-white shadow">
    <div class="mx-auto px-4 py-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-blue-600">Psicología ESCOM</h1>
      <div class="flex items-center gap-4">
        <span class="text-gray-700"
          >{{ auth.user?.nombre }} {{ auth.user?.apellido_paterno }}</span
        >
        <button @click="handleLogout" class="text-gray-600 hover:text-gray-800">
          Cerrar Sesión
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

function handleLogout() {
  auth.logout();
  router.push("/login");
}
</script>
