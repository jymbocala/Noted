import {
  Navigate,
  Outlet,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { Note } from "./App";

type NoteLayoutProps = {
  notes: Note[];
};

export function NoteLayout({ notes }: NoteLayoutProps) {
  // Retrieve the ID parameter from the current URL
  const { id } = useParams();
  // Find the note with the matching ID from the provided notes array
  const note = notes.find((n) => n.id === id);

  if (note == null) return <Navigate to="/" replace />;

  // Render the nested routes within the Outlet component, passing the note as context
  return <Outlet context={note} />;
}

export function useNote() {
  // Retrieve the context of the nearest Outlet component, which should be the note

  return useOutletContext<Note>();
  // By calling useNote within a component, you can access the note data stored in the context of the nearest Outlet component. This allows you to access and utilize the note data within your component's logic.
}
