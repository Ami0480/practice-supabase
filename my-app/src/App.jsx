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
    setSession(currentSession.data);
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <div>
      <Note />
      <Auth />
    </div>
  );
}

export default App;
