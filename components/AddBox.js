import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useTheme, FAB } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import MyCustomTheme from "../components/MyCustomTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import AddSet from "./AddSet";

export default function AddBox({
  movementName,
  setData,
  movement,
}) {
  const { spacing } = useTheme();

  const addRow = () => {
    setData((prevData) =>
      prevData.map((item) => 
        item.id === movement.id? {
        ...item,
        sets: [
          ...item.sets,
          {
            id: item.sets.length + 1, weight: '', reps: ''
          }
        ],
      } : item
    )
    );
  };

  return (
    <>
      <View style={styles({ spacing }).container}>
        <View style={styles({ spacing }).workoutMovementBox}>
          <View style={styles({ spacing }).workoutMovementName}>
            <TextInput
              style={styles({ spacing }).text}
              maxLength={40}
              onChangeText={(text) => 
                setData((prevData) => 
                  prevData.map((item) =>
                    item.id === movement.id
                      ? {...item, movementName: text }
                    : item)
                  )
                }
              value={movementName}
              placeholder="Liikkeen nimi"
              fontSize='20'
            />
            {/*<FAB style={styles({ spacing }).fab} icon="pencil" size="small" />*/}
            <FAB
              style={styles({ spacing }).fab2}
              icon="trending-up"
              size="small"
            />
          </View>
          <View style={styles({ spacing }).setBoxInfo}>
            <Text style={styles({ spacing }).setBoxInfoText}>Sarjapaino</Text>
            <Text style={styles({ spacing }).setBoxInfoText}>Toistomäärä</Text>
          </View>
          <FlatList
            data={movement.sets}
            keyExtractor={(item) => `${movement.id}-set-${item.id}`}
            extraData={movement.sets}
            renderItem={({ item }) => (
              <AddSet
                set={item}
                movementId={movement.id}
                setData={setData}
              />
            )}
          />
          <View style={styles({ spacing }).addNewSetView}>
            <FAB
              style={styles({ spacing }).addNewSet}
              icon="plus"
              size="small"
              onPress={() => addRow(movement.id)}
            />
            <Text>Lisää uusi sarja</Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = ({ spacing }) =>
  StyleSheet.create({
    container: {
      width: "100%",
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
      marginBottom: 20,
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
      width: "95%",
      padding: 15,
      backgroundColor: "#EFF5D5",
      borderColor: "black",
      borderWidth: 2,
      borderRadius: 20,
    },
    workoutMovementName: {
      width: "100%",
      flexDirection: "row",
      justifyContent: 'space-between',
      borderBottomColor: "black",
      borderBottomWidth: 0.5,
      padding: 2,
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
      marginTop: 35,
    },
    saveButton: {
      position: "absolute",
      bottom: 40,
      borderWidth: 2,
      borderColor: "black",
      padding: spacing.large,
      borderRadius: 50,
      backgroundColor: "#B8A90B",
    },
    saveButtonText: {
      fontSize: spacing.large,
    },
    addNewSetView: {
      flexDirection: "row",
      width: "100%",
      marginTop: 25,
      marginBottom: 15,
      alignItems: "center",
    },
    addNewSet: {
      width: "8%",
      height: 25,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.small,
      borderColor: "black",
      backgroundColor: "#B8A90B",
      borderWidth: 1,
      borderRadius: 0,
    },
  });
