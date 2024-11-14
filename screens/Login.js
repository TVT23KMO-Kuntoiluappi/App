import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Simply Gymnotes</Text>
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          maxLength={40}
          onChangeText={text => setUsername(text)}
          value={username}
          placeholder='Käyttäjätunnus'
        />
        <TextInput
          style={styles.textInput}
          maxLength={40}
          onChangeText={text => setPassword(text)}
          value={password}
          placeholder='Salasana'
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {/*TODO*/}}
      >
         <Text style={styles.buttonText}>Kirjaudu sisään</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {/*TODO*/}}
      >
         <Text style={styles.buttonText}>Rekisteröidy</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      height: '100%'
    },
    header: {
      fontSize: 42,
      marginTop: 60,
      marginBottom: 60
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