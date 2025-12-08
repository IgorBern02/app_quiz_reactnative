import React, { useRef, useEffect } from "react";
import { View, Text, Image, Animated } from "react-native";
import { OptionButton } from "./OptionButton";
import { Country, Question } from "@/types/types";

// Criando AnimatedImage corretamente
const AnimatedImage = Animated.createAnimatedComponent(Image);

interface QuizCardProps {
  question: Question | null;
  onAnswer: (country: Country) => void;
  feedback: string;
  score: number;
  isChanging: boolean;
  timeLeft: number;
  disabled?: boolean;
}

export function QuizCard({
  question,
  onAnswer,
  feedback,
  isChanging,
  timeLeft,
  disabled,
}: QuizCardProps) {
  if (!question) return <Text>Carregando...</Text>;
  if (!question.answer || !question.options) return null;

  // animações
  const flagOpacity = useRef(new Animated.Value(1)).current;
  const flagScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(flagOpacity, {
        toValue: isChanging ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(flagScale, {
        toValue: isChanging ? 0.95 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isChanging]);

  const flagUri =
    question.answer.flags?.png ??
    question.answer.flags?.svg?.replace(".svg", ".png");

  return (
    <View className="bg-white p-5 rounded-2xl w-full max-w-[350px] items-center shadow-md">
      {/* Flag container */}
      <View className="w-56 h-36 mb-4 relative">
        {flagUri ? (
          <AnimatedImage
            source={{ uri: flagUri }}
            style={{
              opacity: flagOpacity,
              transform: [{ scale: flagScale }],
              width: "100%",
              height: "100%",
              borderRadius: 8,
            }}
          />
        ) : (
          <View className="w-full h-full bg-gray-200 rounded-lg items-center justify-center">
            <Text>Imagem indisponível</Text>
          </View>
        )}

        {/* Tempo crítico */}
        {timeLeft <= 5 && !isChanging && (
          <View className="absolute -top-2 -right-2 bg-red-500 w-8 h-8 rounded-full items-center justify-center">
            <Text className="text-white font-bold text-xs">{timeLeft}</Text>
          </View>
        )}

        {/* Loading */}
        {isChanging && (
          <View className="absolute inset-0 items-center justify-center">
            <View className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </View>
        )}
      </View>

      {/* Opções */}
      <View className="w-full flex-col items-center gap-5">
        {question.options.map((country) => (
          <Animated.View
            key={country.cca3}
            style={{
              width: "100%",
              opacity: isChanging ? 0 : 1,
              transform: [{ translateY: isChanging ? 10 : 0 }],
            }}
          >
            <OptionButton
              country={country}
              onPress={onAnswer}
              disabled={isChanging || disabled}
            />
          </Animated.View>
        ))}
      </View>

      {/* Feedback */}
      <Animated.Text
        style={{
          marginTop: 16,
          minHeight: 32,
          fontSize: 18,
          fontWeight: "600",
          textAlign: "center",
          opacity: feedback ? 1 : 0,
          transform: [{ scale: feedback ? 1 : 0.95 }],
        }}
      >
        {feedback}
      </Animated.Text>
    </View>
  );
}
