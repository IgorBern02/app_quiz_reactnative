import { TextInput } from "react-native";

interface NameInputProps {
  name: string;
  setName: (name: string) => void;
}

export const NameInput = ({ name, setName }: NameInputProps) => (
  <TextInput
    className="w-full mt-10 p-4 bg-gray-50 border border-gray-300 rounded-xl"
    placeholder="Digite seu nome"
    value={name}
    onChangeText={setName}
  />
);
