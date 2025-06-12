import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Halo = ({ size, colors, style, top, left, right, bottom }) => (
  <View
    style={[
      {
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        top,
        left,
        right,
        bottom,
        opacity: 0.7,
      },
      style,
    ]}
  >
    <LinearGradient
      colors={colors}
      start={{ x: 0.7, y: 0.3 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, borderRadius: size / 2 }}
    />
  </View>
);

const BackgroundEffects = () => {
  return (
    <View style={styles.container} pointerEvents="none">
      {/* Dégradé général */}
      <LinearGradient
        colors={["#f3f4f6", "#fff", "#e9d8fd"]}
        style={styles.gradientBackground}
      />
      {/* Halo lumineux principal, très doux, en haut à droite */}
      <Halo
        size={600}
        colors={["#e9d8fd", "rgba(233,216,253,0.10)", "transparent"]}
        top={-180}
        right={-120}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default BackgroundEffects;
