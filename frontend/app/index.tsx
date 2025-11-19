import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
} from "react-native";
import { router } from "expo-router";

const HomeScreen = () => {
  const [name, setName] = useState("");
  const [scores, setScores] = useState<{ name: string; score: number }[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  // Buscar ranking
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await fetch(`${API_URL}/api/scores`);
        const data = await res.json();
        setScores(data);
      } catch (err) {
        console.error("Erro ao carregar ranking:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

  const handleStart = () => {
    if (!name.trim()) {
      setWarning("⚠️ Digite seu nome antes de começar!");
      setTimeout(() => setWarning(""), 3000);
      return;
    }
    setShowModal(true);
  };

  const confirmStart = () => {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("currentPlayer", name);
      }
    } catch {}

    setShowModal(false);
    router.push("/quiz");
  };

  return (
    <View className="flex-1 bg-blue-50 p-6 items-center justify-center">
      {/* MODAL NATIVO */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 bg-black/40 items-center justify-center px-6">
          <View className="bg-white p-8 rounded-2xl w-full max-w-sm items-center">
            <Text className="text-2xl font-bold text-gray-800 mb-3">
              Pronto para começar?
            </Text>

            <Text className="text-gray-600 mb-6 text-center">
              Você vai jogar como{" "}
              <Text className="font-semibold text-blue-600">{name}</Text>
            </Text>

            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <Text className="text-gray-600">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmStart}
                className="px-4 py-2 bg-blue-600 rounded-lg"
              >
                <Text className="text-white font-semibold">Começar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* CONTEÚDO PRINCIPAL */}
      <View className="bg-white/90 p-8 rounded-3xl w-full max-w-md shadow-2xl items-center gap-8">
        <View>
          <Text className="text-3xl font-extrabold text-gray-800 text-center">
            Bem-vindo ao{" "}
            <Text className="text-blue-600">Quiz de Bandeiras!</Text>
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            Teste seus conhecimentos sobre bandeiras do mundo 🌎
          </Text>
        </View>

        {/* Campo de nome */}
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Digite seu nome"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />

        {/* Tabela de Pontuação */}
        <View className="w-full">
          <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
            🏆 Tabela de Pontuação
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#2563eb" />
          ) : scores.length === 0 ? (
            <Text className="text-center text-gray-500">
              Nenhuma pontuação ainda 😅
            </Text>
          ) : (
            <View className="bg-white rounded-xl shadow-md overflow-hidden">
              <FlatList
                data={scores.sort((a, b) => b.score - a.score).slice(0, 3)}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item, index }) => {
                  const medal = ["🥇", "🥈", "🥉"][index];
                  const color =
                    index === 0
                      ? "text-yellow-500"
                      : index === 1
                        ? "text-gray-400"
                        : "text-orange-600";

                  return (
                    <View className={`flex-row justify-between p-4 ${color}`}>
                      <Text className="font-semibold">
                        {medal} {index + 1}º Lugar
                      </Text>
                      <Text className="font-medium">{item.name}</Text>
                      <Text className="font-bold">{item.score}</Text>
                    </View>
                  );
                }}
              />
            </View>
          )}
        </View>

        {/* Aviso */}
        {warning.length > 0 && (
          <Text className="text-red-500 font-medium">{warning}</Text>
        )}

        {/* Botão iniciar */}
        <TouchableOpacity
          onPress={handleStart}
          className="bg-blue-600 px-6 py-3 rounded-xl shadow-md"
        >
          <Text className="text-white text-lg font-bold">
            🎯 Começar o Quiz
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
