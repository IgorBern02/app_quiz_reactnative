import { Modal, Text, TouchableOpacity, View } from "react-native";

interface ModalInitialProps {
  showModal: boolean;
  setShowModal: (visible: boolean) => void;
  name: string;
  confirmStart: () => void;
}

export const ModalInitial = ({
  showModal,
  setShowModal,
  name,
  confirmStart,
}: ModalInitialProps) => {
  return (
    <Modal visible={showModal} transparent animationType="fade">
      <View className="flex-1 bg-black/50">
        {/* CONTAINER BRANCO EM TELA CHEIA */}
        <View className="flex-1 bg-white p-8 justify-between">
          {/* Cabeçalho */}
          <View>
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              Vamos começar!
            </Text>

            <Text className="text-gray-600 mb-6">
              Jogando como{" "}
              <Text className="text-blue-600 font-semibold">{name}</Text>
            </Text>
          </View>

          {/* Botões */}
          <View className="w-full">
            <TouchableOpacity
              onPress={confirmStart}
              className="w-full bg-blue-600 py-4 rounded-xl mb-3"
            >
              <Text className="text-center text-white font-bold">
                Continuar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowModal(false)}
              className="w-full bg-gray-200 py-4 rounded-xl"
            >
              <Text className="text-center text-gray-600 font-semibold">
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
