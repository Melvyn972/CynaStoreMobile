import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const RGPDSettingsScreen = ({ navigation }) => {
  const { theme, mode } = useTheme();
  const [activeTab, setActiveTab] = useState('consentements');
  const [dataRetention, setDataRetention] = useState('2ans');
  const [consents, setConsents] = useState({
    marketing: false,
    analytics: false,
    thirdParty: false,
  });

  const toggleConsent = (key) => {
    setConsents(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const savePreferences = () => {
    Alert.alert(
      'Préférences enregistrées',
      'Vos préférences RGPD ont été mises à jour avec succès.',
      [{ text: 'OK' }]
    );
  };

  const exportData = () => {
    Alert.alert(
      'Export des données',
      'Votre demande d\'export a été prise en compte. Vous recevrez un email avec vos données sous 48h.',
      [{ text: 'OK' }]
    );
  };

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
    headerIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.success,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    headerIconText: {
      fontSize: 24,
      color: theme.successContent,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.baseContent,
      textAlign: 'center',
    },
    tabsContainer: {
      flexDirection: 'row',
      marginBottom: 32,
      backgroundColor: theme.base200,
      borderRadius: theme.borderRadius.xl,
      padding: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    tabActive: {
      backgroundColor: theme.primary,
      borderRadius: 8,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.neutralContent,
    },
    tabTextActive: {
      color: theme.primaryContent,
    },
    sectionContainer: {
      marginBottom: 32,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    sectionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    sectionIconText: {
      fontSize: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 4,
    },
    sectionDescription: {
      fontSize: 14,
      color: theme.neutralContent,
      lineHeight: 20,
    },
    consentItem: {
      backgroundColor: theme.base200,
      borderRadius: theme.borderRadius.xl,
      padding: 20,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    consentIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    consentInfo: {
      flex: 1,
    },
    consentTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.baseContent,
      marginBottom: 4,
    },
    consentDescription: {
      fontSize: 12,
      color: theme.neutralContent,
      lineHeight: 18,
    },
    retentionOption: {
      backgroundColor: theme.base200,
      borderRadius: theme.borderRadius.xl,
      padding: 20,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    retentionOptionSelected: {
      backgroundColor: theme.primary + '20',
      borderWidth: 2,
      borderColor: theme.primary,
    },
    radioButton: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.neutralContent,
      marginRight: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioButtonSelected: {
      borderColor: theme.primary,
    },
    radioButtonInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.primary,
    },
    retentionInfo: {
      flex: 1,
    },
    retentionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.baseContent,
      marginBottom: 4,
    },
    retentionDescription: {
      fontSize: 12,
      color: theme.neutralContent,
    },
    recommendedBadge: {
      backgroundColor: theme.warning + '20',
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginLeft: 8,
    },
    recommendedText: {
      fontSize: 10,
      color: theme.warning,
      fontWeight: '600',
    },
    actionButton: {
      backgroundColor: theme.primary,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 16,
    },
    actionButtonSecondary: {
      backgroundColor: theme.base200,
      borderWidth: 1,
      borderColor: theme.neutral,
    },
    actionButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.primaryContent,
    },
    actionButtonTextSecondary: {
      color: theme.baseContent,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    emptyIconText: {
      fontSize: 40,
      color: theme.primary,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 8,
    },
    emptyDescription: {
      fontSize: 14,
      color: theme.neutralContent,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  const renderConsentements = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: theme.success + '20' }]}>
          <Text style={[styles.sectionIconText, { color: theme.success }]}>🛡️</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>Gestion des consentements</Text>
          <Text style={styles.sectionDescription}>
            Conformément au Règlement Général de Protection des Données (RGPD), vous pouvez contrôler comment vos données sont utilisées. Votre période de conservation actuelle : <Text style={{ color: theme.success, fontWeight: '600' }}>Conservation 2 ans</Text>
          </Text>
        </View>
      </View>

      <View style={styles.consentItem}>
        <View style={[styles.consentIcon, { backgroundColor: theme.info + '20' }]}>
          <Text style={{ fontSize: 20, color: theme.info }}>📢</Text>
        </View>
        <View style={styles.consentInfo}>
          <Text style={styles.consentTitle}>Communications marketing</Text>
          <Text style={styles.consentDescription}>
            Nous permet de vous envoyer des informations sur nos produits et services
          </Text>
        </View>
        <Switch
          value={consents.marketing}
          onValueChange={() => toggleConsent('marketing')}
          trackColor={{ false: theme.neutral, true: theme.primary + '40' }}
          thumbColor={consents.marketing ? theme.primary : theme.base100}
        />
      </View>

      <View style={styles.consentItem}>
        <View style={[styles.consentIcon, { backgroundColor: theme.secondary + '20' }]}>
          <Text style={{ fontSize: 20, color: theme.secondary }}>📊</Text>
        </View>
        <View style={styles.consentInfo}>
          <Text style={styles.consentTitle}>Analyses et statistiques</Text>
          <Text style={styles.consentDescription}>
            Nous permet d'améliorer notre site en analysant votre usage
          </Text>
        </View>
        <Switch
          value={consents.analytics}
          onValueChange={() => toggleConsent('analytics')}
          trackColor={{ false: theme.neutral, true: theme.primary + '40' }}
          thumbColor={consents.analytics ? theme.primary : theme.base100}
        />
      </View>

      <View style={styles.consentItem}>
        <View style={[styles.consentIcon, { backgroundColor: theme.error + '20' }]}>
          <Text style={{ fontSize: 20, color: theme.error }}>👥</Text>
        </View>
        <View style={styles.consentInfo}>
          <Text style={styles.consentTitle}>Partage avec des tiers</Text>
          <Text style={styles.consentDescription}>
            Nous permet de partager vos données avec nos partenaires
          </Text>
        </View>
        <Switch
          value={consents.thirdParty}
          onValueChange={() => toggleConsent('thirdParty')}
          trackColor={{ false: theme.neutral, true: theme.primary + '40' }}
          thumbColor={consents.thirdParty ? theme.primary : theme.base100}
        />
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={savePreferences}>
        <Text style={styles.actionButtonText}>✓ Enregistrer mes préférences</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHistorique = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: theme.secondary + '20' }]}>
          <Text style={[styles.sectionIconText, { color: theme.secondary }]}>🕒</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>Historique des consentements</Text>
          <Text style={styles.sectionDescription}>
            Consultez l'historique de vos choix de consentement et les modifications apportées à vos préférences.
          </Text>
        </View>
      </View>

      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyIconText}>🛍️</Text>
        </View>
        <Text style={styles.emptyTitle}>Aucun historique</Text>
        <Text style={styles.emptyDescription}>
          Aucun historique de consentement disponible pour le moment.
        </Text>
      </View>
    </View>
  );

  const renderConservation = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: theme.info + '20' }]}>
          <Text style={[styles.sectionIconText, { color: theme.info }]}>💾</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>Conservation des données</Text>
          <Text style={styles.sectionDescription}>
            Choisissez la durée pendant laquelle nous conservons vos données personnelles.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.retentionOption,
          dataRetention === '1an' && styles.retentionOptionSelected
        ]}
        onPress={() => setDataRetention('1an')}
      >
        <View style={[
          styles.radioButton,
          dataRetention === '1an' && styles.radioButtonSelected
        ]}>
          {dataRetention === '1an' && <View style={styles.radioButtonInner} />}
        </View>
        <View style={styles.retentionInfo}>
          <Text style={styles.retentionTitle}>1 an</Text>
          <Text style={styles.retentionDescription}>
            Vos données seront supprimées après 1 an d'inactivité
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.retentionOption,
          dataRetention === '2ans' && styles.retentionOptionSelected
        ]}
        onPress={() => setDataRetention('2ans')}
      >
        <View style={[
          styles.radioButton,
          dataRetention === '2ans' && styles.radioButtonSelected
        ]}>
          {dataRetention === '2ans' && <View style={styles.radioButtonInner} />}
        </View>
        <View style={styles.retentionInfo}>
          <Text style={styles.retentionTitle}>2 ans (recommandé)</Text>
          <Text style={styles.retentionDescription}>
            Vos données seront supprimées après 2 ans d'inactivité
          </Text>
        </View>
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedText}>recommandé</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.retentionOption,
          dataRetention === '3ans' && styles.retentionOptionSelected
        ]}
        onPress={() => setDataRetention('3ans')}
      >
        <View style={[
          styles.radioButton,
          dataRetention === '3ans' && styles.radioButtonSelected
        ]}>
          {dataRetention === '3ans' && <View style={styles.radioButtonInner} />}
        </View>
        <View style={styles.retentionInfo}>
          <Text style={styles.retentionTitle}>3 ans</Text>
          <Text style={styles.retentionDescription}>
            Vos données seront supprimées après 3 ans d'inactivité
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={savePreferences}>
        <Text style={styles.actionButtonText}>✓ Enregistrer mes préférences</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'consentements':
        return renderConsentements();
      case 'historique':
        return renderHistorique();
      case 'conservation':
        return renderConservation();
      default:
        return renderConsentements();
    }
  };

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
          <Text style={styles.backButtonText}>← Retour au profil</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>🛡️</Text>
          </View>
          <Text style={styles.title}>Confidentialité & RGPD</Text>
        </View>

        {/* Boutons d'export et gestion */}
        <TouchableOpacity 
          style={[styles.actionButton, { marginBottom: 8 }]}
          onPress={() => {/* Navigate to consent management */}}
        >
          <Text style={styles.actionButtonText}>🔒 Gérer mes consentements</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.actionButtonSecondary]}
          onPress={exportData}
        >
          <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>📄 Exporter mes données</Text>
        </TouchableOpacity>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'consentements' && styles.tabActive]}
            onPress={() => setActiveTab('consentements')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'consentements' && styles.tabTextActive
            ]}>
              ✓ Consentements
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'historique' && styles.tabActive]}
            onPress={() => setActiveTab('historique')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'historique' && styles.tabTextActive
            ]}>
              🕒 Historique
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'conservation' && styles.tabActive]}
            onPress={() => setActiveTab('conservation')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'conservation' && styles.tabTextActive
            ]}>
              💾 Conservation
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RGPDSettingsScreen; 