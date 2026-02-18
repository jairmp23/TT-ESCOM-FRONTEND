import { defineStore } from "pinia";
import {
  updateAdminApi,
  registerAdminApi,
  getAdminApi,
} from "@/api/admins";

export const useAdminsStore = defineStore("admins", () => {
  async function updateAdmin(id, data) {
    return await updateAdminApi(id, data);
  }

  async function registerAdmin(data) {
    return await registerAdminApi(data);
  }

  async function getAdmin(id) {
    return await getAdminApi(id);
  }

  return { updateAdmin, getAdmin, registerAdmin };
});
