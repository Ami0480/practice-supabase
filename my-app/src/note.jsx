import React, { useState } from "react";

export default function Note() {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);

  const addNote = () => {
    if (title && note) {
      if (editId) {
        setNotes(
          notes.map((n) => (n.id === editId ? { ...n, title, note } : n))
        );
        setEditId(null);
      } else {
        setNotes([...notes, { id: Date.now(), title, note }]);
        setTitle("");
        setNote("");
      }
    }
  };

  const editNote = (n) => {
    setTitle(n.title);
    setNote(n.note);
    setEditId(n.id);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <div className="container ">
      <div className="font-audiowide text-2xl py-5 font-bold">Note App</div>

      <div className="flex flex-col justify-center gap-3 font-schoolbell">
        <input
          type="text"
          placeholder="Add Title"
          className="border  text-center"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Add Note"
          className="border text-center h-20"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="pb-3">
          <button
            className="border rounded w-32 bg-black text-white"
            onClick={addNote}
          >
            {editId ? "Update" : "Add note"}
          </button>

          {editId && (
            <button
              className="border rounded w-32 bg-black text-white"
              onClick={() => {
                setEditId(null);
                setTitle("");
                setNote("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {notes.map((n) => (
        <div
          key={n.id}
          className="border h-52 flex flex-col justify-between p-4 font-schoolbell"
        >
          <div className="font-bold">{n.title}</div>
          <div>{n.note}</div>
          <div className="flex justify-center gap-3">
            <button
              className="border w-32 rounded bg-black text-white"
              onClick={() => editNote(n)}
            >
              Edit
            </button>
            <button
              className="border w-32 rounded bg-black text-white"
              onClick={() => deleteNote(n.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
