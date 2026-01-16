import React, { useEffect, useState } from "react";
import Note from "./note.jsx";
import { Auth } from "./auth.jsx";
import { supabase } from "./supabase-client";

import "./App.css";

function App() {
  const [session, setSession] = useState(null);

  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession();
    console.log(currentSession);
    setSession(currentSession.data.session);
  };

  useEffect(() => {
    fetchSession();

    const { data: authListner } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return;
    () => {
      authListner.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      {session ? (
        <>
          <button
            onClick={logout}
            className="border rounded w-32 bg-black text-white font-schoolbell"
          >
            Log Out
          </button>
          <Note session={session} />
        </>
      ) : (
        <Auth />
      )}
    </>
  );
}

export default App;
