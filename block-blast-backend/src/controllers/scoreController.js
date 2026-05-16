import pool from "../config/db.js";

export const getScores = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id,
        s.score,
        s.created_at,
        u.username
      FROM scores s
      JOIN users u ON u.id = s.user_id
      ORDER BY s.score DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      scores: result.rows,
    });
  } catch (error) {
    console.error("Skorlar alınamadı:", error.message);

    res.status(500).json({
      success: false,
      message: "Skorlar alınamadı.",
    });
  }
};

export const createScore = async (req, res) => {
  try {
    const { score } = req.body;
    const userId = req.user.id;

    if (score === undefined) {
      return res.status(400).json({
        success: false,
        message: "Skor zorunludur.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO scores (user_id, player_name, score)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [userId, req.user.username, score]
    );

    res.status(201).json({
      success: true,
      score: result.rows[0],
    });
  } catch (error) {
    console.error("Skor kaydedilemedi:", error.message);

    res.status(500).json({
      success: false,
      message: "Skor kaydedilemedi.",
    });
  }
};