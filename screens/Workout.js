import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Pressable,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useTheme, FAB } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AddBox from "../components/AddBox";
import { auth, setDoc, getDoc, updateDoc, collection, firestore, doc } from "../firebase/Config";
import moment from 'moment-timezone';
import NavBar from "../components/NavBar";
import { useUser } from "../context/UseUser";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Workout({route}) {
  const tabBarHeight = useBottomTabBarHeight()
  const { spacing } = useTheme();
  const { workoutName, setWorkoutName, data, setData,
    movementName, setMovementName, setUpdateContent
   } = useUser()
  const [selectedId, setSelectedId] = useState(null);
  const flatListRef = useRef();

  // asettaa movementNamen, jos tulleen routen kautta navigoimalla
  useEffect(() => {
    if (route.params?.workoutName) {
      console.log(route.params.workoutName);
      const savedData = route.params.savedData.movements.map((movement) => ({
        ...movement,
        workoutName: route.params.workoutName, // Lisää workoutName jokaiselle liikkeelle
      }));
      console.log("Tallennetut treenit: ", savedData);
  
      // Päivitä data ja workoutName
      setData(savedData);
      setWorkoutName(route.params.workoutName);
    }
  }, [route.params?.workoutName]);
  
  

  useEffect(()=> {
    console.log("data: ", data)
  }, [data])

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

    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: data.length - 1,
        animated: true,
      });
    }, 100);

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
      // Tyhjennä lomakekentäta
      setMovementName("");
      setWorkoutName("");
      setData([
        {
          id: 1,
          movementName: "",
          sets: [{ id: 1, weight: "", reps: "" }],
        },
      ]);
      setUpdateContent(prevData => (prevData +1)) // tämä tekee firebasedata päivityksen, kun tallennus tapahtuu
    } catch (error) {
      console.log("Error saving workout:", error.message);

      // Näytä virheviesti käyttäjälle
      Alert.alert("Tallennus epäonnistui", error.message, [{ text: "OK" }]);
    }
  };

  return (
    <View style={[styles({ spacing }).page, { height: "100%"}]}>
      <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={[styles({ spacing }).container]}
        >
        <View style={styles({ spacing }).workoutNameInput}>
          <TextInput
            style={styles({ spacing }).text}
            maxLength={40}
            onChangeText={(text) => setWorkoutName(text)}
            value={workoutName}
            placeholder="Treeni 1"
            color='white'
            placeholderTextColor={'white'}
          />
          <FAB style={styles({ spacing }).fab} icon="pencil" size="small" color={'white'} />
        </View>
        <FlatList
          ref={flatListRef}
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
          <Icon name = "content-save" size = {24} color = "black" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}
const styles = ({ spacing }) =>
  StyleSheet.create({
    page: {
      paddingTop: '10%',
      paddingBottom: '4%'
    },
    container: {
      width: '100%',
      height: "100%",
      alignItems: "center",
      marginTop: spacing.medium,
      paddingBottom: '5%'
    },
    workoutNameInput: {
      flexDirection: "row",
      backgroundColor: "#353536",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: 5,
      borderColor: "black",
      borderWidth: 2,
      borderRadius: 10,
      width: "95%",
    },
    text: {
      fontSize: 26,
      width: "80%",
      textAlign: "center",
    },
    fab: {
      backgroundColor: "none",
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
      bottom: '4%',
      right: '7%'
    },
    saveButton: {
      position: "absolute",
      bottom: '4%',
      right: '25%',
      borderWidth: 1,
      borderColor: "black",
      padding: spacing.medium,
      borderRadius: 15,
      backgroundColor: "#B8A90B",
    },
    saveButtonText: {
      fontSize: 20,
    },
  });
