import { View, Text } from "react-native";
import { Header } from "../../components/home/Header";
import { Ranking } from "../../components/home/Ranking";
import { ModalInitial } from "../../components/home/ModalInitial";
import { NameInput } from "../../components/home/NameInput";
import { StartButton } from "../../components/ui/StartButton";

import { useState } from "react";

import { useRanking } from "@/hooks/useRanking";
import { usePlayerName } from "../../hooks/usePlayerName";

export default function HomeScreen() {
  const { name, setName, warning, validateName, confirmStart } =
    usePlayerName();

  const [showModal, setShowModal] = useState(false);
  const { scores, loading } = useRanking();

  const handleStart = () => {
    if (validateName()) {
      setShowModal(true);
    }
  };

  return (
    <View className="flex-1 bg-blue-50">
      <Header />

      <View className="flex-1 items-center justify-around px-6 mt-4">
        <Text className="text-gray-600 text-center mt-5">
          Teste seus conhecimentos sobre bandeiras 🌍
        </Text>

        <NameInput name={name} setName={setName} />

        <Ranking scores={scores} loading={loading} />

        {warning ? <Text className="text-red-500">{warning}</Text> : null}

        <StartButton onPress={handleStart} />
      </View>

      <ModalInitial
        setShowModal={setShowModal}
        showModal={showModal}
        name={name}
        confirmStart={confirmStart}
      />
    </View>
  );
}
