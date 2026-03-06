import { defineStore } from "pinia";
import {
  getNoteApi,
  listNotesApi,
  registerNoteApi,
  updateNoteApi,
} from "@/api/notes";

export const useNotesStore = defineStore("notes", () => {
  async function getNote(id) {
    return await getNoteApi(id);
  }
  async function listNotes(params = {}) {
    return await listNotesApi(params);
  }
  async function registerNote(data) {
    return await registerNoteApi(data);
  }
  async function updateNote(id, data) {
    return await updateNoteApi(id, data);
  }

  return { getNote, listNotes, registerNote, updateNote };
});
