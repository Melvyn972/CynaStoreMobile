import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';  // Assuming you have the ThemeContext

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.button}>
      <Text style={styles.iconText}>
        {theme === 'dark' ? '🌙' : '🌞'}
      </Text>
      <Text style={styles.buttonText}>
        {theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  iconText: {
    fontSize: 20,
  },
});

export default ThemeToggle;
