import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from 'react-native-paper';

export default function Gallery() {
  const { colors, spacing } = useTheme()

  return (
    <View>
      <Text style = {{color: colors.text}}>gallery</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    
})