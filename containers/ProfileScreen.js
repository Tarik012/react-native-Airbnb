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
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function ProfileScreen({ userId, bearerToken }) {
  //console.log("userId, bearerToken =>", userId, bearerToken);

  const [data, setData] = useState(null);
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [description, setDescription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://express-airbnb-api.herokuapp.com/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      //console.log(response.data);
      setData(response.data);
      setEmail(response.data.email);
      setUsername(response.data.username);
      setDescription(response.data.description);
      setIsLoading(false);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = () => {
    //ajouter les boutons galerie et camera
    //vérifier que les champs ne sont pas vides
    // requete axios  https://express-airbnb-api.herokuapp.com/user/update
    //mettre le formdata en place avec append.
    //envoyer en put
  };

  return isLoading ? (
    <ActivityIndicator size="large" color="purple" style={{ marginTop: 100 }} />
  ) : (
    <ScrollView>
      <View style={styles.mainContainer}>
        <KeyboardAwareScrollView>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <TextInput
            style={styles.input}
            placeholder={email}
            onChangeText={(text) => setEmail(text)}
            value={email}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder={username}
            onChangeText={(text) => setUsername(text)}
            value={username}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder={description}
            onChangeText={(text) => setDescription(text)}
            value={description}
            autoCapitalize="none"
          />
          <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>
          <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
            <Text>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setToken(null);
            }}
          >
            <Text>Log Out</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginVertical: 25,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 100,
    height: 100,
  },
  input: {
    borderBottomColor: "#ffbac0",
    borderBottomWidth: 2,
    height: 40,
    width: 300,
    marginTop: 40,
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
