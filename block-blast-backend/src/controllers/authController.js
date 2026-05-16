import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Kullanıcı adı, email ve şifre zorunludur.",
      });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Bu kullanıcı adı veya email zaten kullanılıyor.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at
      `,
      [username, email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      user: result.rows[0],
      message: "Kayıt başarılı.",
    });
  } catch (error) {
    console.error("Kayıt hatası:", error.message);

    res.status(500).json({
      success: false,
      message: "Kayıt sırasında hata oluştu.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email ve şifre zorunludur.",
      });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Email veya şifre hatalı.",
      });
    }

    const user = result.rows[0];

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Email veya şifre hatalı.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      message: "Giriş başarılı.",
    });
  } catch (error) {
    console.error("Giriş hatası:", error.message);

    res.status(500).json({
      success: false,
      message: "Giriş sırasında hata oluştu.",
    });
  }
};