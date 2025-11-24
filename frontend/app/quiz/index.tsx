import { LoadingScreen } from "@/components/LoadingScreen";
import { QuizCard } from "@/components/QuizCard";
import { useCountries } from "@/hooks/useCountries";
import { Country, GameStats, Question } from "@/types/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ErrorScreen } from "@/components/ErrorScreen";
import { GameOverScreen } from "@/components/GameOverScreen";

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

  // timerRef tipado corretamente para setInterval
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasSaved = useRef(false);

  // TIMER: observe que retornamos SEMPRE uma função de limpeza (cleanup),
  // mesmo no early-exit, para satisfazer EffectCallback do TS.
  useEffect(() => {
    if (gameStats.isGameOver || !question || isChanging) {
      // retorna um cleanup vazio válido
      return () => {};
    }

    timerRef.current = setInterval(() => {
      setGameStats((prev) => {
        if (prev.timeLeft <= 1) {
          // limpa o intervalo antes de processar timeout
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          handleTimeOut();
          return { ...prev, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // note: handleTimeOut e loseLife não estão no array de deps porque
    // são declaradas abaixo (funções com closures controladas). Se você
    // preferir, mova-as para useCallback com deps explícitas.
  }, [question, gameStats.isGameOver, isChanging]);

  const handleTimeOut = () => {
    setFeedback("⏰ Tempo esgotado!");
    loseLife();
  };

  // loseLife refatorado para não depender de gameStats (evita stale closure)
  const loseLife = useCallback(() => {
    setGameStats((prev) => {
      const newLives = prev.lives - 1;
      const isOver = newLives <= 0;
      // programamos o comportamento pós-perda usando newLives (valor calculado)
      setTimeout(() => {
        setFeedback("");
        setButtonDisabled(false);
        if (!isOver) {
          // gera próxima pergunta apenas se ainda houver vidas
          generateQuestion();
        }
      }, 1200);

      return { ...prev, lives: newLives, isGameOver: isOver };
    });
    // dependências vazias porque usamos setGameStats com updater
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const isCorrect = country.name.common === question.answer.name.common;

    if (isCorrect) {
      setGameStats((prev) => ({ ...prev, score: prev.score + 1 }));
      setFeedback("✅ Correto! +1 ponto");
    } else {
      setFeedback(`❌ Errado! Era ${question.answer.name.common}`);
      loseLife();
    }

    setTimeout(() => {
      // usamos o estado atual de gameStats somente para checar isGameOver
      if (!gameStats.isGameOver && (isCorrect || gameStats.lives > 1)) {
        generateQuestion();
      }
      setButtonDisabled(false);
    }, 1000);
  };

  const restartGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    hasSaved.current = false;
    setGameStats(INITIAL_STATS);
    setFeedback("");
    setIsChanging(false);

    if (countries.length >= 4) generateQuestion(countries);
  };

  const handleRetry = () => {
    // no RN você provavelmente usaria navigation; aqui mantive reload para web compat.
    // substitua se necessário (expo-router/navigation).
    window?.location?.reload?.();
  };

  // Telas de estado
  if (loading) return <LoadingScreen />;
  if (error || countries.length < 4)
    return (
      <ErrorScreen
        onRetry={handleRetry}
        message={error || "Não foi possível carregar países suficientes da API"}
      />
    );
  if (gameStats.isGameOver)
    return <GameOverScreen score={gameStats.score} onRestart={restartGame} />;
  if (!question) return <LoadingScreen />;

  return (
    <View className="flex-1 bg-slate-100 p-6 items-center justify-center">
      {/* HEADER */}
      <View className="w-full max-w-md mb-5">
        <Text className="text-3xl font-bold text-center mb-4">
          🌍 Adivinhe a Bandeira
        </Text>

        <View className="bg-white p-4 rounded-2xl shadow-md">
          <View className="flex-row justify-between mb-3">
            {/* VIDAS */}
            <View className="flex-row items-center">
              <Text className="text-lg font-semibold mr-2">Vidas:</Text>

              <View className="flex-row">
                {[...Array(3)].map((_, i) => (
                  <View
                    key={i}
                    className={`w-[22px] h-[22px] rounded-full mx-1 ${
                      i < gameStats.lives ? "bg-red-500" : "bg-gray-300"
                    }`}
                  />
                ))}
              </View>
            </View>

            {/* PONTOS */}
            <Text className="text-lg font-semibold">
              Pontos: <Text className="text-blue-600">{gameStats.score}</Text>
            </Text>
          </View>

          {/* Barra de tempo */}
          <View className="w-full bg-gray-300 rounded-full h-2">
            <View
              className="h-2 rounded-full"
              style={{
                width: `${(gameStats.timeLeft / 15) * 100}%`,
                backgroundColor:
                  gameStats.timeLeft > 7
                    ? "#22c55e"
                    : gameStats.timeLeft > 3
                      ? "#eab308"
                      : "#ef4444",
              }}
            />
          </View>

          <Text className="text-sm text-center mt-1 text-slate-600">
            ⏰ {gameStats.timeLeft}s
          </Text>
        </View>
      </View>

      {/* QUIZ CARD */}
      <QuizCard
        question={question}
        onAnswer={handleAnswer}
        feedback={feedback}
        score={gameStats.score}
        isChanging={isChanging}
        timeLeft={gameStats.timeLeft}
        disabled={buttonDisabled}
      />

      {/* BOTÃO DE PULAR */}
      <TouchableOpacity
        onPress={() => {
          generateQuestion();
          setSkipsLeft((prev) => prev - 1);
        }}
        disabled={isChanging || gameStats.isGameOver || skipsLeft <= 0}
        className={`mt-5 px-6 py-3 rounded-xl ${
          skipsLeft > 0 && !isChanging && !gameStats.isGameOver
            ? "bg-green-500"
            : "bg-green-500 opacity-50"
        }`}
      >
        <Text className="text-white font-bold text-lg text-center">
          {isChanging
            ? "⏳ Carregando..."
            : `🔄 Pular Bandeira (${skipsLeft} restantes)`}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
