import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from 'react-native-paper';
import { useUser } from '../context/UseUser';
import { Image } from 'expo-image';
import Loading from '../components/Loading';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function UserPage({navigation}) {
  const { colors, spacing } = useTheme()
  const { profilePic, fname, lname, username, weight, height } = useUser()
  const [loading, setLoading] = useState(false);
  const [bmi, setBmi] = useState((weight/((height/100)*(height/100))).toFixed(2))

  return (
    <SafeAreaView style={styles({ colors, spacing }).container}>
      <ScrollView
        contentContainerStyle={styles({ colors, spacing }).containerScroll}
      >
        <View style={styles({ colors, spacing }).profileInfo}>
          <View style={{ position: "relative" }}>
            <Image
              source={
                profilePic
                  ? { uri: profilePic }
                  : require("./images/default-profpic.png")
              }
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            {loading && <Loading />}
          </View>
          <View style = {{height: "100%",width: "50%",alignItems: "flex-start", justifyContent: "space-around"}}>
            <View><Text>{fname} {lname} ({username})</Text></View>
            <View><Text>Paino: {weight} kg Pituus: {height} cm</Text></View>
            <View><Text>Painoindeksi: {bmi}</Text></View>
          </View>
          <TouchableOpacity onPress = {() => navigation.navigate("Asetukset")}>
            <Icon name="cog" size={48} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = ({ colors, spacing }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      height: "100%",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    containerScroll: {
      flexGrow: 1,
      width: "95%",
      alignItems: "center",
      justifyContent: "flex-start",
      marginTop: 30,
    },
    profileInfo: {
      width: "95%",
      height: 100,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
      flexDirection: "row",
      marginTop: 20,
    },
  })