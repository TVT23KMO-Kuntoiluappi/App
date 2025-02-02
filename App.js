import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useState, useMemo, useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
import MyTabs from "./components/MyTabs";
import MyCustomTheme, { spacing } from "./components/MyCustomTheme";
import Register from "./screens/Register";
import Workout from "./screens/Workout";
import UserProvider from "./context/UserProvider";
import StartScreen from "./components/StartScreen";
import * as SplashScreen from "expo-splash-screen";
import { useUser } from "./context/UseUser";

const { LightTheme, DarkTheme } = MyCustomTheme;
const Stack = createNativeStackNavigator();

export default function App(props) {
  const [logged, setLogged] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return <StartScreen />;
  }

  return (
    <UserProvider>
      <AppContent setLogged={setLogged} logged={logged} />
    </UserProvider>
  );
}

function AppContent({ setLogged, logged }) {
  const { isDark } = useUser();
  const theme = useMemo(() => (isDark ? DarkTheme : LightTheme), [isDark]);

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        style={isDark ? "light" : "dark"}
        backgroundColor={isDark ? theme.colors.navbar : theme.colors.primary}
      />
      <NavigationContainer theme={theme}>
        {logged ? (
          <MyTabs setLogged = {setLogged}/>
        ) : (
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              options={{
                title: "Kirjaudu",
                headerTitleAlign: "center",
              }}
            >
              {({ navigation }) => (
                <Login setLogged={setLogged} navigation={navigation} />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Register"
              options={{
                title: "Rekisteröidy",
                headerTitleAlign: "center",
              }}
            >
              {(props) => <Register {...props} setLogged={setLogged} />}
            </Stack.Screen>
            <Stack.Screen name="Workout" component={Workout} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
