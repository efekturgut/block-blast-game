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
    const username = req.user.username;

    if (score === undefined) {
      return res.status(400).json({
        success: false,
        message: "Skor zorunludur.",
      });
    }

    const existingScore = await pool.query(
      `
      SELECT score
      FROM scores
      WHERE user_id = $1
      `,
      [userId]
    );

    const oldScore = existingScore.rows[0]?.score || 0;
    const isNewHighScore = score > oldScore;

    const result = await pool.query(
      `
      INSERT INTO scores (user_id, player_name, score)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id)
      DO UPDATE SET
        score = CASE
          WHEN EXCLUDED.score > scores.score THEN EXCLUDED.score
          ELSE scores.score
        END,
        player_name = EXCLUDED.player_name,
        created_at = CASE
          WHEN EXCLUDED.score > scores.score THEN CURRENT_TIMESTAMP
          ELSE scores.created_at
        END
      RETURNING *
      `,
      [userId, username, score]
    );

    res.status(201).json({
      success: true,
      isNewHighScore,
      message: isNewHighScore
        ? "Yeni en yüksek skor kaydedildi."
        : "Mevcut en yüksek skorun daha yüksek olduğu için korunuyor.",
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