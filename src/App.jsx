import React from "react";
import { Routes, Route } from "react-router-dom";
import Work from "./pages/Work";
import NewPage from "./pages/NewPage";
import { LectureProvider } from "./context/LectureContext";

export default function App() {
  return (
    <LectureProvider>
      <Routes>
        <Route path="/" element={<Work />} />          {/* главная страница */}
        <Route path="/new" element={<NewPage />} />    {/* новая страница */}
      </Routes>
    </LectureProvider>
  );
}
