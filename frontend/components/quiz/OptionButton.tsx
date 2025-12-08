import { Country } from "@/types/types";
import { TouchableOpacity, Text } from "react-native";

interface OptionButtonProps {
  country: Country;
  onPress: (country: Country) => void;
  disabled?: boolean;
}

export function OptionButton({
  country,
  onPress,
  disabled,
}: OptionButtonProps) {
  return (
    <TouchableOpacity
      className={`
        bg-gray-100 
        p-3
          
        rounded-xl 
        border border-gray-300 
        items-center
        ${disabled ? "opacity-50" : ""}
      `}
      onPress={() => onPress(country)}
      disabled={disabled}
    >
      <Text className="text-lg font-semibold">{country.name.common}</Text>
    </TouchableOpacity>
  );
}
