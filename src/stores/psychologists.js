import { defineStore } from 'pinia'
import { updatePsychologistApi } from '@/api/psychologists'
import { getPsychologistApi } from '@/api/psychologists'
import { listPsychologistsApi } from '@/api/psychologists'
import { registerPsychologistApi } from '@/api/psychologists'

export const usePsychologistsStore = defineStore('psychologists', () => {
  async function updatePsychologist(id, data) {
    return await updatePsychologistApi(id, data)
  }

  async function listPsychologists() { 
    return await listPsychologistsApi()
  }

  async function registerPsychologist(data) {
    return await registerPsychologistApi(data)
  }

    async function getPsychologist(id) { 
    return await getPsychologistApi(id)
  }

  return { updatePsychologist, listPsychologists, getPsychologist, registerPsychologist }
})