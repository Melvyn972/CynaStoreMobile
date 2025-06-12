import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BackgroundEffects = () => {
  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#F3F4F6', '#FFFFFF', '#C5A0FF']}
        style={styles.gradientBackground}
      />

      {/* Floating Light Effects */}
      <Animated.View style={[styles.floatEffect, styles.floatEffectOne]} />
      <Animated.View style={[styles.floatEffect, styles.floatEffectTwo]} />
      <Animated.View style={[styles.floatEffect, styles.floatEffectThree]} />

      {/* Additional Depth Effects */}
      <Animated.View style={[styles.floatEffect, styles.floatEffectFour]} />
      <Animated.View style={[styles.floatEffect, styles.floatEffectFive]} />

      {/* Light Points */}
      <View style={[styles.lightPoint, styles.lightPointOne]} />
      <View style={[styles.lightPoint, styles.lightPointTwo]} />
      <View style={[styles.lightPoint, styles.lightPointThree]} />
      <View style={[styles.lightPoint, styles.lightPointFour]} />
      <View style={[styles.lightPoint, styles.lightPointFive]} />
      <View style={[styles.lightPoint, styles.lightPointSix]} />
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
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatEffect: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: 'rgba(128, 0, 255, 0.2)',
    blurRadius: 50,
  },
  floatEffectOne: {
    width: 200,
    height: 200,
    top: -100,
    right: -100,
  },
  floatEffectTwo: {
    width: 160,
    height: 160,
    bottom: -100,
    left: -80,
    animationDelay: '2s',
  },
  floatEffectThree: {
    width: 180,
    height: 180,
    top: '50%',
    left: '50%',
    marginLeft: -90,
    marginTop: -90,
    animationDelay: '4s',
  },
  floatEffectFour: {
    width: 160,
    height: 160,
    top: '25%',
    right: '25%',
    animationDelay: '6s',
  },
  floatEffectFive: {
    width: 140,
    height: 140,
    bottom: '25%',
    left: '25%',
    animationDelay: '8s',
  },
  lightPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'purple',
  },
  lightPointOne: {
    top: '25%',
    left: '25%',
  },
  lightPointTwo: {
    top: '30%',
    right: '30%',
    animationDelay: '1s',
  },
  lightPointThree: {
    bottom: '30%',
    left: '30%',
    animationDelay: '3s',
  },
  lightPointFour: {
    bottom: '25%',
    right: '25%',
    animationDelay: '2s',
  },
  lightPointFive: {
    bottom: '15%',
    left: '20%',
    animationDelay: '4s',
  },
  lightPointSix: {
    bottom: '20%',
    right: '20%',
    animationDelay: '5s',
  },
});

export default BackgroundEffects;
