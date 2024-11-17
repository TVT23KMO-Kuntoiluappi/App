import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from 'react-native-paper';

export default function UserPage() {
  const { colors, spacing } = useTheme()
  return (
    <View>
      <Text>userPage</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    
})