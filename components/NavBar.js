import { StyleSheet, Text, View, Dimensions, Platform } from "react-native";
import React from "react";
import { Appbar, useTheme } from "react-native-paper";

const screenHeight = Dimensions.get("window").height
const navbarHeight = screenHeight * 0.1

export default function NavBar(props) {
  const { colors, spacing } = useTheme()

  return (
    <Appbar style={styles.container}>
      <Appbar.Action icon="archive" onPress={() => {}} />
      <Appbar.Action icon="email" onPress={() => {}} />
      <Appbar.Action icon="label" onPress={() => {}} />
      <Appbar.Action icon="delete" onPress={() => {}} />
    </Appbar>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    justifyContent: "space-around",
    padding: 20,
    alignItems: "center",
    bottom: 0,
    left: 0,
    right: 0,
    position: "absolute",
    height: navbarHeight,
    borderColor: "grey",
    borderWidth: 1,
    backgroundColor: "#EFF5D5",
    zIndex: 999,
  },
});
