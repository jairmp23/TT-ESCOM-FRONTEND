import { defineStore } from "pinia";
import {
  updatePsychologistApi,
  registerPsychologistApi,
  getPsychologistApi,
  listPsychologistsApi,
} from "@/api/psychologists";

export const usePsychologistsStore = defineStore("psychologists", () => {
  async function updatePsychologist(id, data) {
    return await updatePsychologistApi(id, data);
  }

  async function listPsychologists(params = {}) {
    return await listPsychologistsApi(params);
  }

  async function registerPsychologist(data) {
    return await registerPsychologistApi(data);
  }

  async function getPsychologist(id) {
    return await getPsychologistApi(id);
  }

  return {
    updatePsychologist,
    listPsychologists,
    getPsychologist,
    registerPsychologist,
  };
});
