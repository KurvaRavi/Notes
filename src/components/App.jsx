import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateNote from "./CreateNote";
import * as XLSX from "xlsx";

function App() {
  const [notes, setNotes] = useState([]);
  const [notesCoordinates, setNotesCoordinates] = useState([]);
  const [isVisible, setIsVisible] = useState(false); 
  const [index, setIndex] = useState(0); 

  useEffect(() => {
    updateAllNotesCoordinates();
  }, [notes]);

  function addNote(newNote) {
    setIndex(index + 1);

    setNotes((prevNotes) => {
      return [...prevNotes, newNote];
    });

    setNotesCoordinates((prevNotesCoordinates) => {
      return [...prevNotesCoordinates, { id: newNote.id, coordinates: { top: 0, left: 0 } }];
    });
  }

  function updateNote(newNote) {
    const updatedNotes = notes.map((note, index) => {
      if (index === newNote.id) {
        return newNote;
      }
      return note;
    });
    setNotes(updatedNotes);
  }

  function deleteNote(id) {
    const updatedNotes = notes.filter((note, index) => {
      return index !== id;
    });
    setNotes(updatedNotes);
  }

  function updateAllNotesCoordinates() {
    var updatedNotesCoordinates = [];
    for (let i = 0; i < notes.length; i++) {
      const noteElement = document.getElementById("note-" + i);
      if (noteElement) {
        const rect = noteElement.getBoundingClientRect();
        const top = rect.top;
        const left = rect.left;
        updatedNotesCoordinates.push({ id: i, coordinates: { top: top, left: left } });
      }
    }
    setNotesCoordinates(updatedNotesCoordinates);
  }

  function handleExport() {
    //export in xlsx format
    const headers = [
      "Notes",
      "Distance from top",
      "Distance from left",
      "Distance from top-left corner"
    ];

    var notesData = [];

    for (let i = 0; i < notes.length; i++) {
      const noteTop = notesCoordinates[i].coordinates.top;
      const noteLeft = notesCoordinates[i].coordinates.left;
      notesData.push([
        notes[i].content,
        noteTop,
        noteLeft,
        Math.sqrt(noteTop * noteTop + noteLeft * noteLeft).toFixed(3)
      ]);
    }

    const ws = XLSX.utils.aoa_to_sheet([headers, ...notesData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Notes");
    XLSX.writeFile(wb, "notes.xlsx");
  }

  const handleDoubleClick = (e) => {
    setIsVisible(true);
  };

  function handleDrop(event) {
    event.preventDefault();
    if (!event.target.closest(".row")) {
      const text = event.dataTransfer.getData("text");
      const newNote = {
        id: index,
        content: text,
      };
      addNote(newNote);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }


  return (
    <div className="container">
      <Header />
      <div>
        <div
          className="container justify-content-center main"
          onDoubleClick={handleDoubleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div>
          <CreateNote
            onAdd={addNote}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            id={index}
            onUpdate={updateNote}
          />
          </div>
          <div className="row">
            {notes.map((noteItem, index) => {
              return (
                <Note
                  divid={index}
                  key={index}
                  id={noteItem.id}
                  content={noteItem.content}
                  onDelete={deleteNote}
                  isVisible={true}
                  onAdd={addNote}
                  isEditabled={true}
                  setVisible={setIsVisible}
                  onUpdate={updateNote}
                  notes={notes}
                />
              );
            })}
          </div>
        </div>
        <div className="export">
          <button type="submit" className="exportBtn" onClick={handleExport}>
            Export Notes
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;