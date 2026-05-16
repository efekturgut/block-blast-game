import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Game from "./pages/Game";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;