<template>
  <span
    :class="badgeClass"
    class="px-3 py-1 rounded-full text-sm font-semibold"
  >
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
});

const config = {
  pending: { label: "Pendiente", class: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmado", class: "bg-green-100 text-green-800" },
  completed: { label: "Completado", class: "bg-blue-100 text-blue-800" },
  cancelled: { label: "Cancelado", class: "bg-red-100 text-red-800" },
};

const badgeClass = computed(
  () => config[props.status]?.class || "bg-gray-100 text-gray-800",
);
const label = computed(() => config[props.status]?.label || props.status);
</script>
