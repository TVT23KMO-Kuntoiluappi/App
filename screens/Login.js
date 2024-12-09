import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";
import { auth, signInWithEmailAndPassword, getAuth } from "../firebase/Config";
import { Image } from "expo-image";

export default function Login({ setLogged, navigation }) {
  const { colors, spacing } = useTheme();
  const [username, setUsername] = useState("testi@testi.fi");
  const [password, setPassword] = useState("testing123");

  const login = () => {
    // const auth = getAuth()

    signInWithEmailAndPassword(auth, username, password)
      .then((userCredentials) => {
        setLogged(true);
        console.log("toimii täällä");
      })
      .catch((error) => {
        if (
          error.code === "auth/wrong-password" ||
          error.code === "auth/user-not-found"
        ) {
          console.log("Invalid credentials");
        } else if (error.code === "auth/too-many-requests") {
          console.log("Too many attempts");
        } else {
          console.log(error.code.error.message);
        }
      });
  };

  return (
    <SafeAreaView style={styles({ colors, spacing }).container}>
      <Image
        source={require("../assets/logo.png")}
        style={styles({ colors, spacing }).logo}
        contentFit="contain"
      />
      <View style={styles({ colors, spacing }).textInputContainer}>
        <TextInput
          style={styles({ colors, spacing }).textInput}
          maxLength={40}
          onChangeText={(text) => setUsername(text)}
          value={username}
          placeholder="Käyttäjätunnus"
        />
        <TextInput
          style={styles({ colors, spacing }).textInput}
          maxLength={40}
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="Salasana"
          secureTextEntry={true}
          color={colors?.text}
        />
      </View>
      <TouchableOpacity
        style={styles({ colors, spacing }).button}
        onPress={() => {
          login();
        }}
      >
        <Text style={styles({ colors, spacing }).buttonText}>Kirjaudu sisään</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles({ colors, spacing }).button}
        onPress={() => {
          navigation.navigate("Register");
        }}
      >
        <Text style={styles({ colors, spacing }).buttonText}>Rekisteröidy</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = ({ colors, spacing }) =>
  StyleSheet.create({
  container: {
    alignItems: "center",
    height: "100%",
  },
  textInputContainer: {
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },
  textInput: {
    backgroundColor: colors?.surface,
    margin: 10,
    padding: 10,
    borderColor: colors?.text,
    borderWidth: 1,
    borderRadius: 20,
    width: "90%",
    height: 55,
    color: colors?.text
  },
  button: {
    backgroundColor: colors?.button || 'black',
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderColor: colors?.text || 'black',
    borderWidth: 1,
    borderRadius: 20,
    margin: 7,
    width: "50%",
  },
  buttonText: {
    fontSize: 20,
    color: colors?.text
  },
  logo: {
    width: "60%",
    aspectRatio: 1,

  },
});
