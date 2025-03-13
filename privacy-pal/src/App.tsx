import './App.css'
import { MemoryRouter, Routes, Route, useNavigate } from "react-router";
import { useEffect } from "react";
import Home from "./pages/Home";
import TargetSiteView from "./pages/LoadingData";
import DataView from "./pages/DataPopup";
import LoadingData from "./pages/Home";

function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === "redirect") {
        navigate(message.path);
      }
    });
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/target" element={<TargetSiteView />} />
        <Route path="/loading" element={<LoadingData />} />
        <Route path="/data" element={<DataView />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <MemoryRouter>
      <AppContent />
    </MemoryRouter>
  );
}

export default App;