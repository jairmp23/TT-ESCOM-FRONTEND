<template>
  <AppLayout>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold">Mi Agenda</h2>
    </div>

    <!-- Selector de semana -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex justify-between items-center">
        <button
          @click="previousWeek"
          class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          ← Semana Anterior
        </button>
        <h3 class="text-xl font-semibold">{{ weekLabel }}</h3>
        <button
          @click="nextWeek"
          class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          Semana Siguiente →
        </button>
      </div>
    </div>

    <!-- Calendario semanal -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-3 text-left w-24">Hora</th>
            <th
              v-for="day in weekDays"
              :key="day.date"
              class="px-4 py-3 text-center"
            >
              <div class="font-semibold">{{ day.label }}</div>
              <div class="text-sm text-gray-600">{{ day.dateLabel }}</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="slot in timeSlots" :key="slot" class="border-t">
            <td class="px-4 py-3 text-gray-600 font-semibold">{{ slot }}</td>
            <td v-for="day in weekDays" :key="day.date" class="px-2 py-3">
              <div
                v-if="getAppointment(day.date, slot)"
                class="rounded text-sm p-2"
                :class="
                  getAppointment(day.date, slot).status === 'confirmed'
                    ? 'bg-blue-100 border-l-4 border-blue-600'
                    : 'bg-yellow-100 border-l-4 border-yellow-600'
                "
              >
                <div
                  class="font-semibold"
                  :class="
                    getAppointment(day.date, slot).status === 'confirmed'
                      ? 'text-blue-900'
                      : 'text-yellow-900'
                  "
                >
                  {{ getAppointment(day.date, slot).student }}
                </div>
                <div
                  class="text-xs"
                  :class="
                    getAppointment(day.date, slot).status === 'confirmed'
                      ? 'text-blue-700'
                      : 'text-yellow-700'
                  "
                >
                  {{
                    getAppointment(day.date, slot).status === "confirmed"
                      ? "Confirmada"
                      : "Pendiente"
                  }}
                </div>
              </div>
              <div
                v-else
                class="bg-gray-100 p-2 rounded text-sm text-center text-gray-500"
              >
                Disponible
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Leyenda -->
    <div class="mt-6 flex gap-6 justify-center">
      <div class="flex items-center gap-2">
        <div
          class="w-4 h-4 bg-blue-100 border-l-4 border-blue-600 rounded"
        ></div>
        <span class="text-sm text-gray-600">Confirmada</span>
      </div>
      <div class="flex items-center gap-2">
        <div
          class="w-4 h-4 bg-yellow-100 border-l-4 border-yellow-600 rounded"
        ></div>
        <span class="text-sm text-gray-600">Pendiente</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 bg-gray-100 rounded"></div>
        <span class="text-sm text-gray-600">Disponible</span>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import AppLayout from "@/layouts/AppLayout.vue";

const currentWeekStart = ref(getMonday(new Date()));

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

const dayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

// Mock appointments - reemplazar con llamada a API
const appointments = ref([
  {
    date: "2026-02-17",
    time: "10:00 AM",
    student: "Juan Pérez",
    status: "confirmed",
  },
  {
    date: "2026-02-17",
    time: "2:00 PM",
    student: "Ana Martínez",
    status: "confirmed",
  },
  {
    date: "2026-02-18",
    time: "9:00 AM",
    student: "Luis García",
    status: "pending",
  },
  {
    date: "2026-02-19",
    time: "11:00 AM",
    student: "María Cruz",
    status: "confirmed",
  },
  {
    date: "2026-02-20",
    time: "3:00 PM",
    student: "Pedro Soto",
    status: "pending",
  },
]);

const weekDays = computed(() => {
  return dayNames.map((label, i) => {
    const date = new Date(currentWeekStart.value);
    date.setDate(date.getDate() + i);
    return {
      label,
      date: date.toISOString().split("T")[0],
      dateLabel: date.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
      }),
    };
  });
});

const weekLabel = computed(() => {
  const start = weekDays.value[0];
  const end = weekDays.value[4];
  return `Semana del ${start.dateLabel} - ${end.dateLabel}`;
});

function getAppointment(date, time) {
  return (
    appointments.value.find((a) => a.date === date && a.time === time) || null
  );
}

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d;
}

function previousWeek() {
  const d = new Date(currentWeekStart.value);
  d.setDate(d.getDate() - 7);
  currentWeekStart.value = d;
}

function nextWeek() {
  const d = new Date(currentWeekStart.value);
  d.setDate(d.getDate() + 7);
  currentWeekStart.value = d;
}
</script>
