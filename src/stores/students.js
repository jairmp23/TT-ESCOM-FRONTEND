import { defineStore } from "pinia";
import {
  updateStudentApi,
  getStudentApi,
  listStudentsApi,
  registerStudentApi,
} from "@/api/students";

export const useStudentsStore = defineStore("students", () => {
  async function updateStudent(id, data) {
    return await updateStudentApi(id, data);
  }

  async function registerStudent(data) {
    return await registerStudentApi(data);
  }

  async function getStudent(id) {
    return await getStudentApi(id);
  }
  async function listStudents(params = {}) {
    return await listStudentsApi(params);
  }

  return { updateStudent, getStudent, listStudents, registerStudent };
});
