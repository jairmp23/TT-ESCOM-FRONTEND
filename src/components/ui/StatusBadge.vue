<template>
  <span :class="[baseClass, sizeClass]">
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from "vue";
import { STATUS_CONFIG } from "@/utils/statusConfig";

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "md", // "sm" | "md"
  },
});

const baseClass = computed(
  () =>
    `inline-flex items-center font-semibold rounded-full ${
      STATUS_CONFIG[props.status]?.colorClass ?? "bg-gray-100 text-gray-800"
    }`,
);

const sizeClass = computed(() =>
  props.size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
);

const label = computed(
  () => STATUS_CONFIG[props.status]?.label ?? props.status,
);
</script>
