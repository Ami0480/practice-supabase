import React from "react";

export default function Note() {
  return (
    <div className="container ">
      <div className="font-audiowide text-2xl py-5 font-bold">Note App</div>

      <div className="flex flex-col justify-center gap-3">
        <input
          type="text"
          placeholder="Add Title"
          className="border  text-center"
        />
        <input
          type="text"
          placeholder="Add Note"
          className="border text-center h-40"
        />
        <div className="py-3 flex justify-center gap-3">
          <button className="border rounded w-32 bg-black text-white">
            Add note
          </button>
          <button className="border w-32 rounded bg-black text-white">
            Save
          </button>
        </div>
      </div>

      <div className="border h-52 flex flex-col justify-between p-4">
        <div className="font-bold">Title</div>
        <div>Note</div>
        <div className="flex justify-center gap-3">
          <button className="border w-32 rounded bg-black text-white">
            Edit
          </button>
          <button className="border w-32 rounded bg-black text-white">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
