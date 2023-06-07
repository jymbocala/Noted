import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo } from "react";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import { NewNote } from "./NewNote";
import { useLocalStorage } from "./useLocalStorage";
import { v4 as uuidV4 } from "uuid";
import { NoteList } from "./NoteList";
import { NoteLayout } from "./NoteLayout";
import { Note } from "./Note";
import { EditNote } from "./EditNote";

export type Note = {
  id: string;
} & NoteData;

export type RawNote = {
  id: string;
} & RawNoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  label: string;
};

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const noteWithTags = useMemo(() => {
    // Generate a new array of notes with filtered tags
    return notes.map((note) => {
      // For each note, filter the tags based on the note's tagIds
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      // Create a new note object with the provided data and generate a unique ID using uuidV4()
      // Map the tags to their IDs and assign them to the note's tagIds property
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        // Find the note with the matching ID and update its data and tagIds
        if (note.id === id) {
          // Map the new tags to their IDs and assign them to the note's tagIds property
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
        } else {
          return note;
        }
      });
    });
  }

  function onDeleteNote(id: string) {
    setNotes((prevNotes) => {
      // Remove the note with the provided ID from the notes array
      return prevNotes.filter((note) => note.id !== id);
    });
  }

  function addTag(tag: Tag) {
    // Add a provided new tag to the tags array
    setTags((prev) => [...prev, tag]);
  }

  function updateTag(id: string, label: string) {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          // Find the tag with the matching ID and update its label
          return {
            ...tag,
            label,
          };
        } else {
          return tag;
        }
      });
    });
  }

  function deleteTag(id: string) {
    setTags((prevTags) => {
      // Remove the tag with the provided ID from the tags array
      return prevTags.filter((tag) => tag.id !== id);
    });
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              notes={noteWithTags}
              availableTags={tags}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
            />
          }
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id" element={<NoteLayout notes={noteWithTags} />}>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        {/* Catch-all route to redirect to the home page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
