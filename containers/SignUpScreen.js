import {
  Button,
  Text,
  TextInput,
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState, useEffect } from "react";

export default function SignUpScreen({ setToken }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleSignUp = async () => {
    setErrorMessage("");

    if (!email || !username || !description || !password) {
      setErrorMessage("Veuillez renseigner tous les champs.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("les mots de passe doivent être identiques !");
      return;
    }

    try {
      const res = await axios.post(
        "https://express-airbnb-api.herokuapp.com/user/sign_up",
        {
          email,
          password,
          username,
          description,
        }
      );
      console.log(res.data);

      if (res.data.token) {
        setToken(res.data.token);
        console.log("token==>", res.data.token);
        alert("Connexion réussie");
      }
    } catch (error) {
      console.log(error.response);

      // const message = error.response.error;
      // if (error.response.status === 401 || error.response.status === 400) {
      //   setErrorMessage(message);
      // }
    }
  };

  useEffect(() => {
    handleSignUp();
    setIsLoading(false);
  }, []);

  return isLoading ? (
    <ActivityIndicator size="large" color="purple" style={{ marginTop: 100 }} />
  ) : (
    <View>
      <View>
        <KeyboardAwareScrollView>
          <Image
            style={styles.logo}
            source={require("../assets/logo.png")}
            resizeMode="contain"
          />
          <Text>Email: </Text>
          <TextInput
            placeholder="email"
            autoCapitalize="none" // pas de majuscule au début à la saisie
            value={email}
            onChangeText={(text) => {
              setEmail(text);
            }}
          />
          <Text>Name: </Text>
          <TextInput
            placeholder="username"
            autoCapitalize="none"
            value={username}
            onChangeText={(username) => {
              setUsername(username);
            }}
          />
          <Text>Description: </Text>
          <TextInput
            style={{
              height: 100,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 10,
            }}
            placeholder="Describe yourself in a few words"
            autoCapitalize="none"
            multiline={true}
            textAlignVertical="top"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
            }}
          />
          <TextInput
            placeholder="password"
            autoCapitalize="none"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
            }}
          />
          <TextInput
            placeholder="confirm password"
            autoCapitalize="none"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
            }}
          />
          <Button title="Sign up" onPress={handleSignUp} />
          <Text style={{ color: "red", fontStyle: "italic" }}>
            {errorMessage}
          </Text>
          <Text
            onPress={() => {
              navigation.navigate("SignIn");
            }}
          >
            Already have an account ? Sign in
          </Text>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
  },
});
