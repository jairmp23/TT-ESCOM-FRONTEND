<template>
  <div class="bg-gray-50 min-h-screen">
    <AppHeader />
    <div class="flex">
      <AppSidebar :links="sidebarLinks" />
      <main class="flex-1 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppHeader from "@/components/layout/AppHeader.vue";
import AppSidebar from "@/components/layout/AppSidebar.vue";
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

const studentLinks = [
  { label: "Dashboard", to: "/student" },
  { label: "Agendar Cita", to: "/student/schedule" },
  { label: "Mis Citas", to: "/student/appointments" },
  { label: "Perfil", to: "/student/profile" },
];

const psychologistLinks = [
  { label: "Dashboard", to: "/psychologist" },
  { label: "Agendar Cita", to: "/psychologist/schedule" },
  { label: "Registros", to: "/psychologist/records" },
  { label: "Perfil", to: "/psychologist/profile" },
];

const adminLinks = [
  { label: "Dashboard", to: "/admin" },
  { label: "Gestión de Usuarios", to: "/admin/users" },
  { label: "Crear Psicólogo", to: "/admin/create-psychologist" },
  { label: "Mi Perfil", to: "/admin/profile" },
];

const sidebarLinks = computed(() => {
  const role = auth.user?.role;
  if (role === "student") return studentLinks;
  if (role === "psychologist") return psychologistLinks;
  if (role === "admin") return adminLinks;
  return [];
});
</script>
