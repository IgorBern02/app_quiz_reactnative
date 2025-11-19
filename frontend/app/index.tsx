import { View } from "react-native";
import Home from "./components/Home";

export default function App() {
  return (
    <View className="flex-1 items-center bg-gray-100">
      <Home text="Quiz de " span="bandeiras" />
    </View>
  );
}
