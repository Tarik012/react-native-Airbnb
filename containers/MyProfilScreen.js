import { useRoute } from "@react-navigation/core";
import { Text, View } from "react-native";

export default function MyProfileScreen() {
  const { params } = useRoute();
  return (
    <View>
      <Text>My profil page screen</Text>
    </View>
  );
}
