import React, { useState, useEffect } from "react";
import { supabase } from "./supabase-client";

export default function Note({ session }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);

  const [noteImage, setNoteImage] = useState(null);

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

  const uploadImage = async (file) => {
    const filePath = `${file.name}-${Date.now()}`;

    const { error } = await supabase.storage
      .from("notes-images")
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading image:", error.message);
      return null;
    }

    const { data } = await supabase.storage
      .from("notes-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const addNote = async () => {
    if (!title || !note) return;

    let imageUrl = null;
    if (noteImage) {
      imageUrl = await uploadImage(noteImage);
    }

    if (editId) {
      console.log("Updating with:", { title, note, editId });
      const updateDate = { title, note };
      if (imageUrl) {
        updateDate.image_url = imageUrl;
      }
      const { error } = await supabase
        .from("notes")
        .update(updateDate)
        .eq("id", editId);

      console.log("Update error:", error);

      if (error) {
        console.error("Error updating:", error.message);
      }
      setEditId(null);
    } else {
      const { error } = await supabase.from("notes").insert({
        title,
        note,
        email: session.user.email,
        image_url: imageUrl,
      });

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
    setNoteImage(null);
  };

  const deleteNote = async (id) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) {
      console.error("Error deleting:", error.message);
    } else {
      fetchNotes();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0)
      setNoteImage(e.target.files[0]);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    const channel = supabase.channel("notes-channel");
    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notes" },
        (payload) => {
          const newNote = payload.new;
          setNotes((prev) => [...prev, newNote]);
        }
      )
      .subscribe((status) => {
        console.log("Subscribed: ", status);
      });
  }, []);

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
        <div>
          <label className="rounded w-32 bg-gray-200 px-4 mr-4">
            Choose File
            <input
              type="file"
              accept="*/image"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <span>{noteImage ? noteImage.name : "No file chosen"}</span>
        </div>

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
                setNoteImage(null);
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
          className="border mix-h-52 mb-4 flex flex-col justify-between p-4 font-schoolbell"
        >
          <div className="font-bold text-2xl">{n.title}</div>
          <div className="my-2">{n.note}</div>
          {n.image_url && (
            <img
              src={n.image_url}
              className="max-h-40 object-contain my-2"
              alt="Note image"
            />
          )}

          <div className="flex justify-center gap-3 mt-4">
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
