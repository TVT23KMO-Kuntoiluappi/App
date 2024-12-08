import { StyleSheet, Text, View, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import UserTest from "../components/UserTest";
import MovementList from "../components/MovementList"; // Uusi komponentti

export default function MovementBank() {
  const { colors, spacing } = useTheme();
  const [ aja, setAja ] = useState(0)
  const [ movements, setMovements ] = useState([])


  async function fetchExcerciseDb(params) {
    const url = 'https://exercisedb.p.rapidapi.com/exercises?limit=2000&offset=0';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '6cb780d7e3mshb982195cbbae1d5p168725jsne5fd5faad322',
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      const parsedResult = JSON.parse(result);
      const malli = parsedResult[1323]
      console.log("pituus: ", parsedResult.length)
      console.log("tuloS!", malli);
      console.log("nimi: ", malli.name)
      console.log("kehonosa:", malli.bodyPart)
      console.log("lihasryhmä: ", malli.target)
      console.log("välineet:", malli.equipment)
      console.log("gif/kuva", malli.gifUrl)
      console.log("ohjeet: ", malli.instructions)

      
      /*const movements = parsedResult.map((movement) => ({
        id: movement.id.toString(),
        name: movement.name,
        description: movement.instructions?.join('\n') || '',
        favorite: false,
      }))
      setMovements(movements)*/
      
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function fetchTargetList(params) {
    const url = 'https://exercisedb.p.rapidapi.com/exercises/targetList';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '6cb780d7e3mshb982195cbbae1d5p168725jsne5fd5faad322',
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      const parsedResult = JSON.parse(result);
      const malli = parsedResult[0]
      console.log("targetlistpituus: ", parsedResult.length)
      console.log("targetList: ", malli)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  async function fetchBodypartList(params) {
    const url = 'https://exercisedb.p.rapidapi.com/exercises/bodyPartList';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '6cb780d7e3mshb982195cbbae1d5p168725jsne5fd5faad322',
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      const parsedResult = JSON.parse(result);
      const malli = parsedResult[0]
      console.log("bodypartList: ", parsedResult.length)
      console.log("targetList: ", malli)
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(()=>{
    fetchExcerciseDb()
    fetchBodypartList()
    fetchTargetList()
    console.log("ajobutton", aja)
  },[aja])



  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MovementList />
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
