import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function NotFound() {
  const bakcToHome = () => {
    router.push("../home");
  };
  return (
    <View className="flex-1 items-center justify-center p-6 bg-gray-100">
      <View className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm items-center">
        <Text className="text-6xl mb-4">❓</Text>
        <Text className="text-2xl font-bold text-red-600 mb-4">
          Página Não Encontrada
        </Text>
        <Text className="text-gray-700 mb-2 text-lg text-center">
          A página que você está procurando não existe.
        </Text>
        <Text className="text-gray-500 mb-6 text-sm text-center">
          Verifique o URL ou volte para a página inicial.
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          bakcToHome();
        }}
        className="bg-blue-500 active:bg-blue-600 py-3 px-6 rounded-lg mt-6"
      >
        <Text className="text-white text-center font-semibold">
          🏠 Voltar para a Página Inicial
        </Text>
      </TouchableOpacity>
    </View>
  );
}
