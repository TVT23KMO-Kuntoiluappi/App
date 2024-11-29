import { View, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import React from "react";

const { width, height } = Dimensions.get("window");

export default function StartScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        contentFit="fill"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFF5D5",
  },
  logo: {
    width: width,
    height: height,
  },
});
