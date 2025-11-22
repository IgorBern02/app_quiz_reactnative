import { View, Text } from "react-native";
import { Header } from "../../components/Header";
import { Ranking } from "../../components/Ranking";
import { ModalInitial } from "../../components/ModalInitial";

import { NameInput } from "../../components/NameInput";
import { StartButton } from "../../components/StartButton";
import { usePlayerName } from "../../hooks/usePlayerName";
import { useState } from "react";

export default function HomeScreen() {
  const { name, setName, warning, validateName, saveAndStart } =
    usePlayerName();

  const [showModal, setShowModal] = useState(false);

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

        <Ranking />

        {warning ? <Text className="text-red-500">{warning}</Text> : null}

        <StartButton onPress={handleStart} />
      </View>

      <ModalInitial
        setShowModal={setShowModal}
        showModal={showModal}
        name={name}
        confirmStart={saveAndStart}
      />
    </View>
  );
}
