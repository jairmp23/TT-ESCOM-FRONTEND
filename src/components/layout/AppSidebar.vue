<template>
    <aside class="w-64 bg-white shadow min-h-screen p-4">
      <nav class="space-y-2">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="block px-4 py-2 rounded text-gray-700 hover:bg-gray-100"
          active-class="bg-blue-100 text-blue-700 font-semibold"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
    </aside>
  </template>
  
  <script setup>
  defineProps({
    links: {
      type: Array,
      required: true,
    },
  })
  </script>