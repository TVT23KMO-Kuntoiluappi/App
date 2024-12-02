import { StyleSheet, Text, View, TextInput, } from 'react-native'
import React, { useState } from 'react'
import { useTheme, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function WorkoutBank() {
  const { colors, spacing } = useTheme()
  const [searchWorkout, setSearchWorkout] = useState('')


  return (
    <View styles={{ height: "100%" }}>
      <View style={styles({ spacing }).container}>
        <View style={styles({ spacing }).searchBox}>
          <TextInput
            style={styles({ spacing }).text}
            maxLength={40}
            onChangeText={(text) => setSearchWorkout(text)}
            value={searchWorkout}
            placeholder="Hae treenejä"
            color="black"
            placeholderTextColor={"black"}
          />
          <FAB style={styles({ spacing }).fab} icon="magnify" size="small" color={'black'} />
        </View>
        <View style={styles({ spacing }).workoutBox}>
          <Text>Arnold's golden six</Text>
        </View>
      </View>
    </View>
  );
}

const styles = ({ spacing }) => StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '20%'
  },
  searchBox: {
    flexDirection: 'row',
    width: '70%',
    justifyContent: 'space-between',
    backgroundColor: '#c7c7c9',
    padding: 10,
    paddingLeft: 20,
    borderRadius: 20,
    marginBottom: '10%'
  },
  text: {
    width: '85%',
  },
  workoutBox: {
    width: '100%',
    minHeight: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c7c7c9'
  },
  fab: {
    backgroundColor: 'none'
  }
})