import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackgroundEffects from '../components/BackgroundEffects';

const TermsScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8ff' }}>
      <BackgroundEffects />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#7c3aed" />
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>
        {/* Header */}
        <Text style={styles.title}>Conditions d'utilisation</Text>
        <Text style={styles.subtitle}>Veuillez lire attentivement ces conditions avant d'utiliser CynaStore</Text>
        {/* General Terms */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1. Objet</Text>
          <Text style={styles.sectionDesc}>Les présentes conditions générales d'utilisation ("CGU") régissent l'accès et l'utilisation de la plateforme CynaStore, ses services et fonctionnalités.</Text>
        </View>
        {/* User Obligations */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>2. Obligations de l'utilisateur</Text>
          <Text style={styles.sectionDesc}>L'utilisateur s'engage à utiliser la plateforme conformément à la loi et à ne pas porter atteinte à la sécurité, l'intégrité ou la disponibilité des services. Toute tentative de fraude, d'accès non autorisé ou d'usage abusif entraînera la suspension immédiate du compte.</Text>
        </View>
        {/* Intellectual Property */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>3. Propriété intellectuelle</Text>
          <Text style={styles.sectionDesc}>Tous les contenus, marques, logos, textes, images, logiciels et fonctionnalités présents sur la plateforme sont protégés par le droit d'auteur et restent la propriété exclusive de Cyna ou de ses partenaires. Toute reproduction ou utilisation non autorisée est strictement interdite.</Text>
        </View>
        {/* Liability */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>4. Responsabilité</Text>
          <Text style={styles.sectionDesc}>CynaStore met tout en œuvre pour assurer la sécurité et la disponibilité de ses services, mais ne saurait être tenue responsable des interruptions, pertes de données ou dommages indirects liés à l'utilisation de la plateforme.</Text>
        </View>
        {/* Contact */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.sectionDesc}>Pour toute question relative aux présentes conditions, contactez-nous à <Text style={styles.link}>supportcyna@gmail.com</Text></Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backText: { color: '#7c3aed', fontWeight: 'bold', marginLeft: 6, fontSize: 15 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#23234b', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#6b7280', marginBottom: 24, textAlign: 'center' },
  card: { backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 24, padding: 20, marginBottom: 24, shadowColor: '#a78bfa', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#23234b', marginBottom: 12 },
  sectionDesc: { color: '#6b7280', marginBottom: 8 },
  link: { color: '#7c3aed', textDecorationLine: 'underline' },
});

export default TermsScreen; 