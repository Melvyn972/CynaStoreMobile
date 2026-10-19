import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

const DemoBadge = () => {
  return (
    <View
      pointerEvents="none"
      accessibilityRole="text"
      accessibilityLabel="Mode démo, données fictives, aucun paiement"
      style={styles.wrap}
    >
      <View style={styles.badge}>
        <Text style={styles.text}>Démo</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 12 : 54,
    right: 12,
    zIndex: 1000,
    elevation: 1000,
  },
  badge: {
    backgroundColor: '#4f46e5',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  text: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default DemoBadge;
