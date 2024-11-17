import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState, useMemo } from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import MyTabs from './components/MyTabs';
import MyCustomTheme, { spacing } from './components/MyCustomTheme';
const { LightTheme, DarkTheme } = MyCustomTheme;

const Stack = createNativeStackNavigator();

export default function App(props) {
  const [logged, setLogged] = useState(false)
  const [isDark, setIsDark] = useState(false)

  const theme = useMemo(() => (isDark ? DarkTheme : LightTheme), [isDark])

    return (
      <PaperProvider theme={theme}>
        <NavigationContainer theme ={theme} >
        {logged ? ( 
          <MyTabs />
        ) : (
          <Stack.Navigator>
            <Stack.Screen name="Login">
              {({ navigation }) => <Login setLogged={setLogged} navigation={navigation} />}
            </Stack.Screen>

            <Stack.Screen name="Register" component={Register} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </PaperProvider>
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
