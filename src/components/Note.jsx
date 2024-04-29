import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import { useState, useRef } from "react";

function Note(props) {
  const [isEditabled, setEditabled] = useState(props.isEditabled);
  const [content, setContent] = useState(props.content);
  const [id, setId] = useState(props.id);
  const [textareaRows, setTextareaRows] = useState(1);
  const [textareaCols, setTextareaCols] = useState(1);

  React.useEffect(() => {
    // Calculate the number of lines in the content and set the rows accordingly
    const lineCount = (content.match(/\n/g) || []).length + 1;
    setTextareaRows(lineCount < 3 ? 3 : lineCount+2); // Set a minimum of 3 rows

    // Calculate the maximum line lenght in the content and set the cols accordingly
    const maxLineLength = Math.max(...content.split("\n").map(line => line.length));
    const textareaCols = maxLineLength < 50 ? 50 : maxLineLength + 2; // Set a minimum of 50 cols
    setTextareaCols(textareaCols);
  }, [content]);

  function handleDelete(e) {
    props.onDelete(id);
    e.preventDefault();
  }

  if (!props.isVisible) return null;

  function handleDropOnNote(event) {
    event.preventDefault();
    const text = event.dataTransfer.getData("text");
    setContent(content + "\n" + text);
  }

  return (
    <div 
      className="col notTe"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDropOnNote}
      id={"note-" + props.divid}
      >
      <form
        className="display-note"
      >
        <textarea
          name="content"
          value={content}
          placeholder="Take a note..."
          disabled={!isEditabled}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          rows={textareaRows}
          cols={textareaCols}
        />
        <button onClick={handleDelete}>
          <DeleteIcon />
        </button>
      </form>
    </div>
  );
}

export default Note;