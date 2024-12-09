import React from "react";
import { Animated, View, StyleSheet } from "react-native";
import { FAB, IconButton } from "react-native-paper";

export default React.memo(
  ({
    opacity,
    onMenuPress,
    menuIconRef,
    loading,
    takePhoto,
    pickImage,
    colors,
    spacing,
  }) => (
    <>
      <Animated.View
        style={[styles({ colors, spacing }).headerBackground, { opacity }]}
      />
      <Animated.View style={[styles({ colors, spacing }).header, { opacity }]}>
        <View style={styles({ colors, spacing }).menuContainer}>
          <IconButton
            ref={menuIconRef}
            icon="dots-vertical"
            onPress={onMenuPress}
          />
        </View>
        <View style={styles({ colors, spacing }).fabContainer}>
          <FAB
            icon="camera"
            style={[
              styles({ colors, spacing }).fab,
              { backgroundColor: colors.button },
            ]}
            onPress={takePhoto}
            color={colors.buttonText}
            loading={loading}
            theme={{ colors: { primary: colors.button } }}
          />
          <FAB
            icon="image"
            style={[
              styles({ colors, spacing }).fab,
              { backgroundColor: colors.button },
            ]}
            onPress={pickImage}
            color={colors.buttonText}
            loading={loading}
            theme={{ colors: { primary: colors.button } }}
          />
        </View>
      </Animated.View>
    </>
  )
);

const styles = ({ colors, spacing }) =>
  StyleSheet.create({
    headerBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 120,
      backgroundColor: colors.background,
      zIndex: 2,
    },
    header: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 3,
    },
    menuContainer: {
      position: "absolute",
      right: 0,
      top: 63,
      zIndex: 3,
    },
    fabContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: spacing.medium,
      paddingVertical: spacing.medium,
      width: "100%",
      marginTop: 45,
    },
    fab: {
      elevation: 1,
      borderWidth: 1,
      borderColor: colors.text,
    },
  });
