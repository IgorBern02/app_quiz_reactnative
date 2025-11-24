import { TouchableOpacity, Text } from "react-native";

interface Props {
  skipsLeft: number;
  disabled: boolean;
  isChanging: boolean;
  onSkip: () => void;
}

export function SkipButton({ skipsLeft, disabled, isChanging, onSkip }: Props) {
  return (
    <TouchableOpacity
      onPress={onSkip}
      disabled={disabled}
      className={`mt-5 px-6 py-3 rounded-xl ${
        !disabled ? "bg-green-500" : "bg-green-500 opacity-50"
      }`}
    >
      <Text className="text-white font-bold text-lg text-center">
        {isChanging
          ? "⏳ Carregando..."
          : `🔄 Pular Bandeira (${skipsLeft} restantes)`}
      </Text>
    </TouchableOpacity>
  );
}
