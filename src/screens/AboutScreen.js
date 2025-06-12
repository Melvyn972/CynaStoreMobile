import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const AboutScreen = ({ navigation }) => {
  const { theme, mode } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base100,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingVertical: 40,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: mode === 'dark' ? theme.base200 + '80' : theme.base100 + 'CC',
      borderWidth: 1,
      borderColor: mode === 'dark' ? theme.neutral : theme.base300,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 32,
      alignSelf: 'flex-start',
    },
    backButtonText: {
      fontSize: 14,
      color: theme.baseContent,
      marginLeft: 8,
    },
    header: {
      alignItems: 'center',
      marginBottom: 32,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.baseContent,
      textAlign: 'center',
      marginBottom: 16,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary + '20',
      borderWidth: 1,
      borderColor: theme.primary + '30',
      borderRadius: theme.borderRadius['3xl'],
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    badgeIcon: {
      fontSize: 16,
      marginRight: 8,
    },
    badgeText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.primary,
    },
    content: {
      marginBottom: 24,
    },
    sectionContainer: {
      marginBottom: 32,
    },
    sectionHeader: {
      alignItems: 'center',
      marginBottom: 24,
    },
    sectionIconContainer: {
      width: 32,
      height: 32,
      borderRadius: theme.borderRadius.xl,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionIcon: {
      fontSize: 16,
      color: theme.primaryContent,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 8,
    },
    sectionDescription: {
      fontSize: 14,
      color: theme.neutralContent,
      textAlign: 'center',
      lineHeight: 20,
    },
    missionText: {
      fontSize: 16,
      color: theme.primary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 16,
    },
    highlightText: {
      fontWeight: 'bold',
      color: theme.baseContent,
    },
    actionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    actionCard: {
      backgroundColor: mode === 'dark' ? theme.base200 + '80' : theme.base100 + 'CC',
      borderRadius: theme.borderRadius.xl,
      padding: 20,
      marginBottom: 16,
      width: '48%',
      alignItems: 'center',
    },
    actionCardFull: {
      width: '100%',
    },
    actionIconContainer: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.xl,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    actionIcon: {
      fontSize: 24,
      color: theme.primaryContent,
    },
    actionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.baseContent,
      marginBottom: 8,
      textAlign: 'center',
    },
    actionDescription: {
      fontSize: 12,
      color: theme.neutralContent,
      textAlign: 'center',
      lineHeight: 18,
    },
    teamGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    teamCard: {
      backgroundColor: mode === 'dark' ? theme.base200 + '80' : theme.base100 + 'CC',
      borderRadius: theme.borderRadius.xl,
      padding: 24,
      marginBottom: 16,
      width: '48%',
      alignItems: 'center',
    },
    teamCardFull: {
      width: '100%',
    },
    avatarContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatarText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.primaryContent,
    },
    memberName: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.baseContent,
      marginBottom: 8,
    },
    memberRole: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.primary,
      marginBottom: 12,
    },
    memberDescription: {
      fontSize: 12,
      color: theme.neutralContent,
      textAlign: 'center',
      lineHeight: 18,
    },
    objectiveText: {
      fontSize: 16,
      color: theme.primary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 24,
    },
    buttonsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 16,
      marginBottom: 24,
    },
    linkButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: mode === 'dark' ? theme.base200 + '80' : theme.base100 + 'CC',
      borderWidth: 1,
      borderColor: mode === 'dark' ? theme.neutral : theme.base300,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    linkButtonIcon: {
      fontSize: 16,
      color: theme.baseContent,
      marginRight: 8,
    },
    linkButtonText: {
      fontSize: 14,
      color: theme.baseContent,
    },
    lastUpdate: {
      textAlign: 'center',
      marginTop: 24,
    },
    lastUpdateText: {
      fontSize: 12,
      color: theme.neutralContent,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Bouton retour */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Retour à l'accueil</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>À propos de Cyna</Text>
          <View style={styles.badge}>
            <Text style={[styles.badgeIcon, { color: theme.primary }]}>🔒</Text>
            <Text style={styles.badgeText}>Protection des données & vie privée</Text>
          </View>
        </View>

        {/* Mission */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconContainer, { backgroundColor: theme.secondary }]}>
              <Text style={styles.sectionIcon}>⚡</Text>
            </View>
            <Text style={styles.sectionTitle}>Notre Mission</Text>
          </View>
          
          <Text style={styles.missionText}>
            Chez <Text style={styles.highlightText}>Cyna</Text>, la confidentialité et la sécurité de vos données sont au cœur de nos priorités.
          </Text>

          <View style={styles.actionGrid}>
            <View style={styles.actionCard}>
              <View style={[styles.actionIconContainer, { backgroundColor: theme.info }]}>
                <Text style={styles.actionIcon}>✓</Text>
              </View>
              <Text style={styles.actionTitle}>Vérifiez</Text>
              <Text style={styles.actionDescription}>Nos pratiques de sécurité et de confidentialité</Text>
            </View>
            
            <View style={styles.actionCard}>
              <View style={[styles.actionIconContainer, { backgroundColor: theme.warning }]}>
                <Text style={styles.actionIcon}>📢</Text>
              </View>
              <Text style={styles.actionTitle}>Signalez</Text>
              <Text style={styles.actionDescription}>Tout problème de sécurité ou de confidentialité</Text>
            </View>
            
            <View style={[styles.actionCard, styles.actionCardFull]}>
              <View style={[styles.actionIconContainer, { backgroundColor: theme.success }]}>
                <Text style={styles.actionIcon}>📋</Text>
              </View>
              <Text style={styles.actionTitle}>Consultez</Text>
              <Text style={styles.actionDescription}>Notre Politique de Confidentialité et RGPD</Text>
            </View>
          </View>
        </View>

        {/* Équipe */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconContainer, { backgroundColor: theme.info }]}>
              <Text style={styles.sectionIcon}>👥</Text>
            </View>
            <Text style={styles.sectionTitle}>Notre Équipe</Text>
            <Text style={styles.sectionDescription}>
              Nous sommes trois développeurs passionnés par la technologie et la sécurité
            </Text>
          </View>
          
          <View style={styles.teamGrid}>
            <View style={styles.teamCard}>
              <View style={[styles.avatarContainer, { backgroundColor: theme.secondary }]}>
                <Text style={styles.avatarText}>M</Text>
              </View>
              <Text style={styles.memberName}>Melvyn</Text>
              <Text style={styles.memberRole}>Frontend & Design</Text>
              <Text style={styles.memberDescription}>Spécialisé dans l'expérience utilisateur et les interfaces modernes</Text>
            </View>
            
            <View style={styles.teamCard}>
              <View style={[styles.avatarContainer, { backgroundColor: theme.info }]}>
                <Text style={styles.avatarText}>T</Text>
              </View>
              <Text style={styles.memberName}>Thomas</Text>
              <Text style={styles.memberRole}>Backend & Base de données</Text>
              <Text style={styles.memberDescription}>Expert en architecture serveur et optimisation des performances</Text>
            </View>
            
            <View style={[styles.teamCard, styles.teamCardFull]}>
              <View style={[styles.avatarContainer, { backgroundColor: theme.success }]}>
                <Text style={styles.avatarText}>N</Text>
              </View>
              <Text style={styles.memberName}>Nijel</Text>
              <Text style={styles.memberRole}>Documentation & Support RGPD</Text>
              <Text style={styles.memberDescription}>Responsable de la conformité et du support technique</Text>
            </View>
          </View>
        </View>

        {/* Objectif */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconContainer, { backgroundColor: theme.warning }]}>
              <Text style={styles.sectionIcon}>🎯</Text>
            </View>
            <Text style={styles.sectionTitle}>Notre Objectif</Text>
          </View>
          
          <Text style={styles.objectiveText}>
            Vous offrir un site <Text style={styles.highlightText}>fiable</Text>, <Text style={styles.highlightText}>rapide</Text> et <Text style={styles.highlightText}>facile à utiliser</Text>, 
            tout en garantissant la plus haute sécurité pour vos données personnelles.
          </Text>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => navigation.navigate('PrivacyPolicy')}
            >
              <Text style={styles.linkButtonIcon}>🔒</Text>
              <Text style={styles.linkButtonText}>Politique de confidentialité</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => navigation.navigate('Terms')}
            >
              <Text style={styles.linkButtonIcon}>📋</Text>
              <Text style={styles.linkButtonText}>Conditions d'utilisation</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.lastUpdate}>
            <Text style={styles.lastUpdateText}>
              Dernière mise à jour : 25 avril 2025
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen; 