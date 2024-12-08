import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
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
        <Icon
          name={"account"}
          size={32}
          color={colors.text}
        />
        <Text style={{ marginBottom: spacing.small, fontSize: 24, color: colors.text }}>Omat sivut</Text>
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
          <View><Text style={{color:colors.text}}>{fname} {lname} ({username})</Text></View>
          <View><Text style={{color:colors.text}}>Paino: {weight} kg</Text></View>
          <View><Text style={{color:colors.text}}>Pituus: {height} cm</Text></View>
          <View><Text style={{color:colors.text}}>Painoindeksi: {bmi}</Text></View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Asetukset")}>
          <Icon style={{color:colors.text}} name="cog" size={48} />
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = ({ colors, spacing }) =>
  StyleSheet.create({
    headLine: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      alignContent: "center",
      marginTop: spacing.medium,
      marginLeft: spacing.small
    },
    profileInfo: {
      width: Dimensions.get('window').width - 40,
      height: 100,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginLeft: 10,
      marginRight: 10
    },
  })