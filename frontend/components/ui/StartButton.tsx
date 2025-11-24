import { Text, TouchableOpacity } from "react-native";

interface StartButtonProps {
  onPress: () => void;
}

export const StartButton = ({ onPress }: StartButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    className="w-full mb-16 bg-blue-600 py-4 rounded-2xl shadow-md active:bg-blue-700"
  >
    <Text className="text-white text-lg font-bold text-center">
      🎯 Começar o Quiz
    </Text>
  </TouchableOpacity>
);
