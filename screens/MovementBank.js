import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";
import UserTest from "../components/UserTest";

export default function MovementBank() {
  const { colors, spacing } = useTheme();

  // täällä vaan testailua että provider toimii
  return (
    <View style={styles.container}>
      <UserTest />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
