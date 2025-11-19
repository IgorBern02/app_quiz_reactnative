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
    <View className="flex-1 bg-blue-50 items-center justify-center px-6 py-10">
      {/* MODAL */}
      <Modal visible={showModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white w-full max-w-sm p-8 rounded-2xl shadow-xl items-center">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              Vamos começar!
            </Text>

            <Text className="text-gray-600 mb-6 text-center">
              Jogando como{" "}
              <Text className="text-blue-600 font-semibold">{name}</Text>
            </Text>

            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-xl"
              >
                <Text className="text-gray-700 font-semibold">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmStart}
                className="px-4 py-2 bg-blue-600 rounded-xl"
              >
                <Text className="text-white font-semibold">Começar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* CARD PRINCIPAL */}
      <View className="w-full h-screen max-w-md p-8 rounded-3xl items-center justify-between">
        <View className="items-center w-full">
          <Text className="text-4xl font-extrabold text-center text-gray-800 leading-tight">
            Bem-vindo ao{" "}
            <Text className="text-blue-600">Quiz de Bandeiras!</Text>
          </Text>

          <Text className="text-gray-600 text-center mt-5">
            Teste seus conhecimentos sobre bandeiras do mundo 🌍
          </Text>

          {/* Input */}
          <TextInput
            className="w-full mt-10 p-4 bg-gray-50 border border-gray-300 rounded-xl"
            placeholder="Digite seu nome"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Ranking */}
        <View className="w-full mt-8 p-6">
          <Text className="text-xl font-bold text-gray-800 text-center mb-3">
            🏆 Tabela de Pontuação
          </Text>

          {loading ? (
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
          )}
        </View>

        {warning.length > 0 && (
          <Text className="text-red-500 font-medium mt-4">{warning}</Text>
        )}

        {/* Botão iniciar */}
        <TouchableOpacity
          onPress={handleStart}
          className="w-full mb-5 bg-blue-600 py-4 rounded-2xl shadow-md active:bg-blue-700"
        >
          <Text className="text-white text-lg font-bold text-center">
            🎯 Começar o Quiz
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
