import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import InformationInput from "./pages/Information/InformationInput";
import OtherPartyInformation from "./pages/Information/OtherPartyInformation";
import MyPage from "./pages/MyPage/MyPage";
import Home from "./pages/Home/Home";
import SplashScreen from "./pages/SplashScreen/SplashScreen";
import CompatibilityResult from "./pages/result/CompatibilityResult";
import SpousePage from "./pages/spousePage";
import FriendResult from "./pages/friendResult";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/splash" replace />} />
        <Route path="/splash" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/information" element={<InformationInput />} />
        <Route path="/other-party-information" element={<OtherPartyInformation />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/result" element={<CompatibilityResult />} />
        {/* Home.jsx에서 사용하는 경로들 */}
        <Route path="/future-partner" element={<SpousePage />} />
        <Route path="/similar-friend" element={<FriendResult />} />
        <Route path="/compat" element={<Navigate to="/information?type=3" replace />} />
        <Route path="/today" element={<Home />} />
      </Routes>
  );
}