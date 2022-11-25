import {
  Button,
  Text,
  TextInput,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState, useEffect } from "react";
import axios from "axios";

export default function SignUpScreen({ setToken, setId }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setError("");

    if (!email || !username || !description || !password) {
      setError("Veuillez renseigner tous les champs.");
      return;
    }

    if (password !== confirmPassword) {
      setError("les mots de passe doivent être identiques !");
      return;
    }

    setIsLoading(true);

    try {
      //console.log("coucou =>", email, description, username, password);
      const res = await axios.post(
        "https://express-airbnb-api.herokuapp.com/user/sign_up",
        {
          email,
          password,
          username,
          description,
        }
      );
      //console.log("ici =>", res.data);
      if (res.data.token) {
        setToken(res.data.token, res.data.id);
        setId(res.data.Id);
        //console.log("token==>", res.data.token);
        //alert("Connexion réussie");
        setIsLoading(false);

        await AsyncStorage.setItem("userToken", res.data.token);
        await AsyncStorage.setId("userId", res.data.id);
        navigation.navigate("Home");
      }
    } catch (error) {
      console.log(error.response.status);
      // 3 BACK Vérifier que l'email soit dispo
      // 4 BACK Vérifier que le username soit dispo
      const message = error.response.data.error;
      console.log(message);

      if (error.response.status === 401 || error.response.status === 400) {
        setError(message);
      }
    }
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
            placeholder="Your Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Your Username"
            onChangeText={(text) => setUsername(text)}
            value={username}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Your Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            autoCapitalize="none"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Your password"
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            autoCapitalize="none"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Your description"
            onChangeText={(text) => setDescription(text)}
            value={description}
            autoCapitalize="none"
          />
          <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>
          <TouchableOpacity style={styles.btn} onPress={handleSignUp}>
            <Text>Sign up</Text>
          </TouchableOpacity>
          <Text
            onPress={() => {
              navigation.navigate("SignIn");
            }}
          >
            Already have an account ? Sign in
          </Text>
        </KeyboardAwareScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 25,
    alignItems: "center",
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
    borderRadius: 10,
  },
});
