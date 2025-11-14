import { createContext, useState } from "react";

export const LectureContext = createContext();

export function LectureProvider({ children }) {
  const [lectures, setLectures] = useState([]);
  const [activeLecture, setActiveLecture] = useState(null);

  return (
    <LectureContext.Provider
      value={{ lectures, setLectures, activeLecture, setActiveLecture }}
    >
      {children}
    </LectureContext.Provider>
  );
}
