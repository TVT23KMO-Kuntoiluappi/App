import React from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { View, StyleSheet } from "react-native";

export default function BackgroundBlob() {
  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: -1 }]}>
      <Svg height="100%" width="100%" viewBox="0 0 400 400">
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0" stopColor="#e8f5e9" stopOpacity="0.9" />
            <Stop offset="1" stopColor="#ffffff" stopOpacity="0.7" />
          </LinearGradient>
        </Defs>
        <Path
          d="M48.5,-67.5C64.5,-56.5,80.1,-44.3,85.6,-28.2C91.2,-12.1,86.6,7.9,79.3,26.1C72,44.3,61.9,60.7,47,70.7C32.1,80.7,12.4,84.3,-5.7,81.8C-23.9,79.4,-47.8,70.8,-65.4,55.8C-83,40.8,-94.3,19.4,-92.8,-1.5C-91.4,-22.4,-77.1,-42.8,-59.8,-53.9C-42.4,-64.9,-21.2,-66.6,-1.8,-64.2C17.7,-61.8,35.4,-55.3,48.5,-67.5Z"
          transform="translate(200 200) scale(2)"
          fill="url(#grad)"
        />
      </Svg>
    </View>
  );
}
