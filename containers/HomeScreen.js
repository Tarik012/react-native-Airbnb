import { useNavigation } from "@react-navigation/core";
import { useEffect, useState } from "react";
import {
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
    <View style={{ marginLeft: 20, marginRight: 20 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item._id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Room", { roomId: item._id });
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
              <Text style={styles.price}>{item.price} €</Text>
              <View style={styles.detailsContainer}>
                <View style={styles.leftDetails}>
                  <Text
                    style={styles.title}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.title}
                  </Text>
                  <View style={styles.stars}>
                    <Text> {getStars(item.ratingValue)}</Text>
                    <Text style={styles.review}> {item.reviews} reviews</Text>
                  </View>
                </View>
                <View style={styles.rightDetails}>
                  <Image
                    source={{
                      uri: `${item.user.account.photo.url}`,
                    }}
                    style={styles.photo}
                    resizeMode="contain"
                  />
                </View>
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
    borderBottomWidth: 0.5,
    borderBottomColor: "grey",
    paddingTop: 20,
    paddingBottom: 10,
  },
  pictureContainer: {
    flex: 2,
    marginBottom: 10,
  },
  picture: {
    width: 428,
    height: 200,
    position: "relative",
  },
  detailsContainer: {
    flexDirection: "row",
  },
  leftDetails: {
    flex: 2,
    alignItems: "flex-start",
    justifyContent: "space-around",
  },
  rightDetails: {
    flex: 0.5,
  },
  stars: {
    flexDirection: "row",
    alignItems: "center",
  },
  review: {
    color: "grey",
  },
  title: {
    fontSize: 19,
  },
  price: {
    color: "white",
    backgroundColor: "black",
    width: 60,
    position: "absolute",
    top: 140,
    paddingLeft: 10,
  },
  photo: {
    height: 80,
    width: 80,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
});
