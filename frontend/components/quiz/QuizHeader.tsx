import { View, Text } from "react-native";

interface Props {
  lives: number;
  score: number;
  timeLeft: number;
}

export function QuizHeader({ lives, score, timeLeft }: Props) {
  return (
    <View className="w-full max-w-md mb-5">
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
                    i < lives ? "bg-red-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </View>
          </View>

          {/* PONTOS */}
          <Text className="text-lg font-semibold">
            Pontos: <Text className="text-blue-600">{score}</Text>
          </Text>
        </View>

        {/* BARRA DE TEMPO */}
        <View className="w-full bg-gray-300 rounded-full h-2">
          <View
            className="h-2 rounded-full"
            style={{
              width: `${(timeLeft / 15) * 100}%`,
              backgroundColor:
                timeLeft > 7 ? "#22c55e" : timeLeft > 3 ? "#eab308" : "#ef4444",
            }}
          />
        </View>

        <Text className="text-sm text-center mt-1 text-slate-600">
          ⏰ {timeLeft}s
        </Text>
      </View>
    </View>
  );
}
