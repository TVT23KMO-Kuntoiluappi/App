import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Simply Gymnotes</Text>
      <TextInput
        style={styles.textInput}
        maxLength={40}
        onChangeText={text => onChangeText(text)}
        value={value}
        placeholder='Käyttäjätunnus'
      />
      <TextInput
        style={styles.textInput}
        maxLength={40}
        onChangeText={text => onChangeText(text)}
        value={value}
        placeholder='Salasana'
      />
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
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'grey',
      height: '100%'
    },
    header: {
      fontSize: 36,
      marginBottom: 30
    },
    textInput: {
      backgroundColor: '#EFF5D5',
      margin: 10,
      padding: 10,
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 10
    },
    button: {
      backgroundColor: '#B8A90B',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 10
    },
    buttonText: {
      fontSize: 20
    }
})