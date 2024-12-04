import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function MovementList() {
  const [movements, setMovements] = useState([
    { id: "1", name: "Kyykky", favorite: false },
    { id: "2", name: "Penkki", favorite: false },
    { id: "3", name: "Mave", favorite: false },
  ]);

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
    <View style={styles.container}>
      {/* Hakupalkki */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Hae liikettä"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FontAwesome name="search" size={24} color="#777" />
      </View>

      {/* Liikelista */}
      <FlatList
        data={filteredMovements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.movementItem}>
            <Text style={styles.movementText}>{item.name}</Text>
            <View style={styles.iconsContainer}>
              {/* Sydän: suosikki */}
              <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                <FontAwesome
                  name={item.favorite ? "heart" : "heart-o"}
                  size={24}
                  color={item.favorite ? "#f00" : "#555"}
                />
              </TouchableOpacity>
              {/* Lisätietojen nuoli */}
              <FontAwesome name="chevron-down" size={24} color="#777" />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#e8f5e9",
    borderRadius: 8,
    marginBottom: 8,
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
});
