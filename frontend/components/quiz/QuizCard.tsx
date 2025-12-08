import React, { useRef, useEffect } from "react";
import { View, Text, Image, Animated } from "react-native";
import { OptionButton } from "./OptionButton";
import { Country, Question } from "@/types/types";

// Animated Image
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

  // animações da flag
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
  }, [isChanging, flagOpacity, flagScale]);

  // animação para o container das opções (um único Animated.Value)
  const optionsAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(optionsAnim, {
      toValue: isChanging ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isChanging, optionsAnim]);

  const optionsOpacity = optionsAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const optionsTranslate = optionsAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8],
  });

  // ====== NOVA ANIMAÇÃO: feedback ======
  //  feedbackAnim: 0 -> escondido, 1 -> visível
  const feedbackAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // se feedback for string vazia -> anima para 0
    if (!feedback) {
      Animated.timing(feedbackAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }).start();
      return;
    }

    // feedback apareceu -> anima in, espera, anima out
    Animated.sequence([
      Animated.timing(feedbackAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(900),
      Animated.timing(feedbackAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    // se o feedback mudar rapidamente, a sequência será reiniciada
  }, [feedback, feedbackAnim]);

  const feedbackOpacity = feedbackAnim;
  const feedbackScale = feedbackAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  });

  // flag uri (garanta preferir png)
  const flagUri = question.answer.flags?.png ?? question.answer.flags?.svg;

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
            resizeMode="cover"
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
            {/* Spinner simples: pode ser substituído por uma Animated.View rotativa */}
            <View className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </View>
        )}
      </View>

      {/* Opções — container animado único */}
      <Animated.View
        style={{
          width: "100%",
          opacity: optionsOpacity,
          transform: [{ translateY: optionsTranslate }],
        }}
      >
        <View className="w-full flex-col items-center gap-5">
          {question.options.map((country) => (
            <OptionButton
              key={country.cca3}
              country={country}
              onPress={onAnswer}
              disabled={isChanging || disabled}
            />
          ))}
        </View>
      </Animated.View>

      {/* Feedback animado */}
      <Animated.Text
        style={{
          marginTop: 16,
          minHeight: 32,
          fontSize: 18,
          fontWeight: "600",
          textAlign: "center",
          opacity: feedbackOpacity,
          transform: [{ scale: feedbackScale }],
        }}
        accessibilityLiveRegion="polite"
      >
        {feedback}
      </Animated.Text>
    </View>
  );
}
