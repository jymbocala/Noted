import { NoteData, Tag } from "./App";
import { NoteForm } from "./NoteForm";
import { useNote } from "./NoteLayout";

type EditNoteProps = {
  onSubmit: (id: string, data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

export function EditNote({ onSubmit, onAddTag, availableTags }: EditNoteProps) {
  // Retrieve the note data using the useNote() hook from NoteLayout.tsx
  const note = useNote();
  return (
    <>
      <h1 className="mb-4">Edit Note</h1>
      <NoteForm
        // Pass the existing note data to the NoteForm component for editing
        title={note.title}
        markdown={note.markdown}
        tags={note.tags}
        // Call the onSubmit function with the updated data and the note's ID
        onSubmit={(data) => onSubmit(note.id, data)}
        // Pass the onAddTag function to allow adding new tags
        onAddTag={onAddTag}
        // Pass the available tags to the NoteForm component
        availableTags={availableTags}
      />
    </>
  );
}
