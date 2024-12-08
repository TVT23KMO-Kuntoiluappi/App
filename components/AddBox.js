import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableOpacity
} from "react-native";
import React, { useState } from "react";
import { useTheme, FAB } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import MyCustomTheme from "../components/MyCustomTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import AddSet from "./AddSet";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DataModal from "./DataModal";

export default function AddBox({ movementName, setData, movement }) {
  const { colors, spacing } = useTheme();
  const [modalVisible, setModalVisible] = useState(false)
  const [fromAddBox, setFromAddBox]= useState(false)

  const addRow = () => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === movement.id
          ? {
            ...item,
            sets: [
              ...item.sets,
              {
                id: item.sets.length + 1,
                weight: "",
                reps: "",
              },
            ],
          }
          : item
      )
    );
  };

  const removeBox = (movementId) => {
    setData((prevdata) =>
      prevdata
        .filter((movement) => movement.id !== movementId)
        .map((movement, index) => ({ ...movement, id: index + 1 }))
    )
  }

  return (
    <>
      <KeyboardAvoidingView behavior="padding" style={styles({ colors, spacing }).container}>
        <View style={styles({ colors, spacing }).workoutMovementBox}>
          <View style={styles({ colors, spacing }).workoutMovementName}>
            <TextInput
              style={styles({ colors, spacing }).text}
              maxLength={40}
              onChangeText={(text) =>
                setData((prevData) =>
                  prevData.map((item) =>
                    item.id === movement.id
                      ? { ...item, movementName: text }
                      : item
                  )
                )
              }
              value={movement.movementName}
              placeholder="Liikkeen nimi"
              fontSize={20}
              placeholderTextColor={"grey"}
            />
            <TouchableOpacity onPress={() => {
              console.log("Opening modal");
              setModalVisible(true);
              setFromAddBox(true)
            }}>
              <Icon
                name={"chart-areaspline"}
                size={32}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
          <View style={styles({ colors, spacing }).setBoxInfo}>
            <Text style={styles({ colors, spacing }).setBoxInfoText}>Sarjapaino (kg)</Text>
            <Text style={styles({ colors, spacing }).setBoxInfoText}>Toistomäärä</Text>
          </View>
          <FlatList
            data={movement.sets}
            keyExtractor={(item) => `${movement.id}-set-${item.id}`}
            extraData={movement.sets}
            renderItem={({ item }) => (
              <AddSet set={item} movementId={movement.id} setData={setData} />
            )}
          />
          <View style={styles({ colors, spacing }).addNewSetView}>
            <FAB
              style={styles({ colors, spacing }).addNewSet}
              icon="plus"
              size="small"
              color="white"
              onPress={() => addRow(movement.id)}
            />
            <Text style={styles({ colors, spacing }).text}>Lisää uusi sarja</Text>
          </View>
          <Pressable
            style={styles({ colors, spacing }).removeBox}
            onPress={() => removeBox(movement.id)}
          >
            <Ionicons name="trash" size={24} color={"white"} />
            <Text style={{ color: 'white' }}>Poista liike</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
      <DataModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        name={movement.movementName}
        fromAddBox={fromAddBox}
        setFromAddBox={setFromAddBox}
      />
    </>
  );
}

const styles = ({ colors, spacing }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      marginTop: spacing?.small * 1.5,
    },
    text: {
      fontSize: 26,
      width: "80%",
      textAlign: "center",
      color: colors?.text || 'white'
    },
    fab: {
      backgroundColor: "#353536",
    },
    workoutMovementBox: {
      width: "97%",
      padding: 15,
      backgroundColor: colors?.card || 'white',
      borderColor: "black",
      //borderWidth: 0.5,
      //borderRadius: 5,
    },
    workoutMovementName: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomColor: colors?.text || 'white',
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
      color: colors?.text || 'white'
    },
    addBox: {
      marginTop: 35,
    },
    removeBox: {
      width: '35%',
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
      marginTop: 20,
      padding: 3,
      backgroundColor: '#a1020f',
      borderColor: 'black',
      borderWidth: 1,
      borderRadius: 5
    },
    saveButton: {
      position: "absolute",
      bottom: 40,
      borderWidth: 2,
      borderColor: "black",
      padding: spacing?.large,
      borderRadius: 50,
      backgroundColor: "#B8A90B",
    },
    saveButtonText: {
      fontSize: 24,
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
      marginRight: spacing?.small,
      borderColor: "black",
      backgroundColor: "#353536",
      borderWidth: 1,
      borderRadius: 0,
    },
    text: {
      color: colors?.text
    }
  });
