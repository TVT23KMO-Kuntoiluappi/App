import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { IconButton } from "react-native-paper";

export default React.memo(function GalleryImage({
  item,
  onPress,
  colors,
  spacing,
  selectMode,
  isSelected,
  gridSize,
  imageQuality,
}) {
  return (
    <Pressable
      onPress={() => onPress(item)}
      style={styles({ colors, spacing, gridSize }).imageContainer}
    >
      <Image
        source={{ uri: item.url }}
        style={[
          styles({ colors, spacing, gridSize }).image,
          selectMode &&
            isSelected &&
            styles({ colors, spacing, gridSize }).selectedImage,
        ]}
        contentFit="cover"
        transition={200}
        priority={imageQuality === "high" ? "high" : "low"}
      />
      {selectMode && (
        <View style={styles({ colors, spacing, gridSize }).checkbox}>
          <IconButton
            icon={isSelected ? "checkbox-marked" : "checkbox-blank-outline"}
            iconColor={isSelected ? colors.primary : "white"}
            size={24}
          />
        </View>
      )}
    </Pressable>
  );
});

const styles = ({ colors, spacing, gridSize }) =>
  StyleSheet.create({
    imageContainer: {
      width: gridSize === 1 ? "100%" : "48%",
      aspectRatio: 9 / 16,
      marginBottom: spacing.small,
      borderRadius: gridSize === 1 ? 16 : 12,
      overflow: "hidden",
      position: "relative",
      alignSelf: "center",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    selectedImage: {
      opacity: 0.7,
    },
    checkbox: {
      position: "absolute",
      top: 0,
      right: 0,
      backgroundColor: "rgba(0,0,0,0.3)",
      borderRadius: 12,
    },
  });
