import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Login() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>login</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'grey',
      height: '100%'
    }
})