import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import MyTabs from './components/MyTabs';
import MyCustomTheme from './components/MyCustomTheme';
import Register from './screens/Register'

const Stack = createNativeStackNavigator();

export default function App() {
  const [logged, setLogged] = useState(false);

  return (
    <PaperProvider>
      <NavigationContainer theme={MyCustomTheme}>
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
