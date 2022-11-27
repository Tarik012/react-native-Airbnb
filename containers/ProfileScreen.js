import axios from "axios";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Button,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import colors from "../assets/colors";

import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

export default function ProfileScreen({ userToken, userId, setToken, setId }) {
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [description, setDescription] = useState(null);
  const [picture, setPicture] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isPictureModified, setIsPictureModified] = useState(false);
  const [isInfosModified, setIsInfosModified] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://express-airbnb-api.herokuapp.com/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      setEmail(response.data.email);
      setUsername(response.data.username);
      setDescription(response.data.description);
      response.data.photo && setPicture(response.data.photo.url);

      setIsLoading(false);
    } catch (error) {
      console.log(error.response);
      setMessage({ message: "Une erreur est survenue" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateInformations = async () => {
    setError("");
    if (isPictureModified || isInfosModified) {
      isLoading(true);

      // mettre à jour les informations de l'utilisateur
      if (isInfosModified) {
        try {
          //on instancie un objet qui contiendra les informations de l'utilisateur.
          //cet objet sera passé dans le body de la requête
          //on ajoutera aussi le bearer token
          const objetInfosUser = {};
          objetInfosUser.email = email;
          objetInfosUser.username = username;
          objetInfosUser.description = description;

          const res = await axios.put(
            "https://express-airbnb-api.herokuapp.com/user/update",
            objetInfosUser,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          //on mets à jour les champs du formulaire via les useState
          if (res.data) {
            setEmail(res.data.email);
            setUsername(res.data.username);
            setDescription(res.data.description);
          } else {
            setMessage({
              message: "Erreur lors de la mise à jour des informations.",
            });
          }
        } catch (error) {
          setMessage({
            message: error.response.data.error,
          });
        }
      }

      //mettre à jour la photo de l'utilisateur venant de la galerie ou de la caméra du tél.
      if (isPictureModified) {
        try {
          const pictureNameWithExtension = picture;
          //on split le nom de la photo pour avoir l'extension
          const tab = pictureNameWithExtension.split(".");
          const extension = tab[1];

          //on prépare notre Formdata pour envoyer la photo dans la réquête axios
          const formData = new FormData();
          formData.append("newPicture", {
            uri: pictureNameWithExtension,
            name: "userPicture",
            type: `image/${extension}`,
          });

          //on envoie la photo dans le formdata via axios
          const res = await axios.put(
            "https://express-airbnb-api.herokuapp.com/user/upload_picture",
            formData,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          //on mets à jour notre state avec la photo que retourne la requête
          if (res.data.picture) {
            setPicture(res.data.photo.url);
            setMessage({ message: "Profil mis à jour" });
          }
        } catch (error) {
          setMessage({ message: error.response.data.error });
        }
      }

      isPictureModified && setIsPictureModified(false);
      isInfosModified && setIsInfosModified(false);
      setIsLoading(false);
      fetchData();
    } else {
      setMessage({
        message: "Veuillez modifier au moins une informations !",
      });
    }
  };

  // ouvrir la galerie photo du téléphone
  const uploadPicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync();

      if (!result.cancelled) {
        setPicture(result.uri);
        if (!isPictureModified) {
          setIsPictureModified(true);
        }
      }
    }
    setMessage(false);
  };

  // accéder à l'appareil photo du téléphone
  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync();
      //console.log("result=>", result);
      if (!result.cancelled) {
        setPicture(result.assets[0].uri);
        if (!isPictureModified) {
          setIsPictureModified(true);
        }
      }
    }
    setMessage(false);
  };

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
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.topView}>
            <TouchableOpacity style={styles.pictureView}>
              {picture ? (
                <Image
                  source={{ uri: picture }}
                  style={styles.picture}
                  resizeMode="cover"
                />
              ) : (
                <FontAwesome5
                  name="user-alt"
                  size={100}
                  color={colors.lightGrey}
                />
              )}
            </TouchableOpacity>
            <View style={styles.icons}>
              <TouchableOpacity
                onPress={() => {
                  uploadPicture();
                }}
              >
                <MaterialIcons
                  name="photo-library"
                  size={30}
                  color={colors.grey}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                  takePicture();
                }}
              >
                <FontAwesome5 name="camera" size={30} color={colors.grey} />
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder={email}
            onChangeText={(text) => setEmail(text)}
            value={email}
            autoCapitalize="none"
            setIsInfosModified={setIsInfosModified}
          />
          <TextInput
            style={styles.input}
            placeholder={username}
            onChangeText={(text) => setUsername(text)}
            value={username}
            autoCapitalize="none"
            setIsInfosModified={setIsInfosModified}
          />
          <TextInput
            style={styles.inputText}
            placeholder={description}
            onChangeText={(text) => setDescription(text)}
            value={description}
            autoCapitalize="none"
            setIsInfosModified={setIsInfosModified}
          />
          <Text style={{ color: "red", marginTop: 5 }}>{message}</Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={handleUpdateInformations}
          >
            <Text>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setToken(null);
              setId(null);
            }}
          >
            <Text>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  scrollView: {
    alignItems: "center",
    backgroundColor: colors.bgColor,
  },
  picture: {
    height: 150,
    width: 150,
    borderRadius: 150,
  },
  pictureView: {
    marginVertical: 20,
    width: 170,
    height: 170,
    borderRadius: 170,
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.lightPink,
    borderWidth: 2,
  },
  topView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  icons: {
    marginLeft: 20,
  },
  iconButton: {
    marginTop: 40,
  },
  view: {
    height: 30,
  },
  input: {
    borderBottomColor: "#ffbac0",
    borderBottomWidth: 2,
    height: 40,
    width: 300,
    marginTop: 40,
  },
  inputText: {
    borderColor: colors.lightPink,
    borderWidth: 2,
    width: "80%",
    marginBottom: 30,
    marginTop: 15,
    fontSize: 16,
    height: 100,
    padding: 10,
  },
  btn: {
    borderColor: "#ffbac0",
    borderWidth: 3,
    height: 50,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    margin: 40,
    borderRadius: 30,
  },
});
