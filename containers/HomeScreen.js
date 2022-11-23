import { useNavigation } from "@react-navigation/core";
import { useEffect, useState } from "react";
import {
  Button,
  Text,
  View,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Dimensions } from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function HomeScreen() {
  const navigation = useNavigation();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPictures = async () => {
    try {
      const res = await axios.get(
        "https://express-airbnb-api.herokuapp.com/rooms"
      );
      setData(res.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchPictures();
    setIsLoading(false);
  }, []);

  // fonction qui ajoute les étoiles en focntion de la note
  const getStars = (nbYellowStars) => {
    const tab = [];
    for (let index = 0; index < 5; index++) {
      index < nbYellowStars
        ? tab.push(<Ionicons name="star" size={24} color="gold" />)
        : tab.push(<Ionicons name="star" size={24} color="grey" />);
    }
    return tab;
  };

  return isLoading ? (
    <ActivityIndicator size="large" color="purple" style={{ marginTop: 100 }} />
  ) : (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item._id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            title="Press here"
            onPress={() => {
              navigation.navigate("Room", { roomId: "111" });
            }}
          >
            <View style={styles.container}>
              <View style={styles.pictureContainer}>
                <Image
                  source={{
                    uri: `${item.photos[0].url}`,
                  }}
                  style={styles.picture}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.price}>{item.price} €</Text>
                <Text> {getStars(item.ratingValue)}</Text>
                <Text> {item.reviews} reviews</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* <Text>Bienvenu sur la page Home ! (page d'accueil)</Text>
      <Button
        title="Go to Profile"
        onPress={() => {
          navigation.navigate("Profile", { userId: 123 });
        }}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    borderWidth: 1,
    borderColor: "blue",
  },
  picture: {
    height: 200,
    width: 200,
    position: "relative",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
  },
  price: {
    color: "white",
    backgroundColor: "black",
    width: 60,
    position: "absolute",
    top: 140,
    paddingLeft: 10,
  },
});
