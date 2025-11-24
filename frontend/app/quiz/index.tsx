import { QuizCard } from "@/components/QuizCard";
import { useCountries } from "@/hooks/useCountries";
import { Country, GameStats, Question } from "@/types/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const INITIAL_STATS: GameStats = {
  score: 0,
  lives: 3,
  timeLeft: 15,
  isGameOver: false,
};

export default function QuizScreen() {
  const { countries, loading, error } = useCountries();
  const [question, setQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>(INITIAL_STATS);
  const [skipsLeft, setSkipsLeft] = useState(2);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const timerRef = useRef<number | null>(null);
  const hasSaved = useRef(false); // 🔒 evita salvar múltiplas vezes

  // Efeito do temporizador
  useEffect(() => {
    if (gameStats.isGameOver || !question || isChanging) return;

    timerRef.current = window.setInterval(() => {
      setGameStats((prev) => {
        if (prev.timeLeft <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeOut();
          return { ...prev, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [question, gameStats.isGameOver, isChanging]);

  const handleTimeOut = () => {
    setFeedback("⏰ Tempo esgotado!");
    loseLife();
  };

  const loseLife = useCallback(() => {
    setGameStats((prev) => {
      const newLives = prev.lives - 1;
      return { ...prev, lives: newLives, isGameOver: newLives <= 0 };
    });

    setTimeout(() => {
      setFeedback("");
      setButtonDisabled(false);
      if (gameStats.lives > 1) generateQuestion();
    }, 1200);
  }, [gameStats.lives]);

  const generateQuestion = useCallback(
    (data: Country[] = countries) => {
      if (!data || data.length < 4 || gameStats.isGameOver) return;

      setIsChanging(true);
      setGameStats((prev) => ({ ...prev, timeLeft: 15 }));

      setTimeout(() => {
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        const options = shuffled.slice(0, 4);
        const answer = options[Math.floor(Math.random() * options.length)];

        setQuestion({ options, answer });
        setFeedback("");
        setIsChanging(false);
      }, 300);
    },
    [countries, gameStats.isGameOver]
  );

  // Gera a primeira pergunta assim que os países carregam
  useEffect(() => {
    if (
      !loading &&
      countries.length >= 4 &&
      !question &&
      !gameStats.isGameOver
    ) {
      generateQuestion(countries);
    }
  }, [loading, countries, question, gameStats.isGameOver, generateQuestion]);

  const handleAnswer = (country: Country) => {
    if (!question || isChanging || gameStats.isGameOver) return;
    setButtonDisabled(true);

    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = country.name.common === question.answer.name.common;

    if (isCorrect) {
      setGameStats((prev) => ({ ...prev, score: prev.score + 1 }));
      setFeedback("✅ Correto! +1 ponto");
    } else {
      setFeedback(`❌ Errado! Era ${question.answer.name.common}`);
      loseLife();
    }

    setTimeout(() => {
      if (!gameStats.isGameOver && (isCorrect || gameStats.lives > 1)) {
        generateQuestion();
      }
      setButtonDisabled(false);
    }, 1000);
  };

  const restartGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    hasSaved.current = false; // 🔄 permite salvar novamente no novo jogo
    setGameStats(INITIAL_STATS);
    setFeedback("");
    setIsChanging(false);

    if (countries.length >= 4) generateQuestion(countries);
  };

  const handleRetry = () => window.location.reload();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <Text style={styles.title}>🌍 Adivinhe a Bandeira</Text>

        <View style={styles.statsCard}>
          <View style={styles.rowBetween}>
            {/* Vidas */}
            <View style={styles.rowCenter}>
              <Text style={styles.label}>Vidas:</Text>

              <View style={styles.rowCenter}>
                {[...Array(3)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.lifeDot,
                      i < gameStats.lives
                        ? styles.lifeActive
                        : styles.lifeInactive,
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Pontos */}
            <Text style={styles.scoreText}>
              Pontos: <Text style={styles.scoreValue}>{gameStats.score}</Text>
            </Text>
          </View>

          {/* Barra de tempo */}
          <View style={styles.timeBarBackground}>
            <View
              style={[
                styles.timeBarFill,
                {
                  width: `${(gameStats.timeLeft / 15) * 100}%`,
                  backgroundColor:
                    gameStats.timeLeft > 7
                      ? "#22c55e"
                      : gameStats.timeLeft > 3
                        ? "#eab308"
                        : "#ef4444",
                },
              ]}
            />
          </View>

          <Text style={styles.timeText}>⏰ {gameStats.timeLeft}s</Text>
        </View>
      </View>

      {/* Componente de pergunta */}
      <QuizCard
        question={question}
        onAnswer={handleAnswer}
        feedback={feedback}
        score={gameStats.score}
        isChanging={isChanging}
        timeLeft={gameStats.timeLeft}
        disabled={buttonDisabled}
      />

      {/* Botão de pular */}
      <TouchableOpacity
        onPress={() => {
          generateQuestion();
          setSkipsLeft((prev) => prev - 1);
        }}
        disabled={isChanging || gameStats.isGameOver || skipsLeft <= 0}
        style={[
          styles.skipButton,
          (isChanging || gameStats.isGameOver || skipsLeft <= 0) &&
            styles.skipButtonDisabled,
        ]}
      >
        <Text style={styles.skipButtonText}>
          {isChanging
            ? "⏳ Carregando..."
            : `🔄 Pular Bandeira (${skipsLeft} restantes)`}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  headerWrapper: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },

  statsCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    elevation: 4,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },

  label: {
    fontSize: 18,
    fontWeight: "600",
    marginRight: 6,
  },

  lifeDot: {
    width: 22,
    height: 22,
    marginHorizontal: 2,
    borderRadius: 50,
  },

  lifeActive: {
    backgroundColor: "#ef4444",
  },

  lifeInactive: {
    backgroundColor: "#d1d5db",
  },

  scoreText: {
    fontSize: 18,
    fontWeight: "600",
  },

  scoreValue: {
    color: "#2563eb",
  },

  timeBarBackground: {
    width: "100%",
    backgroundColor: "#e5e7eb",
    borderRadius: 20,
    height: 10,
  },

  timeBarFill: {
    height: 10,
    borderRadius: 20,
  },

  timeText: {
    marginTop: 4,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
  },

  skipButton: {
    marginTop: 20,
    backgroundColor: "#22c55e",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },

  skipButtonDisabled: {
    opacity: 0.5,
  },

  skipButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
