<template>
  <!-- Fuera del horario del psicólogo -->
  <div v-if="!working" class="bg-gray-200/60 p-2 rounded text-xs text-center text-gray-300 select-none">
    —
  </div>

  <!-- Dentro del horario, con cita -->
  <div
    v-else-if="appointment"
    class="rounded text-sm p-2 cursor-pointer hover:opacity-80 transition-opacity"
    :class="cardStyles.card"
    @click="$emit('click', appointment)"
  >
    <div class="font-semibold text-xs leading-tight" :class="cardStyles.text">
      {{ studentName }}
    </div>
    <div class="text-xs mt-0.5" :class="cardStyles.subtext">
      {{ statusLabel }}
    </div>
  </div>

  <!-- Dentro del horario, sin cita -->
  <div v-else class="bg-gray-50 p-2 rounded text-xs text-center text-gray-400">
    Libre
  </div>
</template>

<script setup>
import { computed } from "vue";
import { STATUS_CONFIG, STATUS_CARD_STYLES, STATUS_CARD_FALLBACK } from "@/utils/statusConfig";

const props = defineProps({
  appointment: {
    type: Object,
    default: null,
  },
  working: {
    type: Boolean,
    default: true,
  },
});

defineEmits(["click"]);

const cardStyles = computed(
  () => STATUS_CARD_STYLES[props.appointment?.status] ?? STATUS_CARD_FALLBACK,
);

const statusLabel = computed(
  () => STATUS_CONFIG[props.appointment?.status]?.label ?? "",
);

const studentName = computed(() => {
  const u = props.appointment?.student_info?.user;
  if (!u) return "Estudiante";
  return [u.first_name, u.last_name].filter(Boolean).join(" ");
});
</script>
