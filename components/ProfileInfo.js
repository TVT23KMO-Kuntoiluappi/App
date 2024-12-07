import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useTheme } from 'react-native-paper';
import { useUser } from '../context/UseUser';
import { Image } from 'expo-image';
import Loading from '../components/Loading';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function ProfileInfo({ navigation }) {
  const { colors, spacing } = useTheme();
  const { profilePic, fname, lname, username, weight, height, workOutFirebaseData } = useUser();
  const [loading, setLoading] = useState(false);
  const [bmi, setBmi] = useState((weight / ((height / 100) * (height / 100))).toFixed(2));
  return (
    <>
      <View style={styles({ colors, spacing }).headLine}>
        <Text style={{ marginBottom: spacing.small, fontSize: 24 }}>Omat sivut</Text>
      </View>
      <View style={styles({ colors, spacing }).profileInfo}>
        <View style={{ position: "relative" }}>
          <Image
            source={
              profilePic
                ? { uri: profilePic }
                : require("../screens/images/default-profpic.png")
            }
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          {loading && <Loading />}
        </View>
        <View style={{ height: "100%", width: "50%", alignItems: "flex-start", justifyContent: "space-around" }}>
          <View><Text>{fname} {lname} ({username})</Text></View>
          <View><Text>Paino: {weight} kg</Text></View>
          <View><Text>Pituus: {height} cm</Text></View>
          <View><Text>Painoindeksi: {bmi}</Text></View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Asetukset")}>
          <Icon name="cog" size={48} />
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = ({ colors, spacing }) =>
  StyleSheet.create({
    headLine: {
      width: "100%",
      borderBottomColor: "black",
      borderBottomWidth: 2,
      alignItems: "center",
      marginBottom: spacing.small,
      marginTop: spacing.medium
  },
    profileInfo: {
      width: "95%",
      height: 100,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
      marginTop: 20,
    },
  })