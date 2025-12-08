// usePlayerName.ts
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const usePlayerName = () => {
  const [name, setName] = useState("");
  const [warning, setWarning] = useState("");

  const validateName = () => {
    if (!name.trim()) {
      setWarning("⚠️ Digite seu nome antes de começar!");
      setTimeout(() => setWarning(""), 2500);
      return false;
    }
    return true;
  };

  const confirmStart = async () => {
    if (!validateName()) return;

    await AsyncStorage.setItem("playerName", name.trim());
    router.push("/quiz");
  };

  return {
    name,
    setName,
    warning,
    validateName,
    confirmStart,
  };
};
