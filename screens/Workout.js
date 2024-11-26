import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Dimensions
} from "react-native";
import React, { useState } from "react";
import { useTheme, FAB } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AddBox from "../components/AddBox";
import { auth, setDoc, getDoc, updateDoc, collection, firestore, doc } from "../firebase/Config";
import moment from 'moment-timezone';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Workout(props) {
  const { spacing } = useTheme();
  const [workoutName, setWorkoutName] = useState("");
  const [movementName, setMovementName] = useState("");
  const [weights, setWeights] = useState("");
  const [reps, seReps] = useState("");
  const [data, setData] = useState([
    {
      id: 1,
      movementName: "",
      sets: [{ id: 1, weight: "", reps: "" }],
    },
  ]);
  const [selectedId, setSelectedId] = useState(null);

  const suomenAika = moment()
    .tz("Europe/Helsinki")
    .format("YYYY-MM-DD HH:mm:ss");

  //Lisää uusi liikeboxi
  const addBox = () => {
    setData((prevData) => [
      ...prevData,
      {
        id: prevData.length + 1,
        movementName: '',
        sets: [{ id: 1, weight: '', reps: ''}]
      }
    ])
  };

  // Päivitä sarjat
  const updateSet = (movementId, setId, field, value) => {
    setData((prevData) =>
      prevData.map((movement) =>
        movement.id === movementId
          ? {
              ...movement,
              sets: movement.sets.map((set) =>
                set.id === setId ? { ...set, [field]: value } : set
              ),
            }
          : movement
      )
    );
  };

  async function addWorkout(userId, workoutDetails) {
    const workoutId = suomenAika.replace(/[^a-zA-Z0-9]/g, ':');
    
    const userDetailsRef = doc(collection(firestore, `users/${userId}/tallennetuttreenit`), workoutId);
    try {
      const workoutData = {
        movements: workoutDetails,
        timestamp: suomenAika,
        workoutName: workoutName
      }

      await setDoc(userDetailsRef, workoutData);
      console.log("Treeni lisätty onnistuneesti!");
    } catch (error) {
      console.error("Virhe treenin lisäämisessä:", error);
    }
  }

  const handleSave = async () => {
    try {
      const userId = auth.currentUser.uid
      try {
        await addWorkout(userId, data);
      } catch (error) {
        console.log("Virhe tietojen lisäämisessä Firestoreen:", error);
        throw new Error("Tietojen lisääminen epäonnistui.");
      }

      Alert.alert(
        "Tallennus onnistui!",
        "Hienoa!",
        [{ text: "OK" }]
      );
      // Tyhjennä lomakekentät
      setMovementName("");
      setWorkoutName("");
      setData([
        {
          id: 1,
          movementName: "",
          sets: [{ id: 1, weight: "", reps: "" }],
        },
      ]);
    } catch (error) {
      console.log("Error saving workout:", error.message);

      // Näytä virheviesti käyttäjälle
      Alert.alert("Tallennus epäonnistui", error.message, [{ text: "OK" }]);
    }
  };

  return (
    <SafeAreaView style={styles({ spacing }).container}>
      <View style={styles({ spacing }).workoutNameInput}>
        <TextInput
          style={styles({ spacing }).text}
          maxLength={40}
          onChangeText={(text) => setWorkoutName(text)}
          value={workoutName}
          placeholder="Treeni 1"
        />
        <FAB style={styles({ spacing }).fab} icon="pencil" size="small" />
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        extraData={data}
        renderItem={({ item }) => (
          <AddBox
            movement={item}
            data={data}
            updateSet={updateSet}
            setData={setData}
            selectedId={selectedId}
          />
        )}
      />
      <View style={styles({ spacing }).addBox}>
        <FAB
          style={{
            backgroundColor: "#B8A90B",
            borderWidth: 1,
            borderColor: "black",
          }}
          icon="plus"
          size="medium"
          onPress={addBox}
        />
      </View>
      <TouchableOpacity style={styles({ spacing }).saveButton} onPress={handleSave}>
        <Text style={styles({ spacing }).saveButtonText}>Tallenna</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const styles = ({ spacing }) =>
  StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      marginTop: spacing.medium,
      
    },
    workoutNameInput: {
      flexDirection: "row",
      backgroundColor: "#B8A90B",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: 5,
      borderColor: "black",
      borderWidth: 2,
      borderRadius: 20,
      width: "90%",
    },
    text: {
      fontSize: 26,
      width: "80%",
      textAlign: "center",
    },
    fab: {
      backgroundColor: "none",
    },
    fab2: {
      backgroundColor: "#B8A90B",
      borderColor: "black",
      borderWidth: 1,
    },
    workoutMovementBox: {
      width: "93%",
      padding: 15,
      backgroundColor: "#EFF5D5",
      borderColor: "black",
      borderWidth: 2,
      borderRadius: 20,
    },
    workoutMovementName: {
      width: "95%",
      flexDirection: "row",
      borderBottomColor: "black",
      borderBottomWidth: 0.5,
      padding: 5,
    },
    setBox: {
      flexDirection: "row",
      width: "95%",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    setBoxInfo: {
      flexDirection: "row",
      marginTop: 20,
      margin: "auto",
      width: "78%",
      justifyContent: "space-between",
    },
    setBoxInfoText: {
      width: "50%",
      marginLeft: 5,
      marginRight: 5,
    },
    addBox: {
      width: 'auto',
      height: 'auto',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      position: 'absolute',
      bottom: '7%',
      right: '7%'
    },
    saveButton: {
      position: "absolute",
      bottom: 20,
      borderWidth: 2,
      borderColor: "black",
      padding: spacing.medium,
      borderRadius: 50,
      backgroundColor: "#B8A90B",
    },
    saveButtonText: {
      fontSize: spacing.large,
    },
  });
