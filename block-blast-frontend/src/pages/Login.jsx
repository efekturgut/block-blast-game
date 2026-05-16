import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(formData.email, formData.password);

    setMessage(result.message);

    if (result.success) {
      setTimeout(() => {
        navigate("/");
      }, 500);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Giriş Yap</h1>
        <p>Skorunu otomatik kaydetmek için giriş yap.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Şifre"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit">Giriş Yap</button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <span className="auth-footer">
          Hesabın yok mu? <Link to="/register">Kayıt ol</Link>
        </span>
      </div>
    </main>
  );
};

export default Login;