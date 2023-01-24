import { useNavigation } from "@react-navigation/core";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import Constants from "expo-constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";

import colors from "../assets/colors";

import { useState } from "react";

import Logo from "../components/Logo";

// Dimensions
const windowHeight = Dimensions.get("window").height;
const statusBarHeight = Constants.statusBarHeight;
const scrollViewHeight = windowHeight - statusBarHeight;

export default function SignInScreen({ setToken, setId }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    setError("");

    if (!email || !password) {
      setError("Veuillez renseigner tous les champs.");
      return;
    }

    try {
      const res = await axios.post(
        "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/log_in",
        {
          email,
          password,
        }
      );
      //console.log(res.data);
      if (res.data.token && res.data.id) {
        const token = res.data.token;
        const id = res.data.id;
        setToken(token);
        setId(id);
      } else {
        setError("Une erreur est sur");
      }
    } catch (error) {
      console.log(error.response.data.error);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
      />
      <KeyboardAwareScrollView>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.view}>
            <Logo size={"large"} />
            <Text style={styles.text}>Sign in</Text>
          </View>
          <View style={styles.view}>
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
          </View>
          <View style={styles.view}>
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
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: colors.bgColor,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.bgColor,
    alignItems: "center",
    justifyContent: "space-around",
    height: scrollViewHeight,
  },
  view: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: colors.grey,
    fontWeight: "600",
    fontSize: 24,
    marginBottom: 30,
  },
  input: {
    height: 40,
    borderBottomColor: colors.lightPink,
    borderBottomWidth: 2,
    width: "80%",
    marginBottom: 30,
    fontSize: 16,
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
