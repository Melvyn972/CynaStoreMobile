import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackgroundEffects from '../components/BackgroundEffects';

const team = [
  { name: 'Melvyn', role: 'Frontend & Design', desc: "Spécialisé dans l'expérience utilisateur et les interfaces modernes", color: ['#a78bfa', '#f472b6'], initial: 'M' },
  { name: 'Thomas', role: 'Backend & Base de données', desc: 'Expert en architecture serveur et optimisation des performances', color: ['#6366f1', '#06b6d4'], initial: 'T' },
  { name: 'Nijel', role: 'Documentation & Support RGPD', desc: 'Responsable de la conformité et du support technique', color: ['#10b981', '#14b8a6'], initial: 'N' },
];

const AboutScreen = ({ navigation }) => {
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
        <Text style={styles.title}>À Propos de Cyna</Text>
        <Text style={styles.subtitle}>Votre partenaire de confiance en cybersécurité</Text>
        {/* Mission */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notre Mission</Text>
          <Text style={styles.sectionDesc}>Protéger et sécuriser l'avenir numérique des entreprises en leur offrant des solutions de cybersécurité innovantes et accessibles. Nous nous engageons à rendre la sécurité informatique simple, efficace et accessible à tous.</Text>
        </View>
        {/* Vision */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notre Vision</Text>
          <Text style={styles.sectionDesc}>Créer un monde numérique où chaque entreprise, quelle que soit sa taille, peut opérer en toute sécurité. Nous aspirons à être le leader de la démocratisation de la cybersécurité en France et en Europe.</Text>
        </View>
        {/* Values */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Nos Valeurs</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionSubtitle}>Innovation</Text>
            <Text style={styles.sectionDesc}>Nous repoussons constamment les limites de la cybersécurité pour offrir des solutions toujours plus performantes.</Text>
            <Text style={styles.sectionSubtitle}>Excellence</Text>
            <Text style={styles.sectionDesc}>Nous visons l'excellence dans chaque aspect de notre service, de la détection à la résolution des menaces.</Text>
            <Text style={styles.sectionSubtitle}>Confiance</Text>
            <Text style={styles.sectionDesc}>La confiance de nos clients est notre plus grande récompense. Nous la méritons chaque jour par notre transparence et notre fiabilité.</Text>
            <Text style={styles.sectionSubtitle}>Accessibilité</Text>
            <Text style={styles.sectionDesc}>Nous rendons la cybersécurité accessible à tous, sans compromis sur la qualité ou la sécurité.</Text>
          </View>
        </View>
        {/* Team */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notre Équipe</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDesc}>Notre équipe est composée d'experts passionnés en cybersécurité, développement, et support client. Chaque membre apporte son expertise unique pour créer une solution complète et efficace.</Text>
            <Text style={styles.sectionDesc}>Nous sommes fiers de notre diversité et de notre culture d'innovation continue. Notre équipe grandit constamment pour répondre aux besoins de nos clients et aux défis de la cybersécurité.</Text>
          </View>
        </View>
        {/* Join Us */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Rejoignez-nous</Text>
          <Text style={styles.sectionDesc}>Vous êtes passionné par la cybersécurité et souhaitez faire partie d'une équipe dynamique ? Découvrez nos opportunités de carrière et rejoignez l'aventure Cyna !</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Voir nos offres</Text>
          </TouchableOpacity>
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
  sectionContent: { marginLeft: 12 },
  sectionSubtitle: { fontWeight: 'bold', color: '#23234b', marginBottom: 4 },
  sectionDesc: { color: '#6b7280', marginBottom: 8 },
  button: { backgroundColor: '#7c3aed', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default AboutScreen; 