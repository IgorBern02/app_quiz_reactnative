import { useEffect, useState } from "react";
import { API_URL } from "../utils/env";

export const useRanking = () => {
  const [scores, setScores] = useState<{ name: string; score: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/scores`);
        const data = await res.json();
        setScores(data);
      } catch (err) {
        console.log("Erro ranking:", err);
        setScores([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { scores, loading };
};
