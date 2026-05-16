import axios from "axios";

const API_URL = "http://localhost:5000/api/scores";

export const saveScore = async (playerName, score) => {
  const response = await axios.post(API_URL, {
    playerName,
    score,
  });

  return response.data;
};

export const getScores = async () => {
  const response = await axios.get(API_URL);

  return response.data;
};