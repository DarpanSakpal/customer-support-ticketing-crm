import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import CreateTicket from "./pages/CreateTicket";
import TicketDetails from "./pages/TicketDetails";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("crm-dark-mode");

    if (saved !== null) {
      return saved === "true";
    }

    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );

    localStorage.setItem(
      "crm-dark-mode",
      String(darkMode)
    );
  }, [darkMode]);

  function toggleDarkMode() {
    setDarkMode((current) => !current);
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        <div className="min-h-screen pt-[86px] lg:pl-[276px]">
          <Routes>
            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/create-ticket"
              element={<CreateTicket />}
            />

            <Route
              path="/tickets/:ticketId"
              element={<TicketDetails />}
            />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;