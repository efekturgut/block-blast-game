import { useEffect, useState } from "react";
import { getScores } from "../services/scoreService";

const Leaderboard = ({ refreshKey }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = async () => {
    try {
      const data = await getScores();
      setScores(data.scores || []);
    } catch (error) {
      console.error("Liderlik tablosu alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, [refreshKey]);

  return (
    <aside className="leaderboard-card">
      <div className="leaderboard-header">
        <span>🏆</span>
        <div>
          <h2>Liderlik Tablosu</h2>
          <p>En yüksek skorlar</p>
        </div>
      </div>

      {loading ? (
        <p className="leaderboard-empty">Yükleniyor...</p>
      ) : scores.length === 0 ? (
        <p className="leaderboard-empty">Henüz skor yok.</p>
      ) : (
        <div className="leaderboard-list">
          {scores.map((item, index) => (
            <div className="leaderboard-item" key={item.id}>
              <span className={`leaderboard-rank rank-${index + 1}`}>
                {index + 1}
              </span>

              <div className="leaderboard-user">
                <strong>{item.username || item.player_name || "Oyuncu"}</strong>
                <small>
                  {new Date(item.created_at).toLocaleDateString("tr-TR")}
                </small>
              </div>

              <span className="leaderboard-score">{item.score}</span>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

export default Leaderboard;