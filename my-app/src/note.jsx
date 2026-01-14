import React, { useState, useEffect } from "react";
import { supabase } from "./supabase-client";

export default function Note() {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching:", error.message);
    } else {
      setNotes(data || []);
    }
  };

  const addNote = async () => {
    if (!title || !note) return;

    if (editId) {
      const { error } = await supabase
        .from("notes")
        .update({ title, note })
        .eq("id", editId);

      if (error) {
        console.error("Error updating:", error.message);
      }
      setEditId(null);
    } else {
      const { error } = await supabase.from("notes").insert({ title, note });

      if (error) {
        console.error("Error adding:", error.message);
      }
    }

    setTitle("");
    setNote("");
    fetchNotes();
  };

  const editNote = (n) => {
    setTitle(n.title);
    setNote(n.note);
    setEditId(n.id);
  };

  const deleteNote = async (id) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) {
      console.error("Error deleting:", error.message);
    } else {
      fetchNotes();
    }
  };

  return (
    <div className="container ">
      <div className="font-audiowide text-4xl py-5 font-bold">Note App</div>

      <form className="flex flex-col justify-center gap-3 font-schoolbell">
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
            type="button"
            className="border rounded w-32 bg-black text-white"
            onClick={addNote}
          >
            {editId ? "Update" : "Add note"}
          </button>

          {editId && (
            <button
              type="button"
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
      </form>

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
