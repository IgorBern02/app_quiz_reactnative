import { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

export const GameOverScreen = ({ score, onRestart }: GameOverScreenProps) => {
  const router = useRouter();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const sendScore = async () => {
      try {
        const name = "Jogador"; // ajuste se usar AsyncStorage
        await fetch(`${API_URL}/api/scores`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, score }),
        });
      } catch (err) {
        console.error("Erro ao enviar pontuação:", err);
      }
    };

    sendScore();
  }, [score]);

  return (
    <View className="flex-1 bg-slate-100 items-center justify-center p-6">
      <View className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-sm items-center animate-fade-in">
        {/* Ícone animado */}
        <Text className="text-8xl mb-6 animate-bounce">🎮</Text>

        <Text className="text-4xl font-bold text-red-600 mb-4 animate-pulse">
          Fim de Jogo!
        </Text>

        {/* Card da pontuação */}
        <View className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 mb-6 w-full">
          <Text className="text-2xl font-semibold text-white mb-2 text-center">
            Sua Pontuação Final
          </Text>

          <Text className="text-5xl font-bold text-white text-center animate-pulse">
            {score}
          </Text>

          <Text className="text-white text-sm opacity-90 mt-2 text-center">
            {score >= 10
              ? "🏆 Excelente!"
              : score >= 5
                ? "👍 Bom trabalho!"
                : "💪 Continue praticando!"}
          </Text>
        </View>

        {/* Botões */}
        <View className="w-full space-y-4">
          <TouchableOpacity
            onPress={onRestart}
            className="w-full bg-green-500 p-4 rounded-xl items-center shadow-lg
                       active:scale-95"
          >
            <Text className="text-white font-bold text-lg">
              🔄 Jogar Novamente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/")}
            className="w-full bg-red-500 p-4 rounded-xl items-center shadow-lg
                       active:scale-95"
          >
            <Text className="text-white font-bold text-lg">
              Voltar para o início
            </Text>
          </TouchableOpacity>

          {/* Dicas */}
          <View className="bg-gray-100 p-3 rounded-lg">
            <Text className="text-gray-600 text-center">
              💡 Dica: Tente ser mais rápido nas próximas!
            </Text>
            <Text className="text-gray-600 text-center">
              🎯 Objetivo: Bata seu recorde de {score} pontos!
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
