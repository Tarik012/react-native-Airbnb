import React, { useState, useEffect, useRef } from "react";

import { Text, View, StyleSheet, ActivityIndicator, Image } from "react-native";

import * as Location from "expo-location";

import MapView, { Marker } from "react-native-maps";

import { Dimensions } from "react-native";

import { useNavigation } from "@react-navigation/core";

import LottieView from "lottie-react-native";

import axios from "axios";

export default function AroundMeScreen({ setToken }) {
  const animation = useRef(null);

  const navigation = useNavigation();

  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [coords, setCoords] = useState();
  const [positions, setPositions] = useState([]);

  //A FAIRE
  // Reprendre la requete des rooms et récupérer via axios les SVGTextPositioningElementles mettres dans tableau ou
  // objet puis faire un map dessus et ajouter les markers sur la map

  const getPositions = async () => {
    try {
      const res = await axios.get(
        "https://express-airbnb-api.herokuapp.com/rooms/around"
      );
      //console.log("rs.data=>", res.data);
      setPositions(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    // je récupère l'accord de l'utilisateur pour le localiser et le réprésenter sur la carte
    const askPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        let location = await Location.getCurrentPositionAsync({});

        const obj = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCoords(obj);
        //je récupère les positions des biens autours de moi pour les afficher sur la carte une fois l'accord de l'utilisateur
        getPositions();
      } else {
        setError(true);
      }
    };

    askPermission();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        // <ActivityIndicator
        //   size="large"
        //   color="purple"
        //   style={{ marginTop: 100 }}
        // />
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: 200,
            height: 200,
            backgroundColor: "#eee",
          }}
          source={require("../assets/home-location.json")}
        />
      ) : error ? (
        <Text>Permission refusée</Text>
      ) : (
        <>
          {/* <Text>Latitude de l'utilisateur : {coords.latitude}</Text>
          <Text>Longitude de l'utilisateur : {coords.longitude}</Text> */}
          <View>
            <MapView
              // La MapView doit obligatoirement avoir des dimensions
              style={styles.map}
              initialRegion={{
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.2,
                longitudeDelta: 0.2,
              }}
              showsUserLocation={true}
            >
              {positions.map((position) => {
                return (
                  <Marker
                    key={position._id}
                    pinColor={"purple"}
                    coordinate={{
                      latitude: position.location[1],
                      longitude: position.location[0],
                    }}
                    title={position.title}
                    description={position.description}
                    onPress={() => {
                      navigation.navigate("Room", { roomId: position._id });
                    }}
                  >
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceText}>{position.price} €</Text>
                      {/* <Image
                        source={{ uri: `${position.photos[0].url}` }}
                        style={{ height: 50, width: 50 }}
                        resizeMode="contain"
                      /> */}
                    </View>
                  </Marker>
                );
              })}
            </MapView>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#DCDCDC",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  priceContainer: {
    width: 50,
    height: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  priceText: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },
});
