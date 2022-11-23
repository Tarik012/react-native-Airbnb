import { useRoute } from "@react-navigation/core";
import { Text, View } from "react-native";

export default function Room({ route }) {
  const { params } = useRoute();
  return (
    <View>
      <Text>room id : {params.roomId}</Text>
    </View>
  );
}
