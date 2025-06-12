import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackgroundEffects from '../components/BackgroundEffects';

const SectionCard = ({ color, icon, title, children }) => (
  <View style={[styles.card, { borderColor: color, backgroundColor: color + '10' }]}>  
    <View style={styles.cardHeader}>
      <Ionicons name={icon} size={22} color={color} style={styles.cardIcon} />
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
    </View>
    {children}
  </View>
);

const AboutScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8ff' }}>
      <BackgroundEffects />
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#7c3aed" />
          <Text style={styles.backText}>Retour à l'accueil</Text>
        </TouchableOpacity>
        <Text style={styles.title}>À propos de Cyna</Text>
        <View style={styles.chipRow}>
          <Ionicons name="shield-checkmark" size={16} color="#a78bfa" style={{ marginRight: 4 }} />
          <Text style={styles.chip}>Protection des données & vie privée</Text>
        </View>

        <SectionCard color="#a78bfa" icon="flash" title="Notre Mission">
          <Text style={[styles.sectionDesc, { color: '#a78bfa', fontWeight: 'bold' }]}>Chez <Text style={{ fontWeight: 'bold', color: '#23234b' }}>Cyna</Text>, la confidentialité et la sécurité de vos données sont au cœur de nos priorités.</Text>
          <View style={styles.missionRow}>
            <View style={styles.missionCard}>
              <Ionicons name="eye" size={28} color="#3b82f6" style={{ marginBottom: 6 }} />
              <Text style={styles.missionTitle}>Vérifiez</Text>
              <Text style={styles.missionDesc}>Vos préférences de confidentialité dans votre compte</Text>
            </View>
            <View style={styles.missionCard}>
              <Ionicons name="alert-circle" size={28} color="#06b6d4" style={{ marginBottom: 6 }} />
              <Text style={styles.missionTitle}>Signalez</Text>
              <Text style={styles.missionDesc}>Toute activité suspecte ou fuite potentielle</Text>
            </View>
            <View style={styles.missionCard}>
              <Ionicons name="document-text" size={28} color="#a78bfa" style={{ marginBottom: 6 }} />
              <Text style={styles.missionTitle}>Consultez</Text>
              <Text style={styles.missionDesc}>Notre Politique de Confidentialité et RGPD</Text>
            </View>
          </View>
        </SectionCard>

        <SectionCard color="#3b82f6" icon="people-circle" title="Notre Équipe">
          <Text style={styles.sectionDesc}>Nous sommes trois développeurs passionnés par la technologie et la sécurité</Text>
          <View style={styles.teamRow}>
            <View style={[styles.teamCard, { borderColor: '#a78bfa' }]}> <Text style={[styles.teamInitial, { backgroundColor: '#a78bfa' }]}>M</Text>
              <Text style={styles.teamName}>Melvyn</Text>
              <Text style={styles.teamRole}>Frontend & Design</Text>
              <Text style={styles.teamDesc}>Spécialisé dans l'expérience utilisateur et les interfaces modernes</Text>
            </View>
            <View style={[styles.teamCard, { borderColor: '#3b82f6' }]}> <Text style={[styles.teamInitial, { backgroundColor: '#3b82f6' }]}>T</Text>
              <Text style={styles.teamName}>Thomas</Text>
              <Text style={styles.teamRole}>Backend & Base de données</Text>
              <Text style={styles.teamDesc}>Expert en architecture serveur et optimisation des performances</Text>
            </View>
            <View style={[styles.teamCard, { borderColor: '#06b6d4' }]}> <Text style={[styles.teamInitial, { backgroundColor: '#06b6d4' }]}>N</Text>
              <Text style={styles.teamName}>Nijel</Text>
              <Text style={styles.teamRole}>Documentation & Support RGPD</Text>
              <Text style={styles.teamDesc}>Responsable de la conformité et du support technique</Text>
            </View>
          </View>
        </SectionCard>

        <SectionCard color="#f59e42" icon="star" title="Notre Objectif">
          <Text style={[styles.sectionDesc, { color: '#a78bfa', fontWeight: 'bold' }]}>Vous offrir un site <Text style={{ color: '#23234b', fontWeight: 'bold' }}>fiable, rapide et facile à utiliser</Text>, tout en garantissant la plus haute sécurité pour vos données personnelles.</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('PrivacyPolicy')}>
              <Ionicons name="document-text-outline" size={16} color="#23234b" style={{ marginRight: 4 }} />
              <Text style={styles.linkBtnText}>Politique de confidentialité</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('Terms')}>
              <Ionicons name="document-text-outline" size={16} color="#23234b" style={{ marginRight: 4 }} />
              <Text style={styles.linkBtnText}>Conditions d'utilisation</Text>
            </TouchableOpacity>
          </View>
        </SectionCard>
        <Text style={styles.link}>Dernière mise à jour : 25 avril 2025</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 18, paddingTop: 60, paddingBottom: 40 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backText: { color: '#7c3aed', fontWeight: 'bold', marginLeft: 6, fontSize: 15 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#7c3aed', marginBottom: 8, textAlign: 'center' },
  chipRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  chip: { backgroundColor: '#ede9fe', color: '#a78bfa', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 4, fontWeight: 'bold', fontSize: 13 },
  card: {
    borderWidth: 2,
    borderRadius: 18,
    marginBottom: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionDesc: {
    fontSize: 15,
    color: '#23234b',
    marginBottom: 8,
  },
  missionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  missionCard: { flex: 1, backgroundColor: '#f3f4f6', borderRadius: 12, alignItems: 'center', marginHorizontal: 4, padding: 12 },
  missionTitle: { fontWeight: 'bold', color: '#23234b', fontSize: 15, marginBottom: 2 },
  missionDesc: { color: '#6b7280', fontSize: 13, textAlign: 'center' },
  teamRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  teamCard: { flex: 1, borderWidth: 2, borderRadius: 12, alignItems: 'center', marginHorizontal: 4, padding: 12, backgroundColor: '#fff' },
  teamInitial: { color: '#fff', fontWeight: 'bold', fontSize: 18, width: 36, height: 36, borderRadius: 18, textAlign: 'center', textAlignVertical: 'center', marginBottom: 6 },
  teamName: { fontWeight: 'bold', color: '#23234b', fontSize: 15 },
  teamRole: { color: '#a78bfa', fontWeight: 'bold', fontSize: 13 },
  teamDesc: { color: '#6b7280', fontSize: 12, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  linkBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ede9fe', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6, marginHorizontal: 6 },
  linkBtnText: { color: '#23234b', fontWeight: 'bold', fontSize: 13 },
  link: { color: '#7c3aed', textDecorationLine: 'underline', marginTop: 10, textAlign: 'center' },
});

export default AboutScreen; 