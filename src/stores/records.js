import { defineStore } from "pinia";
import {
  getRecordApi,
  listRecordsApi,
  updateRecordApi,
  registerRecordApi,
} from "@/api/records";

export const useRecordsStore = defineStore("records", () => {
  async function getRecord(id) {
    return await getRecordApi(id);
  }
  async function listRecords(params = {}) {
    return await listRecordsApi(params);
  }
  async function updateRecord(id, data) {
    return await updateRecordApi(id, data);
  }
  async function registerRecord(data) {
    return await registerRecordApi(data);
  }

  return { getRecord, listRecords, updateRecord, registerRecord };
});
