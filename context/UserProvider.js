import { StyleSheet, Text, View } from 'react-native'
import React, { createContext, useEffect, useState } from 'react'
import { uploadUserPicture, getUserPicture, getDoc, doc, firestore, updateDoc, updateProfile, updateEmail, setDoc, collection, auth } from "../firebase/Config"
import { UserContext } from "./UserContext"

export default function UserProvider({children}) {
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [weight, setWeight] = useState("")
    const [height, setHeight] = useState("")
    const [profilePic, setProfilePic] = useState(null)
    const [oneRepMax, setOneRepMax] = useState([])
    const [workoutName, setWorkoutName] = useState("");
    const [movementName, setMovementName] = useState("")
    const [data, setData] = useState([
      {
        id: 1,
        movementName: "",
        sets: [{ id: 1, weight: "", reps: "" }],
      },
    ]);

    const getUserData = async () => {
        try {
          const userId = auth.currentUser.uid; 
          const docRef = doc(firestore, `users/${userId}/omattiedot/perustiedot`);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            console.log("Dokumentti haettu:", docSnap.data());
            const userData = docSnap.data();
            setFname(userData.firstName || "");
            setLname(userData.lastName || "");
            setUsername(userData.username || "");
            setWeight(userData.weight || "");
            setHeight(userData.height || "");
            setEmail(auth.currentUser.email || "")
          } else {
            console.log("Dokumenttia ei löytynyt!");
          }
        } catch (error) {
          console.error("Virhe käyttäjätietojen hakemisessa:", error);
        }
      };

      const fetchProfilePicture = async () => {
        try {
          const profPic = await getUserPicture();
          setProfilePic(profPic);
        } catch (error) {
          console.error('Error fetching profile picture:', error);
        }
      }

      const getOneRepMax = async () => {
        try {
          const userId = auth.currentUser.uid
          const docRef = doc(firestore, `users/${userId}/omattiedot/nostomaksimit`);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()){
            console.log("Dokumentti haettu:", docSnap.data());
            const userData = docSnap.data();
            setOneRepMax(userData.oneRepMaxList)
          } else {
            console.log("Dokumenttia ei löytynyt")
          }
        } catch (error) {
          console.log("virhe nostomaksimien hakemisessa: ", error)
        }
      }

      useEffect(() => {
        fetchProfilePicture()
        getUserData()
        getOneRepMax()

      }, [])

  return (
    <UserContext.Provider value = {{
        fname, setFname, lname, setLname, username, setUsername, email, setEmail, password, setPassword,
        weight, setWeight, height, setHeight, profilePic, setProfilePic, oneRepMax, setOneRepMax, 
        workoutName, setWorkoutName, data, setData, movementName, setMovementName
    }}>
        {children}
    </UserContext.Provider>
  )
}

const styles = StyleSheet.create({})

/* esimerkki:

jos on näin:
export const useUser = () => {
    return useContext(UserContext)
}

const { fname, setFname } = useUser()


JOs ei useUseria

const { fname, setFname } = useCOntext(UserContext)

*/