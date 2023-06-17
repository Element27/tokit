import "./App.css";
import MainTalkComp from "./components/MainTalkComp";
import { Routes, Route } from "react-router-dom";
import TalkDetails from "./components/TalkDetails";
export default function App() {
  return (
    <Routes>
      <Route index element={<MainTalkComp />} />
      <Route path="/:talkId" element={<TalkDetails />} />
    </Routes>
  );
}
