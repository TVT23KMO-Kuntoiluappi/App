import { StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Text, PlatformPressable } from "@react-navigation/elements";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Login from "../screens/Login";
import Workout from "../screens/Workout";
import Gallery from "../screens/Gallery";
import UserPage from "../screens/UserPage";
import MovementBank from "../screens/MovementBank";
import Register from "../screens/Register";
import UserSettings from "../screens/UserSettings";
import WorkoutBank from "../screens/WorkoutBank";
import { getUserPicture } from "../firebase/Config";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { useUser } from "../context/UseUser";
import { Keyboard, Platform } from "react-native";

const Tab = createBottomTabNavigator();

function MyTabBar({ state, descriptors, navigation }) {
  const { colors, spacing } = useTheme();
  const { profilePic, setProfilePic, username } = useUser()
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)

  useEffect(() => {
    if (Platform.OS === "android") {
      const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
        setKeyboardVisible(true)
      });
      const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
        setKeyboardVisible(false)
      });

      return () => {
        showSubscription.remove()
        hideSubscription.remove()
      };
    }
  }, []);

  if (isKeyboardVisible && Platform.OS === "android") {
    return null
  }

  return (
    <View style={[styles.bottomNav, { backgroundColor: colors.card }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        // tarvitaan siihen, että reagoi tapBraButton = null, jotta Asetukset ei näy
        if (options.tabBarButton) {
          return options.tabBarButton();
        }

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        // Tämä varalla, jos haluaa jonkun eritoiminnon longpressillä
        const onLongPress = () => {
          console.log("pitkäpainallus");
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        let iconName;
        switch (route.name) {
          case "Login":
            iconName = "login";
            break;
          case "Workout":
            iconName = "dumbbell";
            break;
          case "Gallery":
            iconName = "image";
            break;
          case "Userpage":
            iconName = "account";
            break;
          default:
            iconName = "circle";
        }

        return (
          <PlatformPressable
            key={route.key}
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.navButton}
          >
            {route.name === "Userpage" ? (
              <Image
                source={
                  profilePic
                    ? { uri: profilePic }
                    : require("../screens/images/default-profpic.png")
                }
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                }}
              />
            ) : (
              <Icon
                name={iconName}
                size={40}
                color={isFocused ? colors.primary : colors.text}
              />
            )}
            <Text
              style={[
                styles.navButtonText,
                { color: isFocused ? colors.primary : colors.text },
              ]}
            >
              {route.name === "Userpage" ? username : label}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <MyTabBar {...props} />}
      screenOptions={{ headerShown: false }} // Jos haluaa otsikon ylhäältä pois, niin tähän false
    >
      {/*  <Tab.Screen name="Login" component={Login} />
      <Tab.Screen name="Register" component={Register} />*/}
      <Tab.Screen name="Workout" component={Workout} />
      <Tab.Screen name="Movement" component={MovementBank} />
      {/*<Tab.Screen name="WorkoutBank" component={WorkoutBank} />*/}
      <Tab.Screen name="Gallery" component={Gallery} />
      <Tab.Screen name="Userpage" component={UserPage} />
      <Tab.Screen
        name="Asetukset"
        component={UserSettings}
        options={{ headerShown: true, tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
}

// Register ja Usersetting Jaakolle
// Workout Tanelille
// Gallery Juholle
// MovementBank Antrelle

// ^^Poista kommentit jos haluaa editointivaiheessa päästä navigoimaan sivulle
const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    padding: 8,
  },
  navButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonText: {},
});

export default MyTabs;
