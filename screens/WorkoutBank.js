import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useTheme, FAB } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { FontAwesome } from "@expo/vector-icons";
import { useUser } from "../context/UseUser";
import { TouchableOpacityBase } from "react-native";

export default function WorkoutBank() {
  const { colors, spacing } = useTheme();
  const {
    workoutName,
    setWorkoutName,
    data,
    setData,
    movementName,
    setMovementName,
  } = useUser();
  const [searchWorkout, setSearchWorkout] = useState("");
  const [expanded, setExpanded] = useState({});

  const workouts = [
    { id: "1", name: "Arnold's Golden Six", 
      content: [
        "Takakyykky: 4 x 10", 
        "Penkkipunnerrus: 3 x 10",
        "Leuanveto: 3 x maksimitoistot",
        "Pystypunnerrus: 4 x 10",
        "Hauiskääntö: 3 x 10",
        "Istumaannousut: 3 x 15-20"
      ]},
    { id: "2", name: "Jalat", 
      content: [
        "Etukyykky: 3 x 10",
        "Jalkaprässi: 4 x 8",
        "Jalan ojennus laitteessa (etureidet): 3 x 12",
        "Askelkyykyt: 3 x 12",
        "Pohkeet laitteessa: 3 x 12"
      ]},
    { id: "3", name: "Kädet", 
      content: [
        "Pystypunnerrus laitteessa: 3 x 10",
        "Hauiskääntö käsipainoilla: 3 x 10",
        "Hauiskääntö Scott-penkissä: 4 x 10",
        "Ranskalainen punnerrus mutkatangolla: 4 x 8",
        "Pushdown taljassa köydellä: 3 x 12",
        "Vipunostot käsipainoilla: 3 x 12"
      ]},
    { id: "4", name: "Vetävät lihakset", 
      content: [
        "Ylätalja leveä tanko myötäote: 4 x 10",
        "Alatalja kapea kahva: 3 x 12",
        "Hauiskääntö mutkatanko: 3 x 10",
        "Hammerkääntö käsipainoilla: 4 x 8",
        "Takaolkalaite: 3 x 12",
        "Alaselkälaite: 3 x maksimitoistot"
      ]},
    { id: "5", name: "Työntävät lihakset", 
      content: [
        "Penkkipunnerrus käsipainoilla: 4 x 10",
        "Vinopenkki Smith-laitteessa: 3 x 12",
        "Pystypunnerrus käsipainoilla: 4 x 8",
        "Yhden käden push-down taljassa: 3 x 12",
        "Ojentajapunnerrus niskan takaa käsipainolla: 4 x 10",
        "Vipunostot käsipainoilla: 3 x 12"
      ]},
  ];

  // Suodatetut treenit hakutermin perusteella
  const filteredWorkouts = workouts.filter((workout) =>
    workout.name.toLowerCase().includes(searchWorkout.toLowerCase())
  );

  const toggleBox = (boxId) => {
    setExpanded((prevState) => ({
      ...prevState,
      [boxId]: !prevState[boxId],
    }));
  };

  const renderWorkout = (workout) => (
    <View key={workout.id} style={styles({ spacing }).workoutBox}>
      <View style={styles({ spacing }).workoutBoxInfoContainer}>
        <View style={styles({ spacing }).workoutName}>
          <Text style={styles({ spacing }).workoutBoxMainText}>
            {workout.name}
          </Text>
        </View>
        <View style={styles({ spacing }).workoutSave}>
          <TouchableOpacity onPress={() => toggleBox(workout.id)}>
            <FontAwesome
              style={{ marginRight: "20%" }}
              name={expanded[workout.id] ? "chevron-up" : "chevron-down"}
              size={36}
              color={"#555"}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome name={"heart"} size={36} color={"#555"} />
          </TouchableOpacity>
        </View>
      </View>
      {expanded[workout.id] && (
        <View style={styles({ spacing }).workoutContent}>
          {workout.content.map((item, index) => (
            <Text
              style={styles({ spacing }).workoutContentText}
              key={`${workout.id}-content-${index}`}
            >
              {item}
            </Text>
          ))}
        </View>
      )}
    </View>
  )


  return (
    <View style={[styles({ spacing }).page, { height: "100%" }]}>
      <ScrollView>
        <View style={styles({ spacing }).container}>
          <View style={styles({ spacing }).searchBox}>
            <TextInput
              style={styles({ spacing }).text}
              maxLength={40}
              onChangeText={(text) => setSearchWorkout(text)}
              value={searchWorkout}
              placeholder="Hae valmiita treenejä"
              color="black"
              placeholderTextColor={"black"}
            />
            <FAB
              style={styles({ spacing }).fab}
              icon="magnify"
              size="small"
              color={"black"}
            />
          </View>
          {filteredWorkouts.map(renderWorkout)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = ({ spacing }) =>
  StyleSheet.create({
    page: {
      paddingTop: "20%",
      flex: 1,
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
    },
    searchBox: {
      flexDirection: "row",
      width: "70%",
      justifyContent: "space-between",
      backgroundColor: "#c7c7c9",
      padding: 10,
      paddingLeft: 20,
      borderRadius: 20,
      marginBottom: "10%",
    },
    text: {
      width: "85%",
    },
    workoutBox: {
      width: "95%",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: "#e8f5e9",
      marginBottom: "2%",
      overflow: "hidden",
    },
    workoutBoxInfoContainer: {
      flexDirection: "row",
      width: "100%",
      height: 150,
      padding: 10,
      alignItems: "center",
      paddingLeft: "5%",
      alignSelf: "flex-start",
    },
    workoutName: {
      width: "65%",
    },
    workoutSave: {
      width: "35%",
      flexDirection: "row",
    },
    workoutBoxMainText: {
      fontSize: spacing.large,
    },
    workoutContent: {
      width: "100%",
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 40,
    },
    workoutContentText: {
      fontSize: 20,
      margin: 10,
      fontWeight: "bold",
      borderBottomWidth: 0.25,
      borderBottomColor: "black",
      paddingBottom: "1%",
    },
    fab: {
      backgroundColor: "none",
    },
  });
