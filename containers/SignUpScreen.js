import {
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState, useEffect } from "react";
import axios from "axios";
import Logo from "../components/Logo";
import colors from "../assets/colors";

export default function SignUpScreen({ setToken, setId }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignUp = async () => {
    setError(null);

    if (!email || !username || !description || !password) {
      setError("Veuillez renseigner tous les champs.");
      return;
    }

    if (password !== confirmPassword) {
      setError("les mots de passe doivent être identiques !");
      return;
    }

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
      if (res.data.token && res.data.id) {
        const token = res.data.token;
        const id = res.data.id;
        setToken(token);
        setId(id);
      } else {
        setError("Une erreur est survenue");
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

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
      />
      <KeyboardAwareScrollView style={styles.keyboard}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Logo size={"large"} />
          <Text>Sign Up</Text>
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
            style={styles.inputText}
            placeholder="Your description"
            multiline="true"
            maxLength={250}
            numberOfLines={10}
            onChangeText={(text) => setDescription(text)}
            value={description}
            autoCapitalize="none"
          />

          <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.btn}
            onPress={handleSignUp}
          >
            <Text>Sign up</Text>
          </TouchableOpacity>
          <Text
            onPress={() => {
              navigation.navigate("SignIn");
            }}
          >
            Already have an account ? Sign in
          </Text>
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  scrollView: {
    backgroundColor: colors.bgColor,
    alignItems: "center",
    justifyContent: "center",
  },
  keyboard: {
    color: colors.bgColor,
  },
  view: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderBottomColor: colors.lightPink,
    borderBottomWidth: 2,
    width: "80%",
    marginBottom: 30,
    fontSize: 16,
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
    borderRadius: 10,
  },
});
