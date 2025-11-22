import { useState } from "react";
import { router } from "expo-router";

export const usePlayerName = () => {
  const [name, setName] = useState("");
  const [warning, setWarning] = useState("");

  const validateName = () => {
    if (!name.trim()) {
      setWarning("⚠️ Digite seu nome antes de começar!");
      setTimeout(() => setWarning(""), 3000);
      return false;
    }
    return true;
  };

  const saveAndStart = () => {
    try {
      localStorage?.setItem("currentPlayer", name);
    } catch {}

    router.push("/quiz");
  };

  return { name, setName, warning, validateName, saveAndStart };
};
