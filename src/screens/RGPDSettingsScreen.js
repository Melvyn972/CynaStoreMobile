import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../config/api';

const RGPDSettingsScreen = ({ navigation }) => {
  const { theme, mode } = useTheme();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('consentements');
  const [dataRetention, setDataRetention] = useState('2_years');
  const [consents, setConsents] = useState({
    marketing: false,
    analytics: false,
    thirdParty: false,
  });
  const [consentHistory, setConsentHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState('');

  // Load consent data on component mount, but only if authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadConsentData();
    }
  }, [isAuthenticated, authLoading]);

  const loadConsentData = async () => {
    try {
      setIsInitialLoading(true);
      const response = await apiClient.get('/user/consent');
      
      if (response.data) {
        setConsents(response.data.consent || {
          marketing: false,
          analytics: false,
          thirdParty: false,
        });
        setDataRetention(response.data.dataRetentionPeriod || '2_years');
        setConsentHistory(response.data.history || []);
      }
    } catch (error) {
      console.error('Error loading consent data:', error);
      setError('Erreur lors du chargement des préférences');
    } finally {
      setIsInitialLoading(false);
    }
  };

  const toggleConsent = (key) => {
    setConsents(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const savePreferences = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await apiClient.put('/user/consent', {
        consent: consents,
        dataRetentionPeriod: dataRetention
      });
      
      if (response.data) {
        // Reload consent history
        await loadConsentData();
        
        Alert.alert(
          'Préférences enregistrées',
          'Vos préférences RGPD ont été mises à jour avec succès.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      const errorMessage = error.response?.data?.error || 'Une erreur est survenue lors de la sauvegarde';
      setError(errorMessage);
      Alert.alert('Erreur', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await apiClient.get('/user/export-data');
      
      if (response.data) {
        Alert.alert(
          'Export des données',
          'Vos données ont été exportées avec succès. Vous pouvez les consulter dans les paramètres de votre navigateur.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      const errorMessage = error.response?.data?.error || 'Une erreur est survenue lors de l\'export';
      setError(errorMessage);
      Alert.alert('Erreur', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatConsentType = (type) => {
    switch(type) {
      case 'marketing': return 'Communications marketing';
      case 'analytics': return 'Analyses et statistiques';
      case 'thirdParty': return 'Partage avec des tiers';
      default: return type;
    }
  };

  const getRetentionLabel = (period) => {
    switch(period) {
      case '1_year': return 'Conservation 1 an';
      case '2_years': return 'Conservation 2 ans';
      case '3_years': return 'Conservation 3 ans';
      default: return 'Non défini';
    }
  };

  const getRetentionDescription = (period) => {
    switch(period) {
      case '1_year': return 'Vos données seront supprimées après 1 an d\'inactivité';
      case '2_years': return 'Vos données seront supprimées après 2 ans d\'inactivité';
      case '3_years': return 'Vos données seront supprimées après 3 ans d\'inactivité';
      default: return 'Période non définie';
    }
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
    actionButtonDisabled: {
      opacity: 0.6,
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
            Conformément au Règlement Général de Protection des Données (RGPD), vous pouvez contrôler comment vos données sont utilisées. Votre période de conservation actuelle : <Text style={{ color: theme.success, fontWeight: '600' }}>{getRetentionLabel(dataRetention)}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.consentItem}>
        <View style={[styles.consentIcon, { backgroundColor: theme.info + '20' }]}>
          <Text style={{ fontSize: 20, color: theme.info }}>📢</Text>
        </View>
        <View style={styles.consentInfo}>
          <Text style={styles.consentTitle}>{formatConsentType('marketing')}</Text>
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
          <Text style={styles.consentTitle}>{formatConsentType('analytics')}</Text>
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
          <Text style={styles.consentTitle}>{formatConsentType('thirdParty')}</Text>
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

      <TouchableOpacity 
        style={[styles.actionButton, isLoading && styles.actionButtonDisabled]} 
        onPress={savePreferences}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ActivityIndicator size="small" color={theme.primaryContent} style={{ marginRight: 8 }} />
            <Text style={styles.actionButtonText}>Enregistrement...</Text>
          </View>
        ) : (
          <Text style={styles.actionButtonText}>✓ Enregistrer mes préférences</Text>
        )}
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

      {consentHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyIconText}>🕒</Text>
          </View>
          <Text style={styles.emptyTitle}>Aucun historique</Text>
          <Text style={styles.emptyDescription}>
            Aucun historique de consentement disponible pour le moment.
          </Text>
        </View>
      ) : (
        <ScrollView style={{ maxHeight: 400 }}>
          {consentHistory.map((item, index) => (
            <View key={index} style={[styles.consentItem, { marginBottom: 12 }]}>
              <View style={[
                styles.consentIcon, 
                { backgroundColor: item.status ? theme.success + '20' : theme.error + '20' }
              ]}>
                <Text style={{ 
                  fontSize: 20, 
                  color: item.status ? theme.success : theme.error 
                }}>
                  {item.status ? '✓' : '✗'}
                </Text>
              </View>
              <View style={styles.consentInfo}>
                <Text style={styles.consentTitle}>{formatConsentType(item.consentType)}</Text>
                <Text style={styles.consentDescription}>
                  {formatTimestamp(item.timestamp)}
                </Text>
                <Text style={[
                  styles.consentDescription,
                  { 
                    color: item.status ? theme.success : theme.error,
                    fontWeight: '600',
                    marginTop: 4
                  }
                ]}>
                  {item.status ? 'Consentement accordé' : 'Consentement retiré'}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
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
          dataRetention === '1_year' && styles.retentionOptionSelected
        ]}
        onPress={() => setDataRetention('1_year')}
      >
        <View style={[
          styles.radioButton,
          dataRetention === '1_year' && styles.radioButtonSelected
        ]}>
          {dataRetention === '1_year' && <View style={styles.radioButtonInner} />}
        </View>
        <View style={styles.retentionInfo}>
          <Text style={styles.retentionTitle}>{getRetentionLabel('1_year')}</Text>
          <Text style={styles.retentionDescription}>
            {getRetentionDescription('1_year')}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.retentionOption,
          dataRetention === '2_years' && styles.retentionOptionSelected
        ]}
        onPress={() => setDataRetention('2_years')}
      >
        <View style={[
          styles.radioButton,
          dataRetention === '2_years' && styles.radioButtonSelected
        ]}>
          {dataRetention === '2_years' && <View style={styles.radioButtonInner} />}
        </View>
        <View style={styles.retentionInfo}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.retentionTitle}>{getRetentionLabel('2_years')}</Text>
          </View>
          <Text style={styles.retentionDescription}>
            {getRetentionDescription('2_years')}
          </Text>
        </View>
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedText}>recommandé</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.retentionOption,
          dataRetention === '3_years' && styles.retentionOptionSelected
        ]}
        onPress={() => setDataRetention('3_years')}
      >
        <View style={[
          styles.radioButton,
          dataRetention === '3_years' && styles.radioButtonSelected
        ]}>
          {dataRetention === '3_years' && <View style={styles.radioButtonInner} />}
        </View>
        <View style={styles.retentionInfo}>
          <Text style={styles.retentionTitle}>{getRetentionLabel('3_years')}</Text>
          <Text style={styles.retentionDescription}>
            {getRetentionDescription('3_years')}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.actionButton, isLoading && styles.actionButtonDisabled]} 
        onPress={savePreferences}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ActivityIndicator size="small" color={theme.primaryContent} style={{ marginRight: 8 }} />
            <Text style={styles.actionButtonText}>Enregistrement...</Text>
          </View>
        ) : (
          <Text style={styles.actionButtonText}>✓ Enregistrer mes préférences</Text>
        )}
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

  // Show loading screen while checking authentication
  if (authLoading || isInitialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.scrollContainer, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.sectionDescription, { marginTop: 16, textAlign: 'center' }]}>
            {authLoading ? 'Vérification de l\'authentification...' : 'Chargement de vos préférences RGPD...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.scrollContainer, { justifyContent: 'center', alignItems: 'center' }]}>
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>🔐</Text>
            </View>
            <Text style={styles.emptyTitle}>Connexion requise</Text>
            <Text style={styles.emptyDescription}>
              Vous devez vous connecter pour accéder à vos préférences RGPD.
            </Text>
            <TouchableOpacity 
              style={[styles.actionButton, { marginTop: 24, width: 200 }]} 
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.actionButtonText}>Se connecter</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.actionButtonSecondary, { marginTop: 12, width: 200 }]} 
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>← Retour</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Error message */}
        {error && (
          <View style={[styles.consentItem, { backgroundColor: theme.error + '20', marginBottom: 16 }]}>
            <View style={[styles.consentIcon, { backgroundColor: theme.error + '40' }]}>
              <Text style={{ fontSize: 20, color: theme.error }}>⚠️</Text>
            </View>
            <View style={styles.consentInfo}>
              <Text style={[styles.consentTitle, { color: theme.error }]}>Erreur</Text>
              <Text style={[styles.consentDescription, { color: theme.error }]}>{error}</Text>
            </View>
            <TouchableOpacity onPress={() => setError('')}>
              <Text style={{ color: theme.error, fontSize: 20 }}>×</Text>
            </TouchableOpacity>
          </View>
        )}
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
          style={[
            styles.actionButton, 
            styles.actionButtonSecondary,
            isLoading && styles.actionButtonDisabled
          ]}
          onPress={exportData}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ActivityIndicator size="small" color={theme.baseContent} style={{ marginRight: 8 }} />
              <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>Export en cours...</Text>
            </View>
          ) : (
            <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>📄 Exporter mes données</Text>
          )}
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