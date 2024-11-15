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
import MyTabs from './components/MyTabs';
import MyCustomTheme from './components/MyCustomTheme';

const Stack = createNativeStackNavigator();

export default function App(props) {
  const [logged, setLogged] = useState(false)

  if (logged) {
    return (
    <>
      <PaperProvider>
        <NavigationContainer theme ={MyCustomTheme} >
          <MyTabs />
        </NavigationContainer>
        {/*<Login></Login>
        <NavBar></NavBar>*/}
      </PaperProvider>
    </>
  );
} else {
  return <Login setLogged={setLogged} />;
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
