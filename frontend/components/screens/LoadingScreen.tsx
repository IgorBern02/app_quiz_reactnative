import { MotiView } from "moti";
import { Text, View } from "react-native";

export const LoadingScreen = () => {
  return (
    <View className="flex-1 items-center justify-center p-6 bg-gray-100">
      <View className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm items-center">
        <Text className="text-6xl mb-4">🌍</Text>
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Carregando Bandeiras
        </Text>

        {/* Spinner improvisado */}
        <MotiView
          from={{ rotate: "0deg" }}
          animate={{ rotate: "360deg" }}
          transition={{
            loop: true,
            repeatReverse: false,
            duration: 800,
            type: "timing",
          }}
          style={{
            width: 48,
            height: 48,
            borderWidth: 4,
            borderColor: "#3b82f6",
            borderTopColor: "transparent",
            borderRadius: 999,
            marginTop: 12,
          }}
        />

        {/* Pontinhos */}
        <View className="flex flex-row space-x-1 mt-6">
          {[0, 150, 300].map((delay, i) => (
            <MotiView
              key={i}
              from={{ translateY: 0 }}
              animate={{ translateY: -6 }}
              transition={{
                delay,
                loop: true,
                repeatReverse: true,
                duration: 300,
              }}
              className="w-2 h-2 bg-blue-500 rounded-full"
            />
          ))}
        </View>
      </View>
    </View>
  );
};
