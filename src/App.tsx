import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import { NewNote } from "./NewNote";

// Type representing a Note
export type Note = {
  id: string;
} & NoteData;

export type RawNote = {
  id: string;
}

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string;
};

// Type representing the data of a Note
export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

// Type representing a Tag
export type Tag = {
  id: string;
  label: string;
};

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/new" element={<NewNote />} />
        <Route path="/:id">
          <Route index element={<h1>Show</h1>} />
          <Route path="edit" element={<h1>Edit</h1>} />
        </Route>
        {/* Catch-all route to redirect to the home page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
