import { useRoute } from "@react-navigation/core";
import {
  Text,
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
//import { Dimensions } from "react-native";
import Swiper from "react-native-swiper";
import { AntDesign } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { getStars } from "../utils/Functions";

//const screenWidth = Dimensions.get("window").width;
//const screenHeight = Dimensions.get("window").height;

const tabShowMoreOrLess = [
  <AntDesign name="caretdown" size={17} color="grey" />,
  <AntDesign name="caretup" size={17} color="grey" />,
];

// const markers = [
//   {
//     id: 1,
//     latitude: 48.8564449,
//     longitude: 2.4002913,
//     title: "Le Reacteur",
//     description: "La formation des champion·ne·s !",
//   },
// ];

export default function RoomScreen({ route }) {
  const { params } = useRoute();
  const navigation = useNavigation();
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [displayMoreOrLess, setDisplayMoreOrLess] = useState(true);

  const roomId = params.roomId;

  const fetchRoomById = async () => {
    if (roomId) {
      try {
        const res = await axios.get(
          `https://express-airbnb-api.herokuapp.com/rooms/${roomId}`
        );

        setRoom(res.data);
        setIsLoading(false); // à mettre dans la fonction exécutée sinon il s'exécute avant que le state room reçoive les infos (erreur: "null is not an object (evaluating 'room.price')")
      } catch (error) {
        console.log(error.response);
      }
    } else {
      console.log("paramètre id manquant");
    }
  };

  useEffect(() => {
    fetchRoomById();
  }, []);

  // fonction qui permets d'afficher 3 lignes ou plus si l'on clique sur le bouton et modifie le texte au passage
  const handleShow = () => {
    setDisplayMoreOrLess(!displayMoreOrLess);
  };

  return isLoading ? (
    <ActivityIndicator size="large" color="purple" style={{ marginTop: 100 }} />
  ) : (
    <View>
      <ScrollView>
        <Swiper
          style={styles.wrapper}
          dotColor="salmon"
          activeDotColor="red"
          autoplay
        >
          {room.photos.map((photo) => {
            return (
              <View style={styles.slide} key={photo.picture_id}>
                <ImageBackground
                  style={styles.bgImg}
                  source={{ uri: `${photo.url}` }}
                ></ImageBackground>
              </View>
            );
          })}
        </Swiper>
        <View style={styles.priceView}>
          <Text style={styles.priceText}>{room.price} €</Text>
        </View>
      </ScrollView>
      <View style={styles.container}>
        <View style={styles.detailsContainer}>
          <View style={styles.leftDetails}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {room.title}
            </Text>
            <View style={styles.stars}>
              <Text> {getStars(room.ratingValue)}</Text>
              <Text style={styles.review}> {room.reviews} reviews</Text>
            </View>
          </View>
          <View style={styles.rightDetails}>
            <Image
              source={{
                uri: `${room.user.account.photo.url}`,
              }}
              style={styles.photo}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={styles.description}>
          <Text
            numberOfLines={displayMoreOrLess ? 3 : null}
            ellipsizeMode="tail"
          >
            {room.description}
          </Text>
          <View style={styles.divShow}>
            <Text
              style={{ color: "grey", marginRight: 10 }}
              onPress={handleShow}
            >
              {displayMoreOrLess ? "Show more" : "Show less"}
            </Text>
            <Text>
              {displayMoreOrLess ? tabShowMoreOrLess[0] : tabShowMoreOrLess[1]}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.containerMap}>
        <MapView
          // La MapView doit obligatoirement avoir des dimensions
          style={styles.map}
          initialRegion={{
            latitude: room.location[1],
            longitude: room.location[0],
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          }}
          showsUserLocation={true}
        >
          <Marker
            key={roomId}
            coordinate={{
              latitude: room.location[1],
              longitude: room.location[0],
            }}
            title={room.title}
            description={room.description}
          />
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    borderBottomColor: "grey",
    paddingTop: 20,
    paddingBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    // borderColor: "black",
    // borderWidth: 1,
  },
  wrapper: {
    height: 300,
  },
  slide: {
    height: 300,
  },
  bgImg: {
    height: "100%",
    width: "100%",
    // height: 250,
    // width: screenWidth * 0.9,
    justifyContent: "flex-end",
  },
  priceView: {
    backgroundColor: "black",
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    position: "absolute",
    bottom: 0,
    left: 2,
  },
  priceText: {
    color: "white",
    fontSize: 20,
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
  description: {
    marginTop: 15,
  },
  divShow: {
    flexDirection: "row",
    marginTop: 15,
  },
  containerMap: {
    // flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: 200,
  },
});
