import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from 'react-native-paper';

export default function Workout() {
  const { colors, spacing } = useTheme()
  return (
    <View>
      <Text>workout</Text>
    </View>
  )
}

const styles = StyleSheet.create({

})