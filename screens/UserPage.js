import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from 'react-native-paper';
import { useUser } from '../context/UseUser';
import WorkOutSheets from '../components/WorkOutSheets';
import WorkOutData from '../components/WorkOutData';
import ProfileInfo from '../components/ProfileInfo';
import UserWorkOutTemplates from '../components/UserWorkOutTemplates';

export default function UserPage({ navigation }) {
  const { colors, spacing } = useTheme();

  // Profiilitiedot - Näytetään ensimmäisenä
  const profileData = [
    { key: 'profile', component: <ProfileInfo navigation={navigation} />},
    { key: 'templates', component: <UserWorkOutTemplates navigation={navigation} />},
    { key: 'data', component: <WorkOutData />},
    { key: 'workouts', component: <WorkOutSheets /> },
    
    
  ];

  return (
    <SafeAreaView style={styles({ colors, spacing }).container}>
      <View style={styles({colors,spacing}).flatlistwrapper}>
        <FlatList
          data={profileData} 
          renderItem={({ item }) => <View>{item.component}</View>} 
          keyExtractor={(item) => item.key}
          style={styles({ colors, spacing }).flatlist}
          contentContainerStyle={styles({ colors, spacing }).containerScroll} 
        />
      </View>
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
      backgroundColor: colors.background
    },
    flatlistwrapper: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: colors.background
    },
    containerScroll: {
      flexGrow: 1,
      width: "95%",
      alignItems: "center",
      justifyContent: "flex-start",
      marginTop: 30,
      backgroundColor: colors.background,
      
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
    flatlist: {
      backgroundColor: colors.background
    }
  });
