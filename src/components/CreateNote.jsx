import React, { useEffect, useState, useRef } from "react";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import { Zoom } from "@material-ui/core";

function CreateNote(props) {
  const [isExpanded, setExpanded] = useState(true);
  const createTextArea = useRef(null);

  function expand() {
    setExpanded(true);
  }

  const [note, setNote] = useState({
    id: props.id,
    content: "",
    coordinates: { top: 0, left: 0 }
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
        submitNote(event);
    }
    if (event.key === "Escape") {
      props.setIsVisible(false);
    }
  }

  function submitNote(event) {
    props.onAdd(note);
    setNote({
      content: "",
      id: props.id
    });
    props.setIsVisible(false);
    event.preventDefault();
  }

  function handleClickOutside(event) {
    // Check if the clicked element is not within the CreateArea component
    if (!event.target.closest(".create-note")) {
      props.setIsVisible(false); // Hide the component
    }
  }

  useEffect(() => {
    // When component mounts or isVisible changes to true
    if (props.isVisible) {
      createTextArea.current.focus(); // Focus on the textarea
      // Add event listener to capture clicks outside of the component
      document.addEventListener("click", handleClickOutside);
    } else {
      // If component is not visible, remove the event listener
      document.removeEventListener("click", handleClickOutside);
    }
    // Cleanup function to remove event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [props.isVisible]);

  if (!props.isVisible) return null;
  return (
    <div>
      <form className="create-note">
        <textarea
          onClick={expand}
          name="content"
          onChange={handleChange}
          onKeyUp={handleKeyPress}
          value={note.content}
          placeholder="Take a note..."
          rows={isExpanded ? 3 : 1}
          ref={createTextArea}
        />
        <Zoom in={isExpanded}>
          <Fab onClick={submitNote}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateNote;