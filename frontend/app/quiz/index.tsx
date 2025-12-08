import { LoadingScreen } from "@/components/screens/LoadingScreen";
import { ErrorScreen } from "@/components/screens/ErrorScreen";
import { GameOverScreen } from "@/components/screens/GameOverScreen";

import { QuizHeader } from "@/components/quiz/QuizHeader";
import { QuizCard } from "@/components/quiz/QuizCard";
import { SkipButton } from "@/components/quiz/SkipButton";

import { useCountries } from "@/hooks/useCountries";
import { Country, GameStats, Question } from "@/types/types";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";

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

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** ---------------- TIMER ---------------- */
  useEffect(() => {
    if (gameStats.isGameOver || !question || isChanging) return () => {};

    timerRef.current = setInterval(() => {
      setGameStats((prev) =>
        prev.timeLeft <= 1
          ? (clearInterval(timerRef.current!),
            handleTimeOut(),
            { ...prev, timeLeft: 0 })
          : { ...prev, timeLeft: prev.timeLeft - 1 }
      );
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [question, gameStats.isGameOver, isChanging]);

  const handleTimeOut = () => {
    setFeedback("⏰ Tempo esgotado!");
    loseLife();
  };

  /** ---------------- PERDE VIDA ---------------- */
  const loseLife = useCallback(() => {
    setGameStats((prev) => {
      const newLives = prev.lives - 1;

      setTimeout(() => {
        setFeedback("");
        setButtonDisabled(false);
        if (newLives > 0) generateQuestion();
      }, 1200);

      return { ...prev, lives: newLives, isGameOver: newLives <= 0 };
    });
  }, []);

  /** ---------------- NOVA PERGUNTA ---------------- */
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

  /** PRIMEIRA PERGUNTA */
  useEffect(() => {
    if (!loading && countries.length >= 4 && !question)
      generateQuestion(countries);
  }, [loading, countries, question, generateQuestion]);

  /** ---------------- RESPOSTA ---------------- */
  const handleAnswer = (country: Country) => {
    if (!question || isChanging) return;

    setButtonDisabled(true);
    clearInterval(timerRef.current!);

    const isCorrect = country.name.common === question.answer.name.common;

    if (isCorrect) {
      setFeedback("✅ Correto! +1 ponto");
      setGameStats((prev) => ({ ...prev, score: prev.score + 1 }));
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

  /** ---------------- REINICIAR ---------------- */
  const restartGame = () => {
    clearInterval(timerRef.current!);

    setGameStats(INITIAL_STATS);
    setFeedback("");
    setIsChanging(false);
    setSkipsLeft(2);

    if (countries.length >= 4) generateQuestion(countries);
  };

  /** ---------------- TELAS DEPENDENTES DE ESTADO ---------------- */
  if (loading) return <LoadingScreen />;
  if (error || countries.length < 4)
    return <ErrorScreen message={error || "Erro ao carregar países"} />;

  if (gameStats.isGameOver)
    return <GameOverScreen score={gameStats.score} onRestart={restartGame} />;

  return (
    <ScrollView
      className="flex-1 bg-slate-100"
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
      showsVerticalScrollIndicator={false}
    >
      {question ? (
        <>
          <QuizHeader
            lives={gameStats.lives}
            score={gameStats.score}
            timeLeft={gameStats.timeLeft}
          />

          <QuizCard
            question={question!}
            onAnswer={handleAnswer}
            feedback={feedback}
            score={gameStats.score}
            isChanging={isChanging}
            timeLeft={gameStats.timeLeft}
            disabled={buttonDisabled}
          />

          <SkipButton
            skipsLeft={skipsLeft}
            disabled={isChanging || gameStats.isGameOver || skipsLeft <= 0}
            isChanging={isChanging}
            onSkip={() => {
              generateQuestion();
              setSkipsLeft((prev) => prev - 1);
            }}
          />
        </>
      ) : (
        <Text>Carregando...</Text>
      )}
    </ScrollView>
  );
}
