import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from 'react-native-paper';
import { useUser } from '../context/UseUser';
import { Image } from 'expo-image';

export default function MovementBank() {
  const { colors, spacing } = useTheme()
  const { fname, lname, username, weight, height, profilePic, oneRepMax } = useUser()

  // täällä vaan testailua että provider toimii
  return (
    <View style = {styles.container}>
      <Text>{fname}</Text>
      <Text>{lname}</Text>
      <Text>{username}</Text>
      <Text>{weight}</Text>
      <Text>{height}</Text>
      <Text>{oneRepMax[0].toString()}</Text>
      <Image
            source={
              profilePic
                ? { uri: profilePic }
                : require('./images/default-profpic.png')
            }
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center"
    }
})