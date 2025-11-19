import { Text, View } from "react-native";

type HomeProps = {
  text: string;
  span: string;
};

export default function Home({ text, span }: HomeProps) {
  return (
    <View className="flex flex-row justify-center items-center mt-20">
      <Text className="text-red-600 text-3xl font-bold">{text}</Text>
      <Text className="text-blue-600 text-3xl font-bold">{span}</Text>
    </View>
  );
}
