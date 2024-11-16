import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState, useMemo } from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import Login from './screens/Login';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavBar from './components/NavBar';
import MyTabs from './components/MyTabs';
import { LightTheme, DarkTheme } from './components/MyCustomTheme';

const Stack = createNativeStackNavigator();

export default function App(props) {
  const [logged, setLogged] = useState(false)
  const [isDark, setIsDark] = useState(false)

  const theme = useMemo(() => (isDark ? DarkTheme : LightTheme), [isDark])

  if (logged) {
    return (
    <>
      <PaperProvider theme={theme}>
        <NavigationContainer theme ={theme} >
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
