import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getSoundEnabled, setSoundEnabled } from "../utils/soundEffects";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isSoundOn, setIsSoundOn] = useState(getSoundEnabled());

  const handleToggleSound = () => {
    const newValue = !isSoundOn;

    setIsSoundOn(newValue);
    setSoundEnabled(newValue);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="logo-icon">🧩</span>
        Block Blast
      </Link>

      <div className="navbar-links">
        <Link to="/" className="navbar-link">
          Oyna
        </Link>

        <button className="sound-toggle-btn" onClick={handleToggleSound}>
          {isSoundOn ? "🔊 Ses Açık" : "🔇 Ses Kapalı"}
        </button>

        {isAuthenticated ? (
          <>
            <span className="navbar-user">Merhaba, {user.username}</span>

            <button className="navbar-btn" onClick={logout}>
              Çıkış Yap
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">
              Giriş Yap
            </Link>

            <Link to="/register" className="navbar-btn">
              Kayıt Ol
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;