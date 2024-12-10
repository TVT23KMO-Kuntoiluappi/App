import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { auth, createUserWithEmailAndPassword, updateProfile, firestore, signInWithEmailAndPassword } from "../firebase/Config";
import { doc, collection, setDoc } from "../firebase/Config"
import { useTheme } from 'react-native-paper';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Register({setLogged}) {
  const [fname, setFname] = useState("")
  const [lname, setLname] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("");
  const [firstPassword, setFirstPassword] = useState("")
  const [password, setPassword] = useState("");
  const { colors, spacing } = useTheme();
  const [pwLength, setPwLength] = useState(false)

  // Laittaa users collectioniin userId:llä omattiedot-lansioon
  async function addUserDetails(userId, userDetails) {
    const userDetailsRef = doc(collection(firestore, `users/${userId}/omattiedot`), "perustiedot");
    try {
      await setDoc(userDetailsRef, userDetails);
      console.log("Käyttäjän tiedot lisätty onnistuneesti!");
    } catch (error) {
      console.error("Virhe tietojen lisäämisessä:", error);
    }
  }

  const handleRegister = async () => {
    if (firstPassword === password && password.length >= 8) {
      try {
        // Luo käyttäjä sähköpostin ja salasanan perusteella
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // Aseta käyttäjän käyttäjänimi (displayName)
        try {
          await updateProfile(user, { displayName: username });
          console.log("Käyttäjän käyttäjätunnus asetettu:", user.displayName);
        } catch (error) {
          console.error("Virhe asetettaessa näyttönimeä:", error);
          throw new Error("Käyttäjänimen asettaminen epäonnistui.");
        }
  
        console.log("User created:", user);
  
        // Lisää käyttäjän tiedot Firestoreen
        try {
          await addUserDetails(user.uid, {
            firstName: fname,
            lastName: lname,
            username: username,
            height: "aseta pituus",
            weight: "aseta paino",
          });
        } catch (error) {
          console.log("Virhe tietojen lisäämisessä Firestoreen:", error);
          throw new Error("Tietojen lisääminen epäonnistui.");
        }
  
        // Näytä onnistunut rekisteröitymisviesti
        Alert.alert(
          "Rekisteröityminen onnistui",
          `Tervetuloa, ${fname || "Käyttäjä"}!`,
          [{ text: "OK" }]
        );
        setLogged(true)
  
        // Tyhjennä lomakekentät
        setFname("");
        setLname("");
        setUsername("");
        setEmail("");
        setFirstPassword("")
        setPassword("");

      } catch (error) {
        console.log("Error during registration:", error.message);
  
        // Näytä virheviesti käyttäjälle
        Alert.alert(
          "Rekisteröityminen epäonnistui",
          error.message,
          [{ text: "OK" }]
        );
      }
    } else {
      let vinkki
      if (firstPassword===password) {
        vinkki = "Salasana on liian lyhyt"
      } else {
        vinkki = "salasanat eivät täsmää"
      }
      Alert.alert(
        "Ongelmia salasanassa:",
        vinkki,
        [{ text: "OK" }]
      )
    }
  };

  // tarkastetaan salasanan laatu 
  const checkPassword = (password) => {
    const smallLetters = "qwertyuiopåasdfghjklöäzxcvbnm"
    const bigLetters = "QWERTYUIOPÅASDFGHJKLÖÄZXCVBNM"
    const numbers = "1234567890"
    const specialMarks = "!#¤%&/()=?@£$€{[]}*"
    let small = false
    let big = false
    let num = false
    let special = false
    for (let char of password){
      if (smallLetters.includes(char)){
        small = true
      } else if (bigLetters.includes(char)) {
        big = true
      } else if (numbers.includes(char)){
        num = true
      } else if (specialMarks.includes(char)){
        special = true
      }
    }
    let passwordQuality = 0;
    small ? passwordQuality += 1 : passwordQuality += 0
    big ? passwordQuality += 1 : passwordQuality += 0
    num ? passwordQuality += 1 : passwordQuality += 0
    special ? passwordQuality += 1 : passwordQuality += 0
    if (password.length >= 16) {
      passwordQuality += 1
    }
    
    if (password.length === 0) {
      return
    }else if (password.length < 8) {
      return <Text style={{color:"red"}}>liian lyhyt salasana</Text>
    } else {
    return <Text
      style = {{
        color: passwordQuality === 1 ? "red" :
        passwordQuality === 2 ? "orange" :
        passwordQuality === 3 ? "lightgreen" : "green"
       }}
    >{
      passwordQuality === 1 ? "surkea salasana, mutta menkööt..." :
      passwordQuality === 2 ? "Ihan OK salasana" :
      passwordQuality === 3 ? "Hyvä salasana" : "Erinomainen salasana!"
    }</Text>
    }
  }


  return (
    <SafeAreaView style={styles({ colors, spacing }).container}>
      <Text style={styles({ colors, spacing }).header}>Luo tunnus</Text>
      <ScrollView contentContainerStyle={styles.textInputContainer}>
        <TextInput
          style={styles({ colors, spacing }).textInput}
          maxLength={40}
          onChangeText={(text) => setFname(text)}
          value={fname}
          placeholder="Etunimi"
          placeholderTextColor={colors.text}
        />
        <TextInput
          style={styles({ colors, spacing }).textInput}
          maxLength={40}
          onChangeText={(text) => setLname(text)}
          value={lname}
          placeholder="Sukunimi"
          placeholderTextColor={colors.text}
        />
        <TextInput
          style={styles({ colors, spacing }).textInput}
          maxLength={40}
          onChangeText={(text) => setUsername(text)}
          value={username}
          placeholder="Käyttäjätunnus"
          placeholderTextColor={colors.text}
        />
        <TextInput
          style={styles({ colors, spacing }).textInput}
          maxLength={40}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Sähköposti"
          placeholderTextColor={colors.text}
        />    
        {checkPassword(firstPassword)}    
        <TextInput
          style={styles({ colors, spacing }).textInput}
          maxLength={40}
          onChangeText={(text) => setFirstPassword(text)}
          value={firstPassword}
          placeholder="Salasana"
          secureTextEntry={true}
          placeholderTextColor={colors.text}
        />
        <TextInput
          style={styles({ colors, spacing }).textInput}
          maxLength={40}
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="Salasana uudelleen"
          secureTextEntry={true}
          placeholderTextColor={colors.text}
        />
      </ScrollView>
      <TouchableOpacity style={styles({ colors, spacing }).button} onPress={handleRegister}>
        <Text style={styles({ colors, spacing }).buttonText}>Luo käyttäjä</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = ({ colors, spacing }) => 
  StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    marginTop: 20,
    marginBottom: 0,
    color: colors.text
  },
  textInputContainer: {
    marginBottom: 20,
    alignItems: 'center'
  },
  textInput: {
    backgroundColor: colors.surface,
    margin: 10,
    padding: 10,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 20,
    width: 0.9*screenWidth,
    height: 55,
    color: colors.text
  },
  button: {
    backgroundColor: colors?.button || 'black',
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
    fontSize: 20,
    color: colors.buttonText
  }
});
