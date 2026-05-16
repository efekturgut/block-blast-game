import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Block Blast
      </Link>

      <div className="navbar-links">
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