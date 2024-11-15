import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { auth, createUserWithEmailAndPassword } from "../firebase/Config";

export default function Register() {
  const [fname, setFname] = useState("")
  const [lname, setLname] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User created:", user);
        setFname("")
        setLname("")
        setUsername("")
        setEmail("")
        setPassword("")
      })
      .catch((error) => {
        console.error("Error during registration:", error.code, error.message);
      });
  };


  // Toistaseksi sähköposti ja salasana rekisteröityy Firebase Authenticationiin. 
  // Nimi, Sukunimi ja käyttäjätunnus täytyy laittaa esim firestoreen vielä.
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Luo tunnus</Text>
      <View style={styles.textInputContainer}>
      <TextInput
          style={styles.textInput}
          maxLength={40}
          onChangeText={(text) => setFname(text)}
          value={fname}
          placeholder="Etunimi"
        />
        <TextInput
          style={styles.textInput}
          maxLength={40}
          onChangeText={(text) => setLname(text)}
          value={lname}
          placeholder="Sukunimi"
        />
        <TextInput
          style={styles.textInput}
          maxLength={40}
          onChangeText={(text) => setUsername(text)}
          value={username}
          placeholder="Käyttäjätunnus"
        />
        <TextInput
          style={styles.textInput}
          maxLength={40}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Sähköposti"
        />
        <TextInput
          style={styles.textInput}
          maxLength={40}
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="Sähköposti uudelleen"
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Luo käyttäjä</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%'
  },
  header: {
    fontSize: 42,
    marginTop: 20,
    marginBottom: 0
  },
  textInputContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center'
  },
  textInput: {
    backgroundColor: '#EFF5D5',
    margin: 10,
    padding: 10,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 20,
    width: '90%',
    height: 55
  },
  button: {
    backgroundColor: '#B8A90B',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 20,
    margin: 7,
    width: '50%'
  },
  buttonText: {
    fontSize: 20
  }
})