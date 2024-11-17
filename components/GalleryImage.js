import React from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { Image } from 'expo-image'

export default React.memo(({ 
  item, 
  onPress,
  colors,
  spacing
}) => (
  <View style={styles({ colors, spacing }).imageContainer}>
    <Pressable onPress={() => onPress(item)}>
      <Image 
        source={{ uri: item.url }}
        style={styles({ colors, spacing }).image}
        contentFit="cover"
        transition={1000}
      />
    </Pressable>
  </View>
)) 

const styles = ({ colors, spacing }) => StyleSheet.create({
  imageContainer: {
    width: '48.5%',
    height: 240,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  }
}) 