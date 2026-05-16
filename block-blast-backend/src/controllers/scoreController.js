import pool from "../config/db.js";

export const getScores = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, player_name, score, created_at
      FROM scores
      ORDER BY score DESC
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
    const { playerName, score } = req.body;

    if (!playerName || score === undefined) {
      return res.status(400).json({
        success: false,
        message: "Oyuncu adı ve skor zorunludur.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO scores (player_name, score)
      VALUES ($1, $2)
      RETURNING id, player_name, score, created_at
      `,
      [playerName, score]
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