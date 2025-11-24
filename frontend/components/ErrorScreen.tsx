import { View, Text, TouchableOpacity } from "react-native";

interface ErrorScreenProps {
  onRetry: () => void;
  message?: string;
}

export const ErrorScreen = ({ onRetry, message }: ErrorScreenProps) => {
  return (
    <View className="flex-1 items-center justify-center p-6 bg-gray-100">
      <View className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm items-center">
        <Text className="text-6xl mb-4">🌍</Text>

        <Text className="text-2xl font-bold text-red-600 mb-4">
          Erro ao Carregar
        </Text>

        <Text className="text-gray-700 mb-2 text-lg text-center">
          {message || "Não foi possível conectar com a API de países."}
        </Text>

        <Text className="text-gray-500 mb-6 text-sm text-center">
          Verifique sua conexão com a internet e tente novamente.
        </Text>

        <TouchableOpacity
          onPress={onRetry}
          className="bg-blue-500 active:bg-blue-600 py-3 px-6 rounded-lg w-full"
        >
          <Text className="text-white text-center font-semibold">
            🔄 Tentar Novamente
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
