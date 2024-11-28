import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from 'react-native-paper';
import { useUser } from '../context/UseUser';
import WorkOutSheets from '../components/WorkOutSheets';
import WorkOutData from '../components/WorkOutData';
import ProfileInfo from '../components/ProfileInfo';

export default function UserPage({ navigation }) {
  const { colors, spacing } = useTheme();

  // Profiilitiedot - Näytetään ensimmäisenä
  const profileData = [
    { key: 'profile', component: <ProfileInfo navigation={navigation} />},
    { key: 'data', component: <WorkOutData />},
    // WorkOutSheets - Näytetään alla
    { key: 'workouts', component: <WorkOutSheets /> },
    { key: 'paddingCOmponen', component: <View style = {{height: 100}}></View>}
    
  ];

  return (
    <SafeAreaView style={styles({ colors, spacing }).container}>
      <FlatList
        data={profileData} 
        renderItem={({ item }) => <View>{item.component}</View>} 
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles({ colors, spacing }).containerScroll} 
      />
    </SafeAreaView>
  );
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
      marginTop: 20,
    },
  });
