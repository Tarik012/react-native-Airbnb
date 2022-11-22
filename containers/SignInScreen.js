import { useNavigation } from "@react-navigation/core";
import { Button, Text, TextInput, View, TouchableOpacity } from "react-native";
import axios from "axios";
import { useState } from "react";

export default function SignInScreen({ setToken }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const handleSignIn = async () => {
    if (email === "" || password === "") {
      setErrorMessage("Veuillez renseigner tous les champs.");
      //alert("Veuillez renseigner tous les champs.");
    } else if (email.length < 1) {
      setErrorEmail("au moins un caractère !");
    } else if (!password.includes("@")) {
      setErrorPassword("format incorrect !");
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
        setErrorMessage("");
        setErrorEmail("");
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
        <Text>Name: </Text>
        <TextInput
          placeholder="Username"
          value={email}
          onChangeText={(email) => {
            setEmail(email);
          }}
        />
        <Text style={{ color: "red", fontStyle: "italic" }}>{errorEmail}</Text>
        <Text>Password: </Text>
        <TextInput
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(password) => {
            setPassword(password);
          }}
        />
        <Text style={{ color: "red", fontStyle: "italic" }}>
          {errorPassword}
        </Text>
        <Button title="Sign in" onPress={handleSignIn} />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignUp");
          }}
        >
          <Text style={{ color: "red", fontStyle: "italic" }}>
            {errorMessage}
          </Text>
          <Text>Create an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
