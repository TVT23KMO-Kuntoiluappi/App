import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "react-native-paper";
import { Image } from "expo-image";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RAPID_API } from "@env";

export default function MovementList() {
  const [bodyPartList, setBodyPartList] = useState([
    { label: "", value: "Haku lihasryhmittäin" },
    { label: "back", value: "Selkä" },
    { label: "cardio", value: "Kardio" },
    { label: "chest", value: "Rinta" },
    { label: "lower arms", value: "Kyynärvarret" },
    { label: "lower legs", value: "Pohkeet" },
    { label: "neck", value: "Niskat" },
    { label: "shoulders", value: "Hartiat" },
    { label: "upper arms", value: "Olkavarret" },
    { label: "upper legs", value: "Reidet" },
    { label: "waist", value: "Vyötärö" },
  ]);
  const [selectedBody, setSelectedBody] = useState();
  const [itemsToFlatList, setItemsToFlatList] = useState([]);
  const [filteredMovements, setFilteredMovements] = useState([]);
  const [expand, setExpand] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const { colors, spacing } = useTheme();

  useEffect(() => {
    if (!Array.isArray(itemsToFlatList)) {
      setFilteredMovements([]);
      return;
    }
    const filtered = itemsToFlatList.filter((movement) => {
      if (!movement?.name) return false;
      if (!searchQuery.trim()) return true;
      return movement.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredMovements(filtered);
  }, [searchQuery, itemsToFlatList, selectedBody]);

  /*
  async function fetchByTarget(target) {
    console.log("parametri: target ", target)
    const url = `https://exercisedb.p.rapidapi.com/exercises/target/${target}?limit=0`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPID_API,
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      const parsedResult = JSON.parse(result);
      const malli = parsedResult
      setItemsToFlatList(malli)
      console.log("Targettien mukaan: ", parsedResult.length)
      console.log("targetmalli", malli[0])
    } catch (error) {
      console.error("Error:", error)
    }
  }*/

  async function fetchByBodyPart(bodypart) {
    //console.log("param body: ", bodypart)
    const url = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodypart}?limit=0`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": RAPID_API,
        "x-rapidapi-host": "exercisedb.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      const parsedResult = JSON.parse(result);
      const malli = parsedResult;
      setItemsToFlatList(malli);
      //console.log("Bodyparttien mukaan: ", parsedResult.length)
      //console.log("bodypartmalli: ", malli[0])
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    fetchByBodyPart(selectedBody);
    console.log("selectedBody: ", selectedBody);
  }, [selectedBody]);

  return (
    <View style={[styles({ colors, spacing }).container]}>
      {/* Hakupalkki */}
      <View style={styles({ colors, spacing }).searchContainer}>
        <TextInput
          style={styles({ colors, spacing }).searchInput}
          placeholder="Hae liikettä"
          placeholderTextColor={colors?.text}
          value={searchQuery}
          onChangeText={(txt) => setSearchQuery(txt)}
          color={colors?.text}
        />
        <FontAwesome name="search" size={24} color={colors?.text} />
      </View>
      <View style={styles({ colors, spacing }).dropDowns}>
        <View style={styles({ colors, spacing }).dropdownWrapper}>
          <Picker
            selectedValue={selectedBody}
            onValueChange={(itemValue) => setSelectedBody(itemValue)}
            style={styles({ colors, spacing }).picker}
          >
            {bodyPartList && bodyPartList.length > 0 ? (
              bodyPartList.map((item, index) => (
                <Picker.Item
                  key={index}
                  label={item.value}
                  value={item.label}
                  color={colors?.text}
                />
              ))
            ) : (
              <Picker.Item label="No data" value="0" />
            )}
          </Picker>
        </View>
      </View>

      {/* Liikelista */}
      <FlatList
        data={filteredMovements}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles({ colors, spacing }).movementItem,
              { height: expand === index ? 500 : 100 },
            ]}
          >
            <View style={styles({ colors, spacing }).movementHeadline}>
              <View style={styles({ colors, spacing }).movementTextContainer}>
                <Text style={styles({ colors, spacing }).movementText}>
                  {item.name.charAt(0).toUpperCase() +
                    item.name.slice(1).toLowerCase()}
                </Text>
              </View>
              <View style={styles({ colors, spacing }).iconsContainer}>
                {/* Lisätietojen nuoli */}
                <View style={styles({ colors, spacing }).workoutSave}>
                  <TouchableOpacity
                    onPress={() => setExpand(expand === index ? null : index)}
                  >
                    <FontAwesome
                      style={{ marginRight: "20%" }}
                      name={expand ? "chevron-up" : "chevron-down"}
                      size={36}
                      color={colors?.text}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles({ colors, spacing }).infoContainer}>
              {expand === index && (
                <View style={styles({ colors, spacing }).gifUrl}>
                  <Image
                    source={{ uri: item.gifUrl }}
                    style={{ width: 150, height: 150 }}
                  />
                </View>
              )}
              <View>
                {expand === index && (
                  <Text style={styles({ colors, spacing }).instructions}>
                    {item.instructions}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}
      />
      {filteredMovements.length === 0 && (
        <View style={styles({ colors, spacing }).emptyState}>
          <Icon
            name="arrow-up-bold"
            size={40}
            color={colors.text}
            style={{ marginBottom: 20, opacity: 0.6 }}
          />
          <Text
            style={[
              styles({ colors, spacing }).emptyText,
              { marginTop: 15, opacity: 0.6 },
            ]}
          >
            Valitse liikeryhmä ylävalikosta
          </Text>
          <Text
            style={[styles({ colors, spacing }).emptyText, { opacity: 0.6 }]}
          >
            nähdäksesi liikkeet
          </Text>
          <Icon
            name="arm-flex"
            size={50}
            color={colors.text}
            style={{ marginTop: 30, opacity: 0.6 }}
          />
        </View>
      )}
    </View>
  );
}

const styles = ({ colors, spacing }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors?.background,
      width: "100%",
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors?.card,
      padding: 10,
      borderRadius: 8,
      marginBottom: 16,
      marginTop: Platform.OS === "android" ? 2 : 15,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      marginRight: 8,
    },
    movementItem: {
      width: "100%",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: 12,
      backgroundColor: colors.card,
      borderRadius: 8,
      marginBottom: 8,
    },
    movementHeadline: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    gifUrl: {
      margin: spacing.medium,
    },
    movementTextContainer: {
      width: "85%",
    },
    movementText: {
      fontSize: 18,
      color: colors?.text,
    },
    iconsContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      width: "15%",
    },
    dropdownWrapper: {
      flex: 1,
    },
    dropdown: {
      width: "100%",
      //zIndex: 5000,
      backgroundColor: colors?.card,
    },
    dropdownContainer: {
      width: "100%",
      //zIndex: 5000
    },
    dropDowns: {
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
    },
    picker: {
      backgroundColor: colors?.card,
      color: colors.text,
      borderWidth: 0.5,
      borderColor: colors.text,
      borderRadius: 8,
      marginBottom: 15,
      maxHeight: 140,
      justifyContent: "center",
      overflow: "scroll",
    },
    dropdownStyle: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.text,
    },
    instructions: {
      letterSpacing: 1,
      textAlign: "justify",
      color: colors?.text,
    },
    infoContainer: {
      alignItems: "center",
      padding: 10,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: 180,
    },
    emptyText: {
      color: colors.text,
      fontSize: 18,
      textAlign: "center",
    },
  });
