<template>
  <div
    :class="
      fullScreen ? 'fixed inset-0 bg-white bg-opacity-75 z-50' : 'w-full py-12'
    "
    class="flex flex-col items-center justify-center gap-5"
  >
    <!-- Spinner -->
    <div
      class="rounded-full border-4 border-gray-200 animate-spin"
      :class="sizeClass"
      style="border-top-color: #2563eb"
    ></div>

    <!-- Mensaje -->
    <p v-if="message" class="text-gray-500 text-sm font-medium">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  message: {
    type: String,
    default: "Cargando...",
  },
  size: {
    type: String,
    default: "md", // sm | md | lg
  },
  fullScreen: {
    type: Boolean,
    default: false,
  },
});

const sizeClass = computed(
  () =>
    ({
      sm: "w-6 h-6",
      md: "w-10 h-10",
      lg: "w-16 h-16",
    })[props.size],
);
</script>
