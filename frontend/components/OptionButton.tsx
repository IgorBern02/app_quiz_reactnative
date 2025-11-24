import { Country } from "@/types/types";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

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
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={() => onPress(country)}
      disabled={disabled}
    >
      <Text style={styles.text}>{country.name.common}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
