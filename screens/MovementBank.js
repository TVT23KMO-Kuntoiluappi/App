import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";
import UserTest from "../components/UserTest";
import MovementList from "../components/MovementList"; // Uusi komponentti

export default function MovementBank() {
  const { colors, spacing } = useTheme();


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MovementList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,    
    padding: 16,
  },
});
