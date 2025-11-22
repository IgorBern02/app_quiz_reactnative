import { Text, View } from "react-native";

export const Header: React.FC = () => {
  return (
    <View className="w-full bg-blue-100 py-10 rounded-b-3xl">
      <Text className="text-4xl font-extrabold text-center text-gray-800 leading-tight">
        Bem-vindo ao <Text className="text-blue-600">Quiz de Bandeiras!</Text>
      </Text>
    </View>
  );
};
