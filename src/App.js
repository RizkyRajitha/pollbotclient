import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Login from "./auth/login";
// import Dashboard from "./dashboard/dashboard";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Home from "./components/home";
import Hero from "./components/hero";

const theme = extendTheme({
  config: { initialColorMode: "dark" },
});

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      console.log(session);
    });
  }, []);

  return (
    <div className="">
      <ChakraProvider theme={theme}>
        {/* {!session ? (
          <Login />
        ) : (
          <Dashboard key={session.user.id} session={session} />
        )} */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/app" element={<Home session={session} />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </div>
  );
}

export default App;
