import { StyleSheet, Text, View, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import UserTest from "../components/UserTest";
import MovementList from "../components/MovementList"; // Uusi komponentti

export default function MovementBank() {
  const { colors, spacing } = useTheme();
  
  return (
    <View style={[styles({ colors, spacing }).container, { height: '100%' }]}>
      <MovementList />
    </View>
    
  );
}

const styles = ({ colors, spacing }) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width: '100%',
    paddingTop: '10%',
    paddingBottom: '4%',
    backgroundColor: colors?.background || 'white'
  },
});
