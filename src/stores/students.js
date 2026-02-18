import { defineStore } from 'pinia'
import { updateStudentApi } from '@/api/students'
import { getStudentApi } from '@/api/students'

export const useStudentsStore = defineStore('students', () => {
  async function updateStudent(id, data) {
    return await updateStudentApi(id, data)
  }

  async function getStudent(id) { 
    return await getStudentApi(id)
  }

  return { updateStudent, getStudent }
})