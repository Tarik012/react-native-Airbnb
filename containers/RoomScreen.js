import { useRoute } from "@react-navigation/core";
import { Text, View, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RoomScreen({ route }) {
  const { params } = useRoute();
  const navigation = useNavigation();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const roomId = params.roomId;

  const fetchRoomById = async () => {
    if (roomId) {
      try {
        const res = await axios.get(
          "https://express-airbnb-api.herokuapp.com/rooms/",
          {
            params: {
              id: roomId,
            },
          }
        );

        //console.log("res=>", res.data);
        setData(res.data);
        console.log("data=>", data);
      } catch (error) {
        console.log(error.response);
      }
    } else {
      console.log("paramètre id manquant");
    }
  };

  useEffect(() => {
    fetchRoomById();
    setIsLoading(false);
  }, []);

  return isLoading ? (
    <ActivityIndicator size="large" color="purple" style={{ marginTop: 100 }} />
  ) : (
    <Text>TEST</Text>
    // <View style={{ marginLeft: 20, marginRight: 20 }}>
    //   <View style={styles.container}>
    //     <View style={styles.pictureContainer}>
    //       {/* <Image
    //         source={{
    //           uri: `${data.photos[0].url}`,
    //         }}
    //         style={styles.picture}
    //         resizeMode="contain"
    //       /> */}
    //     </View>
    //     <Text style={styles.price}>{data.price} €</Text>
    //     <View style={styles.detailsContainer}>
    //       <View style={styles.leftDetails}>
    //         <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
    //           {data.title}
    //         </Text>
    //         <View style={styles.stars}>
    //           <Text> {getStars(data.ratingValue)}</Text>
    //           <Text style={styles.review}> {data.reviews} reviews</Text>
    //         </View>
    //       </View>
    //       <View style={styles.rightDetails}>
    //         <Image
    //           source={{
    //             uri: `${data.user.account.photo.url}`,
    //           }}
    //           style={styles.photo}
    //           resizeMode="contain"
    //         />
    //       </View>
    //     </View>
    //   </View>
    // </View>
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
