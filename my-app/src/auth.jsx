import React, { useState } from "react";
import { supabase } from "./supabase-client";

export const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        console.error("Error signing up:", signUpError.message);
        return;
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        console.error("Error signing in:", signInError.message);
        return;
      }
    }
  };

  return (
    <div className="container my-10">
      <div className="text-2xl font-audiowide my-2">
        {isSignUp ? "Sign Up" : "Sign In"}
      </div>
      <form
        onSubmit={handleSubmit}
        className="font-schoolbell flex flex-col items-center"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          className="border w-80 px-2 my-2"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border w-80 px-2 my-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="border rounded w-32 bg-black text-white my-2"
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
        <button
          type="button"
          className="border rounded w-32 bg-black text-white my-2"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          Switch to {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};
