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
  ImageBackground,
  SafeAreaView,
  StatusBar,
  r,
} from "react-native";
import { Dimensions } from "react-native";
import axios from "axios";
import { getStars } from "../utils/Functions";
import colors from "../assets/colors";

const screenWidth = Dimensions.get("window").width;
//const screenHeight = Dimensions.get("window").height;

export default function HomeScreen() {
  const navigation = useNavigation();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPictures = async () => {
    try {
      const res = await axios.get(
        "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms"
      );
      setData(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchPictures();
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar barStyle="dark-content" />
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="purple"
          style={{ marginTop: 100 }}
        />
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
                <View style={styles.container} key={item._id}>
                  <View style={styles.pictureContainer}>
                    <ImageBackground
                      style={styles.bgImg}
                      source={{ uri: item.photos[0].url }}
                    >
                      <View style={styles.priceView}>
                        <Text style={styles.priceText}>{item.price} €</Text>
                      </View>
                    </ImageBackground>
                  </View>
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
                        <Text style={styles.review}>
                          {" "}
                          {item.reviews} reviews
                        </Text>
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
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
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
  bgImg: {
    height: 250,
    width: screenWidth * 0.9,
    justifyContent: "flex-end",
  },
  priceView: {
    backgroundColor: "black",
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  priceText: {
    color: "white",
    fontSize: 20,
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
  photo: {
    height: 80,
    width: 80,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
});
