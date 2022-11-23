import { useNavigation } from "@react-navigation/core";
import {
  Button,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import { useEffect, useState } from "react";

export default function SignInScreen({ setToken }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setError("");

    if (!email || !password) {
      setError("Veuillez renseigner tous les champs.");
      return;
    }

    try {
      const res = await axios.post(
        "https://express-airbnb-api.herokuapp.com/user/log_in",
        {
          email,
          password,
        }
      );
      //console.log(res.data);

      if (res.data.token) {
        setToken(res.data.token);
        //console.log("token==>", res.data.token);
        alert("Connexion réussie");
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error.response.data.error);
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
            placeholder="Your Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            autoCapitalize="none"
            secureTextEntry
          />
          <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>
          <TouchableOpacity style={styles.btn} onPress={handleSignIn}>
            <Text>Sign in</Text>
          </TouchableOpacity>
          <Text
            onPress={() => {
              navigation.navigate("SignUp");
            }}
          >
            No account ? Register
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
