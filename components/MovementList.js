import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import { useTheme } from "react-native-paper";
import { Image } from "expo-image";
import {
  RAPID_API
} from "@env"

export default function MovementList() {
  const [movements, setMovements] = useState([
    { id: "1", name: "Kyykky", favorite: false },
    { id: "2", name: "Penkki", favorite: false },
    { id: "3", name: "Mave", favorite: false },
  ]);

  const [aja, setAja] = useState(0)
  const [bodyPartList, setBodyPartList] = useState(
    [
      { "label": "back", "value": "Selkä" },
      { "label": "cardio", "value": "Kardio" },
      { "label": "chest", "value": "Rinta" },
      { "label": "lower arms", "value": "Kyynärvarret" },
      { "label": "lower legs", "value": "Pohkeet" },
      { "label": "neck", "value": "Niskat" },
      { "label": "shoulders", "value": "Hartiat" },
      { "label": "upper arms", "value": "Olkavarret" },
      { "label": "upper legs", "value": "Reidet" },
      { "label": "waist", "value": "Vyötärö" }
    ]
  )
  const [selectedBody, setSelectedBody] = useState()
  const [itemsToFlatList, setItemsToFlatList] = useState([])
  const [expand, setExpand] = useState()
  const { colors, spacing } = useTheme()

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
    console.log("param body: ", bodypart)
    const url = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodypart}?limit=0`;
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
      console.log("Bodyparttien mukaan: ", parsedResult.length)
      console.log("bodypartmalli: ", malli[0])
    } catch (error) {
      console.error("Error:", error)
    }
  }

  useEffect(() => {
    fetchByBodyPart(selectedBody)
  }, [selectedBody])

  const [searchQuery, setSearchQuery] = useState("");

  // Suodata liikkeet hakusanan perusteella
  const filteredMovements = movements.filter((movement) =>
    movement.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Suosikkien lisääminen tai poistaminen
  const toggleFavorite = (id) => {
    setMovements((prevMovements) =>
      prevMovements.map((movement) =>
        movement.id === id
          ? { ...movement, favorite: !movement.favorite }
          : movement
      )
    );
  };

  return (
    <View style={styles({ colors, spacing }).container}>
      {/* Hakupalkki */}
      <View style={styles({ colors, spacing }).searchContainer}>
        <TextInput
          style={styles({ colors, spacing }).searchInput}
          placeholder="Hae liikettä"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FontAwesome name="search" size={24} color="#777" />
      </View>
      <View style={styles({ colors, spacing }).dropDowns}>
        <View style={styles({ colors, spacing }).dropdownWrapper}>
          <Picker
            selectedValue={selectedBody}
            onValueChange={(itemValue) => setSelectedBody(itemValue)}
            style={styles({ colors, spacing }).picker}
          >
            {bodyPartList && bodyPartList.length > 0 ?
              bodyPartList.map((item, index) => (
                <Picker.Item key={index} label={item.value} value={item.label} />
              )) : (
                <Picker.Item label="No data" value="0" />
              )}

          </Picker>

        </View>
      </View>

      {/* Liikelista */}
      <FlatList
        data={itemsToFlatList}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={[styles({ colors, spacing }).movementItem, { height: expand === index ? 500 : 100 }]}>
            <View style={styles({ colors, spacing }).movementHeadline}>
              <Text style={styles({ colors, spacing }).movementText}>{item.name}</Text>
              <View>
                <View style={styles({ colors, spacing }).iconsContainer}>
                  {/* Lisätietojen nuoli */}
                  <View style={styles({ colors, spacing }).workoutSave}>
                    <TouchableOpacity onPress={() => setExpand(expand === index ? null : index)}>
                      <FontAwesome
                        style={{ marginRight: "20%" }}
                        name={expand ? "chevron-up" : "chevron-down"}
                        size={36}
                        color={"#555"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            {expand === index &&
              <View style={styles({ colors, spacing }).gifUrl}>
                <Image
                  source={{ uri: item.gifUrl }}
                  style={{ width: 150, height: 150 }}
                />
              </View> }
            <View>
              {expand === index && <Text>{item.instructions}</Text> }
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = ({ colors, spacing }) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: '100%'
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginRight: 8,
  },
  movementItem: {
    width: '100%',
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 8,
  },
  movementHeadline: {
    width: '100%',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  gifUrl: {
    margin: spacing.medium
  },
  movementText: {
    fontSize: 18,
    color: "#333",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  dropdownWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  dropdown: {
    width: '100%',
    borderColor: '#cccccc',
    zIndex: 5000
  },
  dropdownContainer: {
    width: '100%',
    zIndex: 5000
  },
  dropDowns: {
    flexDirection: 'row',
    width: "90%",
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  picker: {
    backgroundColor: colors.background,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.text,
  },
  dropdownStyle: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.text,
  },
});
