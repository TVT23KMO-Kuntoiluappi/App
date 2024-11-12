import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import Login from './screens/Login';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavBar from './components/NavBar';

const Stack = createNativeStackNavigator();

export default function App(props) {


  return (
    <>
      <PaperProvider>
        <Login></Login>
        <NavBar></NavBar>
      </PaperProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
