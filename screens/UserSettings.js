import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from 'react-native-paper';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { Image } from 'expo-image'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';

export default function UserSettings() {
  const { colors, spacing } = useTheme()
  const [fname, setFname] = useState("")
  const [lname, setLname] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [edit, setEdit] = useState(false)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.changeProfpic}>
        <Image
          source={require('./images/default-profpic.png')}
          style={[{ width: 100, height: 100 }, styles.profpic]}
        />
        <TouchableOpacity style={styles.button}>
          <Text>Vaihda profiilikuva</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => setEdit(!edit)}>
        <Text style={styles.buttonText}>{edit ? "Näytä tiedot" : "Muokkaa tietoja"}</Text>
      </TouchableOpacity>
      {edit ? <View style={styles.editProfile}>
        <View style={styles.editLine}>
          <TextInput
            style={styles.textInput}
            maxLength={40}
            onChangeText={(text) => setFname(text)}
            value={fname}
            placeholder="etunimi"
          />
          <TextInput
            style={styles.textInput}
            maxLength={40}
            onChangeText={(text) => setLname(text)}
            value={lname}
            placeholder="sukunimi"
          />
        </View>
        <View style={styles.editLine}>
          <TextInput
            style={styles.textInput}
            maxLength={40}
            onChangeText={(text) => setUsername(text)}
            value={username}
            placeholder="käyttäjätunnus"
          />
          <TextInput
            style={styles.textInput}
            maxLength={40}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="sähköposti"
          />
        </View>
        <View style={styles.editLine}>
          <TextInput
            style={styles.textInput}
            maxLength={40}
            onChangeText={(text) => setWeight(text)}
            value={weight}
            placeholder="paino"
          />
          <TextInput
            style={styles.textInput}
            maxLength={40}
            onChangeText={(text) => setHeight(text)}
            value={height}
            placeholder="pituus"
          />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Tallenna</Text>
        </TouchableOpacity>
      </View> :
        <View style={styles.profileInfo}>
          <Text>Nimi: etunimi sukunimi</Text>
          <Text>Käyttäjätunnus: defaultusername</Text>
          <Text>sähköposti: testi@testi</Text>
          <Text>paino: 100 kg pituus: 180 cm</Text>
        </View>}
      <View style={styles.addOneRepMax}>
        <View style={styles.oneRepMaxHeadline}>
          <Text>Lisää "One rep Max"</Text>
          <TouchableOpacity>
            <Icon name='help-circle' size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.oneRepMaxHeadline}>
          <TouchableOpacity>
            <Icon name='plus' size={24} />
          </TouchableOpacity>
          <Text>Lisää liike</Text>
        </View>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "flex-start"
  },
  presonalSettings: {
    alignItems: 'center',
  },
  profpic: {
    borderRadius: 50
  },
  changeProfpic: {
    width: '100%',
    alignItems: 'center',
    justifyContent: "center",
    marginBottom: 20,
    flexDirection: 'row',
    margin: 16
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  editProfile: {
    margin: 5,
  },
  editLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-around"
  },
  textInput: {
    backgroundColor: '#ffffff',
    margin: 5,
    padding: 5,
    borderColor: 'black',
    width: '45%',
    borderWidth: 2,
    borderRadius: 20,
    height: 55
  },
  profileDetails: {
    width: '100%',
  },
  name: {
    marginBottom: 20,
  },
  heightWeight: {
    marginBottom: 10,
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
  addOneRepMax: {
    borderRadius: 8,
    width: "100%",
    backgroundColor: '#EFF5D5',
    margin: 5,
    padding: 5,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 20,
  },
  oneRepMaxHeadline: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: 8
  }
});
