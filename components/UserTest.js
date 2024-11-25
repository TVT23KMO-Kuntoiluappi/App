import { View, Text } from "react-native";
import { useUser } from "../context/UseUser";
import { Image } from "expo-image";

export default function UserTest() {
  const { user, fname, email, weight, height, oneRepMax, profilePic } =
    useUser();

  return (
    <View style={{ padding: 20 }}>
      <Text>Auth tila:</Text>
      <Text>Käyttäjä kirjautunut: {user ? "Kyllä" : "Ei"}</Text>
      <Text>UID: {user?.uid}</Text>
      <Text>Email: {email}</Text>
      <Text>Nimi: {fname}</Text>
      <Text>Paino: {weight}</Text>
      <Text>Pituus: {height}</Text>
      {oneRepMax.map((max, index) => (
        <Text key={index}>
          {max.move}: {max.mass}kg
        </Text>
      ))}
      <Image
        source={
          profilePic
            ? { uri: profilePic }
            : require("../screens/images/default-profpic.png")
        }
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />
    </View>
  );
}
