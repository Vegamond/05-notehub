import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

import { createNote, deleteNote, fetchNotes } from '../../services/noteService';
import type { NewNoteData } from '../../services/noteService';
import css from './App.module.css';

export default function App() {
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const updateSearch = useDebouncedCallback((value: string) => {
    setSearch(value.trim());
    setPage(1);
  }, 500);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    updateSearch(value);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes(page, 12, search),
    retry: false,
  });

  const createNoteMutation = useMutation({
    mutationFn: (newNote: NewNoteData) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleCreateNote = async (values: NewNoteData) => {
    await createNoteMutation.mutateAsync(values);
  };

  const handleDeleteNote = (id: string) => {
    deleteNoteMutation.mutate(id);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onChange={handleSearchChange} />

        <button
          className={css.button}
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {data && data.notes.length > 0 && (
        <>
          <NoteList notes={data.notes} onDelete={handleDeleteNote} />
          <Pagination
            page={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {data && data.notes.length === 0 && !isLoading && (
        <p className={css.empty}>No notes found.</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={handleCreateNote}
            onCancel={() => setIsModalOpen(false)}
            isSubmitting={createNoteMutation.isPending}
          />
        </Modal>
      )}
    </div>
  );
}
