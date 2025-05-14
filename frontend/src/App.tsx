import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/ConnectWallet";
import ConnectWallet from "./pages/ConnectWallet";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/connect" element={<ConnectWallet />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
