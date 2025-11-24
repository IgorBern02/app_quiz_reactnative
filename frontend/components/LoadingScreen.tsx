import { View, Text } from "react-native";

export const LoadingScreen = () => {
  return (
    <View className="flex-1 items-center justify-center p-6 bg-gray-100">
      <View className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm items-center animate-pulse">
        {/* Emoji animado */}
        <Text className="text-6xl mb-4 animate-bounce">🌍</Text>

        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Carregando Bandeiras
        </Text>

        <Text className="text-gray-600 mb-4 animate-pulse text-center">
          Conectando com a API de países...
        </Text>

        {/* Spinner */}
        <View className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />

        {/* Loading dots */}
        <View className="flex flex-row justify-center space-x-1 mt-4">
          <View className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />

          <View
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          />

          <View
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
        </View>
      </View>
    </View>
  );
};
