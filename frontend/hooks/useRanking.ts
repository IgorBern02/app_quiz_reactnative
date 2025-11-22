import { useEffect, useState } from "react";

export const useRanking = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await fetch(`${API_URL}/api/scores`);
        const data = await res.json();
        setScores(data);
      } catch (err) {
        console.error("Erro ao carregar ranking:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  return { scores, loading };
};
