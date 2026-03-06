import { defineStore } from "pinia";
import {
  registerAppointmentApi,
  listAppointmentsApi,
  updateAppointmentApi,
  getAvailableSlotsApi,
} from "@/api/appointments";

export const useAppointmentsStore = defineStore("appointments", () => {
  async function createAppointment(data) {
    return await registerAppointmentApi(data);
  }

  async function listAppointments(params = {}) {
    return await listAppointmentsApi(params);
  }

  async function updateAppointment(id, data) {
    return await updateAppointmentApi(id, data);
  }

  async function getAvailableSlots(psychologist_id, date) {
    return await getAvailableSlotsApi(psychologist_id, date);
  }

  return { createAppointment, listAppointments, updateAppointment, getAvailableSlots };
});
