import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import InformationInput from "./pages/Information/InformationInput";
import OtherPartyInformation from "./pages/Information/OtherPartyInformation";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/information" element={<InformationInput />} />
        <Route path="/other-party-information" element={<OtherPartyInformation />} />
      </Routes>
  );
}