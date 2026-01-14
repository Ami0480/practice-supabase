import React from "react";

export default function Auth() {
  return (
    <div className="container my-10">
      <div className="text-2xl font-audiowide my-2">Sign In</div>
      <form className="font-schoolbell flex flex-col items-center">
        <input
          type="text"
          placeholder="email"
          className="border w-80 px-2 my-2"
        />
        <input
          type="text"
          placeholder="password"
          className="border w-80 px-2 my-2"
        />
        <button
          type="button"
          className="border rounded w-32 bg-black text-white my-2"
        >
          Sign In
        </button>
        <button
          type="button"
          className="border rounded w-32 bg-black text-white my-2"
        >
          Switch to Sign Up
        </button>
      </form>
    </div>
  );
}
