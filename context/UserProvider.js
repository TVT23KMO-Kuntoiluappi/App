import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { createContext, useEffect, useState } from "react";
import {
  uploadUserPicture,
  getUserPicture,
  getDoc,
  doc,
  firestore,
  updateDoc,
  updateProfile,
  updateEmail,
  setDoc,
  collection,
  auth,
  getDocs,
} from "../firebase/Config";
import { UserContext } from "./UserContext";
import { onAuthStateChanged } from "firebase/auth";

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [oneRepMax, setOneRepMax] = useState([]);
  const [workoutName, setWorkoutName] = useState("");
  const [movementName, setMovementName] = useState("");
  const [workOutFirebaseData, setWorkOutFirebaseData] = useState([])
  const [data, setData] = useState([
    {
      id: 1,
      movementName: "",
      sets: [{ id: 1, weight: "", reps: "" }],
    },
  ]);

  useEffect(() => {
    const removeAuthListener = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        getUserData(user.uid);
        fetchProfilePicture();
        getOneRepMax();
        getWorkOutFirebaseData(user.uid)
      }
      setLoading(false);
    });

    return () => removeAuthListener();
  }, []);

  const getUserData = async (userId) => {
    try {
      const docRef = doc(firestore, `users/${userId}/omattiedot/perustiedot`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setFname(userData.firstName || "");
        setLname(userData.lastName || "");
        setUsername(userData.username || "");
        setWeight(userData.weight || "");
        setHeight(userData.height || "");
        setEmail(auth.currentUser?.email || "");
      }
    } catch (error) {
      console.error("Virhe käyttäjätietojen hakemisessa:", error);
    }
  };

  const getWorkOutFirebaseData = async (userId) => {
    try {
      const docRef = collection(firestore, `users/${userId}/tallennetuttreenit`);
      const docSnap = await getDocs(docRef)
      const workouts = docSnap.docs.map(doc => ({
        workoutId: doc.id, // Dokumentin ID
        ...doc.data(), // Dokumentin data
      }));
      setWorkOutFirebaseData(workouts)
      console.log("treenidata: ", workouts)
    } catch (error) {
      console.error("Virhe treenidatan hakemisessa: ", error)
    }
  }

  const fetchProfilePicture = async () => {
    try {
      const profPic = await getUserPicture();
      setProfilePic(
        profPic
      );
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      setProfilePic(require("../screens/images/default-profpic.png"));
    }
  };

  const getOneRepMax = async () => {
    try {
      const userId = auth.currentUser.uid;
      const docRef = doc(firestore, `users/${userId}/omattiedot/nostomaksimit`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setOneRepMax(userData.oneRepMaxList);
      } else {
        throw new Error("Nostomaksimeja ei löytynyt");
      }
    } catch (error) {
      console.log("virhe nostomaksimien hakemisessa: ", error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <UserContext.Provider
      value={{
        user,
        fname,
        setFname,
        lname,
        setLname,
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        weight,
        setWeight,
        height,
        setHeight,
        profilePic,
        setProfilePic,
        oneRepMax,
        setOneRepMax,
        workoutName,
        setWorkoutName,
        data,
        setData,
        movementName,
        setMovementName,
        workOutFirebaseData
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({});

/* esimerkki:

jos on näin:
export const useUser = () => {
    return useContext(UserContext)
}

const { fname, setFname } = useUser()


JOs ei useUseria

const { fname, setFname } = useCOntext(UserContext)

*/
