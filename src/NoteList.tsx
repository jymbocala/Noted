import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Stack,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { Tag } from "./App";
import styles from "./NoteLists.module.css";

type NoteListProps = {
  availableTags: Tag[];
  notes: SimplifiedNote[];
  onDeleteTag: (id: string) => void;
  onUpdateTag: (id: string, label: string) => void;
};

type SimplifiedNote = {
  tags: Tag[];
  title: string;
  id: string;
};

type EditTagsModalProps = {
  show: boolean;
  availableTags: Tag[];
  handleClose: () => void;
  onDeleteTag: (id: string) => void;
  onUpdateTag: (id: string, label: string) => void;
};

export function NoteList({
  availableTags,
  notes,
  onUpdateTag,
  onDeleteTag,
}: NoteListProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false);

  const filteredNotes = useMemo(() => {
    // Use the useMemo hook to memoize the filteredNotes value and avoid unnecessary re-renders

    return notes.filter((note) => {
      // Filter the notes array based on the following conditions:

      return (
        title === "" || // If the title is empty, include all notes
        (note.title.toLowerCase().includes(title.toLowerCase()) && // Check if the note title contains the search title (case-insensitive)
          // Check if the selectedTags are empty or every selected tag is present in the note's tags
          (selectedTags.length === 0 ||
            selectedTags.every((tag) => {
              // Iterate over each selected tag and check if it exists in the note's tags
              note.tags.some((noteTag) => noteTag.id === tag.id);
            })))
      );
    });
  }, [title, selectedTags, notes]);

  return (
    <>
      {/* HEADER */}
      <Row className="align-items-center mb-4">
        <Col>
          <h1>✏️ Noted</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/new">
              <Button variant="primary">Create</Button>
            </Link>
            <Button
              variant="outline-secondary"
              onClick={() => setEditTagsModalIsOpen(true)}
            >
              Edit Tags
            </Button>
          </Stack>
        </Col>
      </Row>

      <blockquote className="blockquote text-center text-muted ">
        <p className="small">
          "Taking notes is the habit of a curious mind, valuing the importance
          of capturing and preserving valuable information."
        </p>
      </blockquote>

      {/* FORM */}
      <Form>
        <Row className="my-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <ReactSelect
                // The options property populate the select menu
                options={availableTags.map((tag) => {
                  // Convert availableTags into an array of objects with label and value properties
                  return { label: tag.label, value: tag.id };
                })}
                value={selectedTags.map((tag) => {
                  // Convert selectedTags into an array of objects with label and value properties
                  return { label: tag.label, value: tag.id };
                })}
                onChange={(tags) => {
                  // Handle the onChange event when selecting or deselecting tags
                  setSelectedTags(
                    tags.map((tag) => {
                      // Convert the selected tags into an array of objects with label and id properties
                      return { label: tag.label, id: tag.value };
                    })
                  );
                }}
                isMulti // Allow multiple tags to be selected
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      {/* CARDS */}
      <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredNotes.map((note) => (
          // Render the filterdNotes data into each column
          <Col key={note.id}>
            <NoteCard id={note.id} title={note.title} tags={note.tags} />
          </Col>
        ))}
      </Row>

      <EditTagsModal
        show={editTagsModalIsOpen}
        handleClose={() => setEditTagsModalIsOpen(false)}
        availableTags={availableTags}
        onUpdateTag={onUpdateTag}
        onDeleteTag={onDeleteTag}
      />
    </>
  );
}

function NoteCard({ id, title, tags }: SimplifiedNote) {
  return (
    <Card
      as={Link}
      to={`/${id}`}
      className={`h-100 text-reset text-decoration-none ${styles.card}`}
    >
      <Card.Body>
        <Stack
          gap={2}
          className="align-items-center justify-content-center h-100"
        >
          <span className="fs-5">{title}</span>
          {tags.length > 0 && (
            <Stack
              gap={1}
              direction="horizontal"
              className="justify-content-center flex-wrap"
            >
              {tags.map((tag) => (
                <Badge key={tag.id} className="text-truncate">
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
}

function EditTagsModal({
  availableTags,
  handleClose,
  show,
  onDeleteTag,
  onUpdateTag,
}: EditTagsModalProps) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {availableTags.map((tag) => (
              <Row key={tag.id}>
                <Col>
                  <Form.Control
                    type="text"
                    value={tag.label}
                    onChange={(e) => onUpdateTag(tag.id, e.target.value)}
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    variant="outline-danger"
                    onClick={() => onDeleteTag(tag.id)}
                  >
                    &times;
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
