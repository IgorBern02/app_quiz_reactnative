import { Text, View } from "react-native";

export const Ranking = () => {
  return (
    <View className="w-full mt-8 p-6">
      <Text className="text-lg font-bold text-gray-800 text-center mb-3">
        🏆 Tabela de Pontuação
      </Text>

      {/* {loading ? (
                    <ActivityIndicator size="large" color="#2563eb" />
                  ) : scores.length === 0 ? (
                    <Text className="text-center text-gray-500">
                      Nenhuma pontuação ainda 😅
                    </Text>
                  ) : (
                    <View className="bg-gray-100 rounded-xl p-2">
                      <FlatList
                        data={scores.sort((a, b) => b.score - a.score).slice(0, 3)}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item, index }) => {
                          const medal = ["🥇", "🥈", "🥉"][index];
        
                          return (
                            <View className="flex-row justify-between p-4 bg-white rounded-xl my-1">
                              <Text className="font-bold">{medal}</Text>
                              <Text className="font-semibold">{item.name}</Text>
                              <Text className="font-bold text-blue-600">
                                {item.score}
                              </Text>
                            </View>
                          );
                        }}
                      />
                    </View>
                  )} */}
    </View>
  );
};
