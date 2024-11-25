import { View, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'

export default function Loading() {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="small" color="#B8A90B" />
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 50
  }
}) 