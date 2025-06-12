import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { companyService } from '../services';
import { useAuth } from '../context/AuthContext';

const CompaniesScreen = ({ navigation }) => {
  const { theme, mode } = useTheme();
  const { isAuthenticated } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [invitationModalVisible, setInvitationModalVisible] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [activeTab, setActiveTab] = useState('companies');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    siret: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    tva: '',
    description: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadCompanies(),
        loadInvitations()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Erreur', 'Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  const loadCompanies = async () => {
    try {
      const response = await companyService.getCompanies();
      setCompanies(response.companies || []);
    } catch (error) {
      console.error('Error loading companies:', error);
      throw error;
    }
  };

  const loadInvitations = async () => {
    try {
      const response = await companyService.getInvitations();
      setInvitations(response.invitations || []);
    } catch (error) {
      console.error('Error loading invitations:', error);
      // Non-blocking error - invitations are optional
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const openAddModal = () => {
    setEditingCompany(null);
    setFormData({
      name: '',
      siret: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      tva: '',
      description: ''
    });
    setModalVisible(true);
  };

  const openEditModal = (company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name || '',
      siret: company.siret || '',
      address: company.address || '',
      phone: company.phone || '',
      email: company.email || '',
      website: company.website || '',
      tva: company.tva || '',
      description: company.description || ''
    });
    setModalVisible(true);
  };

  const openInvitationModal = (invitation) => {
    setSelectedInvitation(invitation);
    setInvitationModalVisible(true);
  };

  const saveCompany = async () => {
    if (!formData.name || !formData.siret) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires (Nom et SIRET).');
      return;
    }

    setSaving(true);
    try {
      if (editingCompany) {
        const response = await companyService.updateCompany(editingCompany.id, formData);
        setCompanies(prev => prev.map(company => 
          company.id === editingCompany.id 
            ? { ...company, ...response.company }
            : company
        ));
        Alert.alert('Succès', 'Entreprise modifiée avec succès.');
      } else {
        const response = await companyService.createCompany(formData);
        setCompanies(prev => [...prev, response.company]);
        Alert.alert('Succès', 'Entreprise créée avec succès.');
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving company:', error);
      Alert.alert('Erreur', error.message || 'Une erreur est survenue lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const acceptInvitation = async (invitation) => {
    try {
      setSaving(true);
      await companyService.acceptInvitation(invitation.id);
      await loadData();
      Alert.alert('Succès', 'Invitation acceptée avec succès.');
    } catch (error) {
      console.error('Error accepting invitation:', error);
      Alert.alert('Erreur', error.message || 'Impossible d\'accepter l\'invitation');
    } finally {
      setSaving(false);
    }
  };

  const declineInvitation = async (invitation) => {
    Alert.alert(
      'Refuser l\'invitation',
      'Êtes-vous sûr de vouloir refuser cette invitation ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Refuser',
          style: 'destructive',
          onPress: async () => {
            try {
              setSaving(true);
              await companyService.declineInvitation(invitation.id);
              setInvitations(prev => prev.filter(inv => inv.id !== invitation.id));
              Alert.alert('Information', 'Invitation refusée.');
            } catch (error) {
              console.error('Error declining invitation:', error);
              Alert.alert('Erreur', 'Impossible de refuser l\'invitation');
            } finally {
              setSaving(false);
            }
          }
        }
      ]
    );
  };

  const deleteCompany = (company) => {
    if (company.role !== 'owner') {
      Alert.alert('Erreur', 'Seul le propriétaire peut supprimer l\'entreprise');
      return;
    }

    Alert.alert(
      'Supprimer l\'entreprise',
      `Êtes-vous sûr de vouloir supprimer "${company.name}" ? Cette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              setSaving(true);
              await companyService.deleteCompany(company.id);
              setCompanies(prev => prev.filter(c => c.id !== company.id));
              Alert.alert('Succès', 'Entreprise supprimée avec succès.');
            } catch (error) {
              console.error('Error deleting company:', error);
              Alert.alert('Erreur', error.message || 'Impossible de supprimer l\'entreprise');
            } finally {
              setSaving(false);
            }
          }
        }
      ]
    );
  };

  const leaveCompany = (company) => {
    if (company.role === 'owner') {
      Alert.alert('Erreur', 'Le propriétaire ne peut pas quitter l\'entreprise. Transférez d\'abord la propriété ou supprimez l\'entreprise.');
      return;
    }

    Alert.alert(
      'Quitter l\'entreprise',
      `Êtes-vous sûr de vouloir quitter "${company.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Quitter',
          style: 'destructive',
          onPress: async () => {
            try {
              setSaving(true);
              await companyService.leaveCompany(company.id);
              setCompanies(prev => prev.filter(c => c.id !== company.id));
              Alert.alert('Information', 'Vous avez quitté l\'entreprise.');
            } catch (error) {
              console.error('Error leaving company:', error);
              Alert.alert('Erreur', error.message || 'Impossible de quitter l\'entreprise');
            } finally {
              setSaving(false);
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'owner':
        return theme.primary;
      case 'admin':
        return theme.warning;
      case 'member':
        return theme.info;
      default:
        return theme.neutralContent;
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'owner':
        return 'Propriétaire';
      case 'admin':
        return 'Administrateur';
      case 'member':
        return 'Membre';
      default:
        return role;
    }
  };

  const renderCompanyCard = (company) => (
    <View key={company.id} style={styles.companyCard}>
      <View style={styles.companyHeader}>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{company.name}</Text>
          <View style={[styles.roleChip, { backgroundColor: getRoleColor(company.role) + '20' }]}>
            <Text style={[styles.roleText, { color: getRoleColor(company.role) }]}>
              {getRoleText(company.role)}
            </Text>
          </View>
        </View>
        <View style={styles.companyActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('CompanyDetail', { company })}
          >
            <Ionicons name="eye-outline" size={20} color={theme.primary} />
          </TouchableOpacity>
          {company.role === 'owner' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openEditModal(company)}
            >
              <Ionicons name="create-outline" size={20} color={theme.warning} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => company.role === 'owner' ? deleteCompany(company) : leaveCompany(company)}
          >
            <Ionicons 
              name={company.role === 'owner' ? "trash-outline" : "exit-outline"} 
              size={20} 
              color={theme.error} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.companyDetails}>
        {company.siret && (
          <View style={styles.detailRow}>
            <Ionicons name="document-text-outline" size={16} color={theme.neutralContent} />
            <Text style={styles.detailText}>SIRET: {company.siret}</Text>
          </View>
        )}
        {company.address && (
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={theme.neutralContent} />
            <Text style={styles.detailText}>{company.address}</Text>
          </View>
        )}
        {company.email && (
          <View style={styles.detailRow}>
            <Ionicons name="mail-outline" size={16} color={theme.neutralContent} />
            <Text style={styles.detailText}>{company.email}</Text>
          </View>
        )}
        {company.description && (
          <Text style={styles.companyDescription}>{company.description}</Text>
        )}
      </View>

      <View style={styles.companyFooter}>
        <Text style={styles.createdText}>
          Créée le {formatDate(company.createdAt)}
        </Text>
        {company.members && (
          <Text style={styles.membersText}>
            {company.members.length} membre{company.members.length > 1 ? 's' : ''}
          </Text>
        )}
      </View>
    </View>
  );

  const renderInvitationCard = (invitation) => (
    <TouchableOpacity key={invitation.id} style={styles.invitationCard}>
      <View style={styles.invitationHeader}>
        <View style={styles.invitationIcon}>
          <Ionicons name="business-outline" size={24} color={theme.primary} />
        </View>
        <View style={styles.invitationInfo}>
          <Text style={styles.invitationCompany}>{invitation.companyName}</Text>
          <Text style={styles.invitationInviter}>
            Invité par {invitation.inviterName}
          </Text>
        </View>
        <View style={[styles.roleChip, { backgroundColor: getRoleColor(invitation.role) + '20' }]}>
          <Text style={[styles.roleText, { color: getRoleColor(invitation.role) }]}>
            {getRoleText(invitation.role)}
          </Text>
        </View>
      </View>

      {invitation.message && (
        <Text style={styles.invitationMessage}>{invitation.message}</Text>
      )}

      <View style={styles.invitationFooter}>
        <Text style={styles.invitationDate}>
          Reçue le {formatDate(invitation.receivedAt)}
        </Text>
        <View style={styles.invitationActions}>
          <TouchableOpacity
            style={[styles.invitationActionButton, styles.declineButton]}
            onPress={() => declineInvitation(invitation)}
          >
            <Ionicons name="close" size={16} color={theme.error} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.invitationActionButton, styles.acceptButton]}
            onPress={() => acceptInvitation(invitation)}
          >
            <Ionicons name="checkmark" size={16} color={theme.success} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

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
      borderRadius: 16,
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
      backgroundColor: theme.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.baseContent,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.neutralContent,
      textAlign: 'center',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: theme.neutralContent,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyDescription: {
      fontSize: 16,
      color: theme.neutralContent,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 24,
    },
    emptyButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: theme.borderRadius.xl,
      flexDirection: 'row',
      alignItems: 'center',
    },
    emptyButtonText: {
      color: theme.primaryContent,
      fontSize: 16,
      fontWeight: '600',
      marginRight: 8,
    },
    tabsContainer: {
      flexDirection: 'row',
      backgroundColor: theme.base200,
      borderRadius: theme.borderRadius.xl,
      padding: 4,
      marginBottom: 24,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      borderRadius: theme.borderRadius.lg,
    },
    tabActive: {
      backgroundColor: theme.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.neutralContent,
    },
    tabTextActive: {
      color: theme.primaryContent,
    },
    invitationBadge: {
      backgroundColor: theme.error,
      borderRadius: 10,
      paddingHorizontal: 6,
      paddingVertical: 2,
      marginLeft: 8,
      minWidth: 20,
      alignItems: 'center',
    },
    invitationBadgeText: {
      color: theme.errorContent,
      fontSize: 12,
      fontWeight: 'bold',
    },
    addButton: {
      backgroundColor: theme.primary,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: 16,
      paddingHorizontal: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    addButtonText: {
      color: theme.primaryContent,
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    companyCard: {
      backgroundColor: theme.base200,
      borderRadius: theme.borderRadius.xl,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: mode === 'dark' ? theme.neutral + '40' : theme.base300,
    },
    companyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    companyInfo: {
      flex: 1,
    },
    companyName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 8,
    },
    roleChip: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    roleText: {
      fontSize: 12,
      fontWeight: '600',
    },
    companyActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      backgroundColor: theme.base100,
      borderRadius: 8,
      padding: 8,
      marginLeft: 8,
    },
    companyDetails: {
      marginBottom: 16,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    detailText: {
      fontSize: 14,
      color: theme.neutralContent,
      marginLeft: 8,
      flex: 1,
    },
    companyDescription: {
      fontSize: 14,
      color: theme.baseContent,
      lineHeight: 20,
      marginTop: 8,
    },
    companyFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: theme.neutral + '40',
      paddingTop: 12,
    },
    createdText: {
      fontSize: 12,
      color: theme.neutralContent,
    },
    membersText: {
      fontSize: 12,
      color: theme.neutralContent,
    },
    invitationCard: {
      backgroundColor: theme.base200,
      borderRadius: theme.borderRadius.xl,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.primary + '40',
    },
    invitationHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    invitationIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    invitationInfo: {
      flex: 1,
    },
    invitationCompany: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 4,
    },
    invitationInviter: {
      fontSize: 14,
      color: theme.neutralContent,
    },
    invitationMessage: {
      fontSize: 14,
      color: theme.baseContent,
      lineHeight: 20,
      marginBottom: 12,
      fontStyle: 'italic',
    },
    invitationFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    invitationDate: {
      fontSize: 12,
      color: theme.neutralContent,
    },
    invitationActions: {
      flexDirection: 'row',
    },
    invitationActionButton: {
      borderRadius: 20,
      padding: 8,
      marginLeft: 8,
    },
    acceptButton: {
      backgroundColor: theme.success + '20',
    },
    declineButton: {
      backgroundColor: theme.error + '20',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 60,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    modalContent: {
      backgroundColor: theme.base100,
      borderRadius: theme.borderRadius.xl,
      padding: 24,
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 24,
      textAlign: 'center',
    },
    formGroup: {
      marginBottom: 16,
    },
    formLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.baseContent,
      marginBottom: 8,
    },
    requiredMark: {
      color: theme.error,
    },
    formInput: {
      backgroundColor: theme.base200,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.baseContent,
      borderWidth: 1,
      borderColor: theme.neutral,
    },
    formInputMultiline: {
      height: 80,
      textAlignVertical: 'top',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 24,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: theme.borderRadius.lg,
      alignItems: 'center',
      marginHorizontal: 8,
    },
    modalButtonCancel: {
      backgroundColor: theme.base200,
      borderWidth: 1,
      borderColor: theme.neutral,
    },
    modalButtonSave: {
      backgroundColor: theme.primary,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    modalButtonTextCancel: {
      color: theme.baseContent,
    },
    modalButtonTextSave: {
      color: theme.primaryContent,
    },
  });

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={theme.baseContent} />
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="business-outline" size={24} color={theme.primary} />
            </View>
            <Text style={styles.title}>Mes Entreprises</Text>
            <Text style={styles.subtitle}>Gérez vos entreprises</Text>
          </View>

          <View style={styles.emptyContainer}>
            <Ionicons 
              name="lock-closed-outline" 
              size={64} 
              color={theme.neutralContent} 
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>Connexion requise</Text>
            <Text style={styles.emptyDescription}>
              Vous devez être connecté pour voir vos entreprises.
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.emptyButtonText}>Se connecter</Text>
              <Ionicons name="log-in-outline" size={20} color={theme.primaryContent} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={theme.baseContent} />
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="business-outline" size={24} color={theme.primary} />
            </View>
            <Text style={styles.title}>Mes Entreprises</Text>
            <Text style={styles.subtitle}>Gérez vos entreprises</Text>
          </View>

          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={styles.loadingText}>Chargement des entreprises...</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={theme.baseContent} />
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="business-outline" size={24} color={theme.primary} />
          </View>
          <Text style={styles.title}>Mes entreprises</Text>
          <Text style={styles.subtitle}>
            Gérez vos entreprises et leurs informations
          </Text>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'companies' && styles.tabActive]}
            onPress={() => setActiveTab('companies')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'companies' && styles.tabTextActive
            ]}>
              🏢 Mes entreprises
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'invitations' && styles.tabActive]}
            onPress={() => setActiveTab('invitations')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[
                styles.tabText,
                activeTab === 'invitations' && styles.tabTextActive
              ]}>
                📨 Invitations
              </Text>
              {invitations.length > 0 && (
                <View style={styles.invitationBadge}>
                  <Text style={styles.invitationBadgeText}>{invitations.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {activeTab === 'companies' ? (
          <>
            <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
              <Ionicons name="add" size={20} color={theme.primaryContent} />
              <Text style={styles.addButtonText}>Ajouter une entreprise</Text>
            </TouchableOpacity>

            {companies.length > 0 ? (
              companies.map(renderCompanyCard)
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="business-outline" size={40} color={theme.neutral} />
                </View>
                <Text style={styles.emptyTitle}>Aucune entreprise</Text>
                <Text style={styles.emptyDescription}>
                  Vous n'avez pas encore ajouté d'entreprise.{'\n'}
                  Cliquez sur le bouton ci-dessus pour commencer !
                </Text>
              </View>
            )}
          </>
        ) : (
          <>
            {invitations.length > 0 ? (
              invitations.map(renderInvitationCard)
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="mail-outline" size={40} color={theme.neutral} />
                </View>
                <Text style={styles.emptyTitle}>Aucune invitation</Text>
                <Text style={styles.emptyDescription}>
                  Vous n'avez pas d'invitation en attente.{'\n'}
                  Les invitations apparaîtront ici.
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editingCompany ? 'Modifier l\'entreprise' : 'Ajouter une entreprise'}
              </Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Nom de l'entreprise <Text style={styles.requiredMark}>*</Text>
                </Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  placeholder="Nom de votre entreprise"
                  placeholderTextColor={theme.neutralContent}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  SIRET <Text style={styles.requiredMark}>*</Text>
                </Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.siret}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, siret: text }))}
                  placeholder="14 chiffres"
                  placeholderTextColor={theme.neutralContent}
                  keyboardType="numeric"
                  maxLength={14}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Adresse</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.address}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
                  placeholder="Adresse complète"
                  placeholderTextColor={theme.neutralContent}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Téléphone</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.phone}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                  placeholder="+33 1 23 45 67 89"
                  placeholderTextColor={theme.neutralContent}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                  placeholder="contact@entreprise.fr"
                  placeholderTextColor={theme.neutralContent}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Site web</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.website}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, website: text }))}
                  placeholder="https://www.entreprise.fr"
                  placeholderTextColor={theme.neutralContent}
                  keyboardType="url"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Numéro TVA</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.tva}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, tva: text }))}
                  placeholder="FR1234567890"
                  placeholderTextColor={theme.neutralContent}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={[styles.formInput, styles.formInputMultiline]}
                  value={formData.description}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                  placeholder="Décrivez brièvement votre entreprise..."
                  placeholderTextColor={theme.neutralContent}
                  multiline={true}
                  numberOfLines={3}
                />
              </View>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={[styles.modalButtonText, styles.modalButtonTextCancel]}>
                    Annuler
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSave]}
                  onPress={saveCompany}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color={theme.primaryContent} />
                  ) : (
                    <Text style={[styles.modalButtonText, styles.modalButtonTextSave]}>
                      {editingCompany ? 'Modifier' : 'Ajouter'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CompaniesScreen; 