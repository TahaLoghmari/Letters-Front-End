import { ThemeProvider } from "./theme-provider";
import { ModeToggle } from "./mode-toggle";
import { createContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { API_BASE_URL } from "@/lib/api";

export const States = createContext(null);
function App() {
  return (
    <ThemeProvider>
      <States.Provider value={{}}>
        <Outlet />
        <ModeToggle />
      </States.Provider>
    </ThemeProvider>
  );
}

export default App;
