import axios from 'axios';
import type { Note, NoteTag } from '../types/note';

const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const noteHubApi = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
  perPage: number;
  totalItems: number;
}

export interface NewNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async (
  page: number,
  perPage: number,
  search = ''
): Promise<FetchNotesResponse> => {
  const trimmedSearch = search.trim();

  const params: {
    page: number;
    perPage: number;
    search?: string;
  } = {
    page,
    perPage,
  };

  if (trimmedSearch) {
    params.search = trimmedSearch;
  }

  const { data } = await noteHubApi.get<FetchNotesResponse>('/notes', {
    params,
  });

  return data;
};

export const createNote = async (noteData: NewNoteData): Promise<Note> => {
  const { data } = await noteHubApi.post<Note>('/notes', noteData);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await noteHubApi.delete<Note>(`/notes/${id}`);
  return data;
};
