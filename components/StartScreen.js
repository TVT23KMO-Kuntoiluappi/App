import { View, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import React from "react";
import { useTheme } from 'react-native-paper';

const { width, height } = Dimensions.get("window");

export default function StartScreen() {

  const { colors, spacing } = useTheme();

  return (
    <View style={styles({ colors, spacing }).container}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        contentFit="fill"
      />
    </View>
  );
}

const styles = ({ colors, spacing }) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors?.background || 'white',
  },
  logo: {
    width: width,
    height: height,
  },
});
