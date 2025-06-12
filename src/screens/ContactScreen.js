import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackgroundEffects from '../components/BackgroundEffects';

const ContactScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8ff' }}>
      <BackgroundEffects />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#7c3aed" />
          <Text style={styles.backText}>Retour à l'accueil</Text>
        </TouchableOpacity>
        {/* Header */}
        <Text style={styles.title}>Contactez-nous</Text>
        <Text style={styles.paragraph}>Vous avez un besoin ou une question ? Contactez-nous, nous vous répondrons rapidement.</Text>
        {/* Contact Info */}
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Adresse :</Text>
          <Text style={styles.info}>10 rue de Penthièvre, 75008 Paris</Text>
          <Text style={styles.info}>+33 1 89 70 14 36</Text>
          <Text style={styles.info}>contact@cyna-it.fr</Text>
        </View>
        {/* Contact Form */}
        <View style={styles.formBlock}>
          <Text style={styles.label}>Prénom *</Text>
          <TextInput style={styles.input} placeholder="Votre prénom" />
          <Text style={styles.label}>Nom *</Text>
          <TextInput style={styles.input} placeholder="Votre nom" />
          <Text style={styles.label}>E-mail *</Text>
          <TextInput style={styles.input} placeholder="Votre e-mail" keyboardType="email-address" />
          <Text style={styles.label}>Message</Text>
          <TextInput style={[styles.input, {height: 100}]} placeholder="Votre message" multiline />
          <Button title="Envoyer" onPress={() => {}} />
        </View>
        <Text style={styles.link}>← Retour à l'accueil</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backText: { color: '#7c3aed', fontWeight: 'bold', marginLeft: 6, fontSize: 15 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#23234b', marginBottom: 8, textAlign: 'center' },
  paragraph: { fontSize: 16, color: '#6b7280', marginBottom: 24, textAlign: 'center' },
  infoBlock: { backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 24, padding: 20, marginBottom: 24, shadowColor: '#a78bfa', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  label: { fontWeight: 'bold', color: '#23234b', marginBottom: 4 },
  info: { color: '#6b7280', marginBottom: 4 },
  formBlock: { backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 24, padding: 20, shadowColor: '#a78bfa', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  link: { color: '#7c3aed', marginTop: 24, textAlign: 'center', fontWeight: 'bold' },
});

export default ContactScreen; 