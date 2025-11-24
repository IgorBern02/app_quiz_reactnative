import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { OptionButton } from "./OptionButton";
import { Country, Question } from "@/types/types";

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
  if (!question) {
    return <Text>Carregando...</Text>;
  }
  // animações
  const flagOpacity = useRef(new Animated.Value(1)).current;
  const flagScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isChanging) {
      Animated.parallel([
        Animated.timing(flagOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(flagScale, {
          toValue: 0.95,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(flagOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(flagScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isChanging]);

  return (
    <View style={styles.card}>
      {/* Flag container */}
      <View style={styles.flagWrapper}>
        <Animated.Image
          source={{ uri: question.answer.flags.png }}
          style={[
            styles.flag,
            {
              opacity: flagOpacity,
              transform: [{ scale: flagScale }],
            },
          ]}
        />

        {/* Tempo crítico */}
        {timeLeft <= 5 && !isChanging && (
          <View style={styles.timerPing}>
            <Text style={styles.timerPingText}>{timeLeft}</Text>
          </View>
        )}

        {/* Loading */}
        {isChanging && (
          <View style={styles.loadingWrapper}>
            <View style={styles.loader} />
          </View>
        )}
      </View>

      {/* Opções */}
      <View style={styles.optionsGrid}>
        {question.options.map((country, i) => (
          <Animated.View
            key={country.cca3}
            style={[
              styles.optionWrapper,
              {
                opacity: isChanging ? 0 : 1,
                transform: [
                  {
                    translateY: isChanging ? 10 : 0,
                  },
                ],
              },
            ]}
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
        style={[
          styles.feedback,
          {
            opacity: feedback ? 1 : 0,
            transform: [{ scale: feedback ? 1 : 0.95 }],
          },
        ]}
      >
        {feedback}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "100%",
    maxWidth: 350,
    alignItems: "center",
    elevation: 4,
  },

  flagWrapper: {
    width: 256,
    height: 160,
    marginBottom: 24,
    position: "relative",
  },

  flag: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },

  timerPing: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#ef4444",
    width: 32,
    height: 32,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  timerPingText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },

  loadingWrapper: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  loader: {
    width: 32,
    height: 32,
    borderWidth: 4,
    borderColor: "#3b82f6",
    borderTopColor: "transparent",
    borderRadius: 50,
  },

  optionsGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  optionWrapper: {
    width: "48%",
  },

  feedback: {
    marginTop: 16,
    minHeight: 32,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
