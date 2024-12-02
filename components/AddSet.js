import { StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useTheme, FAB, } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyCustomTheme from '../components/MyCustomTheme';
import Ionicons from '@expo/vector-icons/Ionicons'

export default function AddSet({ 
  setData,
  movementId,
  movement,
  set
}) {
  const { spacing } = useTheme()

  const removeItem = (setId) => {
    setData((prevdata) => 
      prevdata.map((movement) => 
        movement.id === movementId ? {
          ...movement,
          sets: movement.sets
            .filter((set) => set.id !== setId)
            .map((set, index) => ({ ...set, id: index + 1}))
        }
        : movement
      )
    )
  }

  return (
    <>
        <View key={set.id} style={styles({ spacing }).setBox}>
          <Text style={{ width: "5%" }}>{set.id}.</Text>
          <TextInput
            style={styles({ spacing }).setBoxTextInput}
            maxLength={20}
            placeholder="Esim 10"
            placeholderTextColor={'grey'}
            value={set.weight}
            keyboardType = "decimal-pad" //keyboardType = "decimal-pad"
            onChangeText={(text) => {
              setData((prevData) =>
                prevData.map((movement) =>
                  movement.id === movementId
                    ? {
                        ...movement,
                        sets: movement.sets.map((s) =>
                          s.id === set.id ? { ...s, weight: text } : s
                        ),
                      }
                    : movement
                )
              );
            }}
          />
          <TextInput
            style={styles({ spacing }).setBoxTextInput}
            maxLength={20}
            value={set.reps}
            placeholder="Esim 10-15"
            placeholderTextColor={'grey'}
            keyboardType = "decimal-pad"
            onChangeText={(text) => {
              setData((prevData) =>
                prevData.map((movement) =>
                  movement.id === movementId
                    ? {
                        ...movement,
                        sets: movement.sets.map((s) =>
                          s.id === set.id ? { ...s, reps: text } : s
                        ),
                      }
                    : movement
                )
              );
            }}
          />
          <Pressable onPress={() => removeItem(set.id)}>
            <Ionicons name="trash" size={24}/>
          </Pressable>
        </View>
    </>
  );
}


const styles = ({ spacing }) => StyleSheet.create({
    setBox: {
      flexDirection: "row",
      width: "95%",
      justifyContent: 'flex-start',
      alignItems: "center",
      marginTop: spacing.small / 2,
    },
    setBoxInfo: {
      flexDirection: "row",
      marginTop: 20,
      margin: "auto",
      width: "78%",
      justifyContent: "space-between",
    },
    setBoxInfoText: {
      width: "40%",
      marginLeft: 5,
      marginRight: 5,
    },
    setBoxTextInput: {
      width: "42%",
      borderColor: "black",
      borderWidth: 1,
      backgroundColor: "white",
      padding: spacing.small,
      marginLeft: 5,
      marginRight: 5,
    },
    
  });