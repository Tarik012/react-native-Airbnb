import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { Dimensions } from "react-native";

export default function AroundMeScreen({ setToken }) {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [coords, setCoords] = useState();

  //A FAIRE
  // Reprendre la requete des rooms et récupérer via axios les SVGTextPositioningElementles mettres dans tableau ou
  // objet puis faire un map dessus et ajouter les markers sur la map

  useEffect(() => {
    const askPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        let location = await Location.getCurrentPositionAsync({});

        const obj = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCoords(obj);
      } else {
        setError(true);
      }

      setIsLoading(false);
    };

    askPermission();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Chargement...</Text>
      ) : error ? (
        <Text>Permission refusée</Text>
      ) : (
        <>
          <Text>Latitude de l'utilisateur : {coords.latitude}</Text>
          <Text>Longitude de l'utilisateur : {coords.longitude}</Text>
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
              {/* {markers.map((marker) => {
              return ( */}
              <Marker
                key="1"
                coordinate={{
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                }}
                title="title"
                description="description"
              />
              {/* );
            })} */}
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
    height: Dimensions.get("window").height - 200,
  },
});
