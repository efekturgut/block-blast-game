import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
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

    const result = await register(
      formData.username,
      formData.email,
      formData.password
    );

    setMessage(result.message);

    if (result.success) {
      setTimeout(() => {
        navigate("/login");
      }, 800);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Kayıt Ol</h1>
        <p>Skorunu kaydetmek için hesap oluştur.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="username"
            placeholder="Kullanıcı adı"
            value={formData.username}
            onChange={handleChange}
          />

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

          <button type="submit">Kayıt Ol</button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <span className="auth-footer">
          Hesabın var mı? <Link to="/login">Giriş yap</Link>
        </span>
      </div>
    </main>
  );
};

export default Register;