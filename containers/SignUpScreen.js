import { Button, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";

export default function SignUpScreen({ setToken }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorUsername, setErrorUsername] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("les mots de passe doivent être identiques !");
    }

    if (!email || !username || !description || !password) {
      setErrorMessage("Veuillez renseigner tous les champs.");
      //alert("Veuillez renseigner tous les champs.");
    } else if (email.length < 1) {
      setErrorUsername("au moins un caractère !");
    } else if (!password.includes("@")) {
      setErrorPassword("format incorrect !");
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
      //console.log(res.data);

      if (res.data.token) {
        setToken(res.data.token);
        setErrorMessage("");
        setErrorUsername("");
        setErrorPassword("");
        //console.log("token==>", res.data.token);
        alert("Connexion réussie");
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <View>
      <View>
        <KeyboardAwareScrollView>
          <Text>Email: </Text>
          <TextInput
            placeholder="email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
            }}
          />
          <Text>Name: </Text>
          <TextInput
            placeholder="username"
            value={username}
            onChangeText={(username) => {
              setUsername(username);
            }}
          />
          <Text style={{ color: "red", fontStyle: "italic" }}>
            {errorUsername}
          </Text>
          <Text>Description: </Text>
          <TextInput
            style={{
              height: 100,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 10,
            }}
            placeholder="Describe yourself in a few words"
            multiline={true}
            textAlignVertical="top"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
            }}
          />
          <TextInput
            placeholder="password"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
            }}
          />
          <TextInput
            placeholder="confirm password"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
            }}
          />
          <Text style={{ color: "red", fontStyle: "italic" }}>
            {errorPassword}
          </Text>
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
