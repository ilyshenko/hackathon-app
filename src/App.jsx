import React from "react";
import Work from "./pages/Work";
import { LectureProvider } from "./context/LectureContext";

export default function App() {
  return (
    <LectureProvider>
      <Work />
    </LectureProvider>
  );
}
