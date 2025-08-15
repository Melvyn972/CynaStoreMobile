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
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { companyService } from '../services';
import { useAuth } from '../context/AuthContext';
import { getStoredToken } from '../utils/auth';

const CompanyDetailScreen = ({ navigation, route }) => {
  const { theme, mode } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const { company: initialCompany } = route.params;
  const [activeTab, setActiveTab] = useState('info');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [companyData, setCompanyData] = useState(initialCompany);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [members, setMembers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingPurchases, setLoadingPurchases] = useState(true);
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    hasToken: false,
    user: null,
  });
  
  const [editFormData, setEditFormData] = useState({
    name: initialCompany.name || '',
    siret: initialCompany.siret || '',
    address: initialCompany.address || '',
    phone: initialCompany.phone || '',
    email: initialCompany.email || '',
    website: initialCompany.website || '',
    tva: initialCompany.tva || '',
    description: initialCompany.description || ''
  });

  const [inviteFormData, setInviteFormData] = useState({
    email: '',
    role: 'member',
    message: 'Rejoignez notre équipe !'
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (authStatus.isAuthenticated && authStatus.hasToken) {
      loadCompanyDetails();
      loadMembers();
      loadPurchases();
    }
  }, [authStatus.isAuthenticated, authStatus.hasToken, initialCompany.id]);

  const checkAuthStatus = async () => {
    try {
      const token = await getStoredToken();
      console.log('🔍 Debug - Token:', token ? 'Present' : 'Missing');
      console.log('🔍 Debug - IsAuthenticated:', isAuthenticated);
      console.log('🔍 Debug - User:', user);
      
      setAuthStatus({
        isAuthenticated,
        hasToken: !!token,
        user,
      });
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthStatus({
        isAuthenticated: false,
        hasToken: false,
        user: null,
      });
    }
  };

  const loadCompanyDetails = async () => {
    try {
      setLoading(true);
      console.log('📡 Loading company details for:', initialCompany.id);
      const response = await companyService.getCompany(initialCompany.id);
      console.log('✅ Company details loaded:', response);
      setCompanyData(response.company);
      setEditFormData({
        name: response.company.name || '',
        siret: response.company.siret || '',
        address: response.company.address || '',
        phone: response.company.phone || '',
        email: response.company.email || '',
        website: response.company.website || '',
        tva: response.company.tva || '',
        description: response.company.description || ''
      });
    } catch (error) {
      console.error('❌ Error loading company details:', error);
      
      if (error.error === 'Vous devez être connecté') {
        Alert.alert(
          'Connexion requise',
          'Vous devez être connecté pour voir les détails de l\'entreprise. Voulez-vous vous connecter maintenant ?',
          [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Se connecter', onPress: () => navigation.navigate('Login') }
          ]
        );
      } else {
        Alert.alert('Erreur', 'Impossible de charger les détails de l\'entreprise');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMembers = async () => {
    try {
      setLoadingMembers(true);
      console.log('📡 Loading members for company:', initialCompany.id);
      const response = await companyService.getCompanyMembers(initialCompany.id);
      console.log('✅ Members loaded:', response);
      setMembers(response.members || []);
    } catch (error) {
      console.error('❌ Error loading members:', error);
      if (error.error !== 'Vous devez être connecté') {
        // Don't show error for auth issues, already handled above
        console.log('Members loading failed, keeping empty array');
      }
    } finally {
      setLoadingMembers(false);
    }
  };

  const loadPurchases = async () => {
    try {
      setLoadingPurchases(true);
      console.log('📡 Loading purchases for company:', initialCompany.id);
      const response = await companyService.getCompanyOrders(initialCompany.id);
      console.log('✅ Purchases loaded:', response);
      setPurchases(response.orders || []);
    } catch (error) {
      console.error('❌ Error loading purchases:', error);
      if (error.error !== 'Vous devez être connecté') {
        // Don't show error for auth issues, already handled above
        console.log('Purchases loading failed, keeping empty array');
      }
    } finally {
      setLoadingPurchases(false);
    }
  };

  const canEdit = companyData.role === 'owner' || companyData.role === 'admin';
  const canManageMembers = companyData.role === 'owner';

  const saveCompanyInfo = async () => {
    if (!editFormData.name || !editFormData.siret) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setSaving(true);
    try {
      const response = await companyService.updateCompany(companyData.id, editFormData);
      setCompanyData(prev => ({ ...prev, ...response.company }));
      setEditModalVisible(false);
      Alert.alert('Succès', 'Informations mises à jour avec succès.');
    } catch (error) {
      console.error('Error updating company:', error);
      Alert.alert('Erreur', error.message || 'Impossible de mettre à jour les informations');
    } finally {
      setSaving(false);
    }
  };

  const sendInvitation = async () => {
    if (!inviteFormData.email) {
      Alert.alert('Erreur', 'Veuillez saisir un email.');
      return;
    }
    
    setSaving(true);
    try {
      await companyService.inviteMember(companyData.id, {
        email: inviteFormData.email,
        role: inviteFormData.role,
        message: inviteFormData.message
      });
      Alert.alert('Invitation envoyée', `Une invitation a été envoyée à ${inviteFormData.email}.`);
      setInviteFormData({ email: '', role: 'member', message: 'Rejoignez notre équipe !' });
      setInviteModalVisible(false);
    } catch (error) {
      console.error('Error sending invitation:', error);
      // Handle different error types
      if (error.code === 'ECONNABORTED') {
        Alert.alert('Invitation en cours', 'L\'invitation est en cours d\'envoi. Veuillez patienter...');
      } else {
        Alert.alert('Erreur', error.message || 'Impossible d\'envoyer l\'invitation');
      }
    } finally {
      setSaving(false);
    }
  };

  const removeMember = async (member) => {
    if (member.role === 'owner') {
      Alert.alert('Erreur', 'Impossible de supprimer le propriétaire.');
      return;
    }

    Alert.alert(
      'Supprimer le membre',
      `Êtes-vous sûr de vouloir retirer ${member.name} de l'entreprise ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              setSaving(true);
              await companyService.removeMember(companyData.id, member.id);
              setMembers(prev => prev.filter(m => m.id !== member.id));
              Alert.alert('Succès', 'Membre supprimé avec succès.');
            } catch (error) {
              console.error('Error removing member:', error);
              Alert.alert('Erreur', 'Impossible de supprimer le membre');
            } finally {
              setSaving(false);
            }
          }
        }
      ]
    );
  };

  const changeRole = async (member, newRole) => {
    if (member.role === 'owner') {
      Alert.alert('Erreur', 'Impossible de modifier le rôle du propriétaire.');
      return;
    }

    try {
      setSaving(true);
      await companyService.updateMemberRole(companyData.id, member.id, newRole);
      setMembers(prev => prev.map(m => 
        m.id === member.id ? { ...m, role: newRole } : m
      ));
      Alert.alert('Succès', `Rôle de ${member.name} modifié en ${newRole === 'admin' ? 'Administrateur' : 'Membre'}.`);
    } catch (error) {
      console.error('Error changing role:', error);
      Alert.alert('Erreur', 'Impossible de modifier le rôle');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return theme.success;
      case 'pending':
        return theme.warning;
      case 'cancelled':
        return theme.error;
      default:
        return theme.neutralContent;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
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
      marginBottom: 32,
    },
    companyName: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 8,
    },
    companySiret: {
      fontSize: 16,
      color: theme.neutralContent,
      marginBottom: 16,
    },
    roleContainer: {
      backgroundColor: theme.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      alignSelf: 'flex-start',
    },
    roleText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.primary,
    },
    tabsContainer: {
      flexDirection: 'row',
      marginBottom: 24,
      backgroundColor: theme.base200,
      borderRadius: 12,
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
    },
    tabText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.neutralContent,
    },
    tabTextActive: {
      color: theme.primaryContent,
    },
    sectionCard: {
      backgroundColor: theme.base200,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 16,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    detailIcon: {
      marginRight: 12,
      width: 20,
    },
    detailText: {
      fontSize: 14,
      color: theme.baseContent,
      flex: 1,
    },
    editButton: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: 'center',
      marginTop: 16,
    },
    editButtonText: {
      color: theme.primaryContent,
      fontSize: 16,
      fontWeight: '600',
    },
    memberItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.neutral + '20',
    },
    memberAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    memberAvatarText: {
      color: theme.primaryContent,
      fontWeight: 'bold',
      fontSize: 16,
    },
    memberInfo: {
      flex: 1,
    },
    memberName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.baseContent,
    },
    memberEmail: {
      fontSize: 14,
      color: theme.neutralContent,
    },
    memberRole: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.primary,
      marginTop: 2,
    },
    memberActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    roleSelector: {
      backgroundColor: theme.base100,
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginRight: 8,
      minWidth: 80,
    },
    roleSelectorText: {
      fontSize: 12,
      color: theme.baseContent,
      textAlign: 'center',
    },
    removeButton: {
      backgroundColor: theme.error + '20',
      borderRadius: 8,
      padding: 8,
    },
    inviteButton: {
      backgroundColor: theme.success,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: 'center',
      marginTop: 16,
    },
    inviteButtonText: {
      color: theme.successContent,
      fontSize: 16,
      fontWeight: '600',
    },
    purchaseItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.neutral + '20',
    },
    purchaseInfo: {
      flex: 1,
    },
    purchaseDescription: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.baseContent,
    },
    purchaseDate: {
      fontSize: 14,
      color: theme.neutralContent,
    },
    purchaseAmount: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.baseContent,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginTop: 4,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.base100,
      borderRadius: 16,
      padding: 24,
      width: '95%',
      maxWidth: 500,
      maxHeight: '90%',
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
    formInput: {
      backgroundColor: theme.base200,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: theme.baseContent,
      borderWidth: 1,
      borderColor: theme.neutral,
    },
    formInputMultiline: {
      height: 100,
      textAlignVertical: 'top',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 24,
    },
    modalButton: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
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
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyIcon: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.neutral + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 8,
    },
    emptyDescription: {
      fontSize: 14,
      color: theme.neutralContent,
      textAlign: 'center',
    },
    authDebugContainer: {
      alignItems: 'center',
      padding: 20,
    },
    authDebugIcon: {
      backgroundColor: theme.warning + '20',
      borderRadius: 20,
      padding: 12,
      marginBottom: 16,
    },
    authDebugTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.warning,
      marginBottom: 8,
    },
    authDebugText: {
      fontSize: 14,
      color: theme.warning,
    },
    debugInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 16,
    },
    debugInfoText: {
      fontSize: 14,
      color: theme.baseContent,
    },
    loginButton: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: 16,
    },
    loginButtonText: {
      color: theme.primaryContent,
      fontSize: 16,
      fontWeight: '600',
    },
    retryButton: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: 16,
    },
    retryButtonText: {
      color: theme.primaryContent,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const renderInfoTab = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Informations de l'entreprise</Text>
      
      {companyData.description && (
        <View style={styles.detailRow}>
          <Ionicons name="information-circle-outline" size={16} color={theme.neutralContent} style={styles.detailIcon} />
          <Text style={styles.detailText}>{companyData.description}</Text>
        </View>
      )}
      
      <View style={styles.detailRow}>
        <Ionicons name="location-outline" size={16} color={theme.neutralContent} style={styles.detailIcon} />
        <Text style={styles.detailText}>{companyData.address}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Ionicons name="call-outline" size={16} color={theme.neutralContent} style={styles.detailIcon} />
        <Text style={styles.detailText}>{companyData.phone}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Ionicons name="mail-outline" size={16} color={theme.neutralContent} style={styles.detailIcon} />
        <Text style={styles.detailText}>{companyData.email}</Text>
      </View>
      
      {companyData.website && (
        <View style={styles.detailRow}>
          <Ionicons name="globe-outline" size={16} color={theme.neutralContent} style={styles.detailIcon} />
          <Text style={styles.detailText}>{companyData.website}</Text>
        </View>
      )}
      
      {companyData.tva && (
        <View style={styles.detailRow}>
          <Ionicons name="document-outline" size={16} color={theme.neutralContent} style={styles.detailIcon} />
          <Text style={styles.detailText}>TVA: {companyData.tva}</Text>
        </View>
      )}
      
      <View style={styles.detailRow}>
        <Ionicons name="calendar-outline" size={16} color={theme.neutralContent} style={styles.detailIcon} />
        <Text style={styles.detailText}>Créée le {new Date(companyData.createdAt).toLocaleDateString('fr-FR')}</Text>
      </View>

      {canEdit && (
        <TouchableOpacity style={styles.editButton} onPress={() => setEditModalVisible(true)}>
          <Text style={styles.editButtonText}>Modifier les informations</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderMembersTab = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Membres de l'entreprise</Text>
      
      {members.map((member) => (
        <View key={member.id} style={styles.memberItem}>
          <View style={styles.memberAvatar}>
            <Text style={styles.memberAvatarText}>
              {member.name ? member.name.split(' ').filter(n => n.length > 0).map(n => n[0]).join('').toUpperCase() || '?' : '?'}
            </Text>
          </View>
          
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{member.name || 'Nom non disponible'}</Text>
            <Text style={styles.memberEmail}>{member.email || 'Email non disponible'}</Text>
            <Text style={styles.memberRole}>
              {getRoleText(member.role)}
            </Text>
          </View>
          
          {canManageMembers && member.role !== 'owner' && (
            <View style={styles.memberActions}>
              <TouchableOpacity 
                style={styles.roleSelector}
                onPress={() => changeRole(member, member.role === 'admin' ? 'member' : 'admin')}
              >
                <Text style={styles.roleSelectorText}>
                  {member.role === 'admin' ? '→ Membre' : '→ Admin'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeMember(member)}
              >
                <Ionicons name="trash-outline" size={16} color={theme.error} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}

      {canManageMembers && (
        <TouchableOpacity style={styles.inviteButton} onPress={() => setInviteModalVisible(true)}>
          <Text style={styles.inviteButtonText}>+ Inviter un membre</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderPurchasesTab = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Achats de l'entreprise</Text>
      
      {purchases.length > 0 ? (
        purchases.map((purchase) => (
          <View key={purchase.id} style={styles.purchaseItem}>
            <View style={styles.purchaseInfo}>
              <Text style={styles.purchaseDescription}>{purchase.description}</Text>
              <Text style={styles.purchaseDate}>
                {formatDate(purchase.date)}
              </Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(purchase.status) + '20' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: getStatusColor(purchase.status) }
                ]}>
                  {getStatusText(purchase.status)}
                </Text>
              </View>
            </View>
            <Text style={styles.purchaseAmount}>{formatPrice(purchase.amount)}</Text>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="receipt-outline" size={30} color={theme.neutral} />
          </View>
          <Text style={styles.emptyTitle}>Aucun achat</Text>
          <Text style={styles.emptyDescription}>
            Aucun achat n'a encore été effectué par cette entreprise.
          </Text>
        </View>
      )}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return renderInfoTab();
      case 'members':
        return renderMembersTab();
      case 'purchases':
        return renderPurchasesTab();
      default:
        return renderInfoTab();
    }
  };

  // Show auth status debug info if not authenticated
  if (!authStatus.isAuthenticated || !authStatus.hasToken) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={theme.baseContent} />
            <Text style={styles.backButtonText}>Retour aux entreprises</Text>
          </TouchableOpacity>

          <View style={styles.authDebugContainer}>
            <View style={styles.authDebugIcon}>
              <Ionicons name="warning-outline" size={40} color={theme.warning} />
            </View>
            <Text style={styles.authDebugTitle}>Problème d'authentification</Text>
            <Text style={styles.authDebugText}>
              État de la connexion:
            </Text>
            <View style={styles.debugInfo}>
              <Text style={styles.debugInfoText}>
                • Authentifié: {authStatus.isAuthenticated ? '✅ Oui' : '❌ Non'}
              </Text>
              <Text style={styles.debugInfoText}>
                • Token présent: {authStatus.hasToken ? '✅ Oui' : '❌ Non'}
              </Text>
              <Text style={styles.debugInfoText}>
                • Utilisateur: {authStatus.user ? `✅ ${authStatus.user.email}` : '❌ Aucun'}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginButtonText}>Se connecter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={checkAuthStatus}
            >
              <Text style={styles.retryButtonText}>Vérifier à nouveau</Text>
            </TouchableOpacity>
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
      >
        {/* Bouton retour */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={theme.baseContent} />
          <Text style={styles.backButtonText}>Retour aux entreprises</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>{companyData.name}</Text>
          <Text style={styles.companySiret}>SIRET: {companyData.siret}</Text>
          <View style={styles.roleContainer}>
            <Text style={styles.roleText}>
              {getRoleText(companyData.role)}
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'info' && styles.tabActive]}
            onPress={() => setActiveTab('info')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'info' && styles.tabTextActive
            ]}>
              Infos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'members' && styles.tabActive]}
            onPress={() => setActiveTab('members')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'members' && styles.tabTextActive
            ]}>
              Membres
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'purchases' && styles.tabActive]}
            onPress={() => setActiveTab('purchases')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'purchases' && styles.tabTextActive
            ]}>
              Achats
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {renderContent()}
      </ScrollView>

      {/* Modal d'édition des informations */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Modifier l'entreprise</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nom de l'entreprise</Text>
                <TextInput
                  style={styles.formInput}
                  value={editFormData.name}
                  onChangeText={(text) => setEditFormData(prev => ({ ...prev, name: text }))}
                  placeholder="Nom de votre entreprise"
                  placeholderTextColor={theme.neutralContent}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>SIRET</Text>
                <TextInput
                  style={styles.formInput}
                  value={editFormData.siret}
                  onChangeText={(text) => setEditFormData(prev => ({ ...prev, siret: text }))}
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
                  value={editFormData.address}
                  onChangeText={(text) => setEditFormData(prev => ({ ...prev, address: text }))}
                  placeholder="Adresse complète"
                  placeholderTextColor={theme.neutralContent}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Téléphone</Text>
                <TextInput
                  style={styles.formInput}
                  value={editFormData.phone}
                  onChangeText={(text) => setEditFormData(prev => ({ ...prev, phone: text }))}
                  placeholder="+33 1 23 45 67 89"
                  placeholderTextColor={theme.neutralContent}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  style={styles.formInput}
                  value={editFormData.email}
                  onChangeText={(text) => setEditFormData(prev => ({ ...prev, email: text }))}
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
                  value={editFormData.website}
                  onChangeText={(text) => setEditFormData(prev => ({ ...prev, website: text }))}
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
                  value={editFormData.tva}
                  onChangeText={(text) => setEditFormData(prev => ({ ...prev, tva: text }))}
                  placeholder="FR1234567890"
                  placeholderTextColor={theme.neutralContent}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={[styles.formInput, styles.formInputMultiline]}
                  value={editFormData.description}
                  onChangeText={(text) => setEditFormData(prev => ({ ...prev, description: text }))}
                  placeholder="Décrivez brièvement votre entreprise..."
                  placeholderTextColor={theme.neutralContent}
                  multiline={true}
                  numberOfLines={3}
                />
              </View>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={[styles.modalButtonText, styles.modalButtonTextCancel]}>
                    Annuler
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSave]}
                  onPress={saveCompanyInfo}
                >
                  <Text style={[styles.modalButtonText, styles.modalButtonTextSave]}>
                    Enregistrer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Modal d'invitation */}
      <Modal
        visible={inviteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setInviteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Inviter un membre</Text>
            
                          <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  style={styles.formInput}
                  value={inviteFormData.email}
                  onChangeText={(text) => setInviteFormData(prev => ({ ...prev, email: text }))}
                  placeholder="email@exemple.fr"
                  placeholderTextColor={theme.neutralContent}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!saving}
                />
              </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Rôle</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  style={[
                    styles.roleSelector,
                    { backgroundColor: inviteFormData.role === 'member' ? theme.primary : theme.base200 }
                  ]}
                  onPress={() => setInviteFormData(prev => ({ ...prev, role: 'member' }))}
                  disabled={saving}
                >
                  <Text style={[
                    styles.roleSelectorText,
                    { color: inviteFormData.role === 'member' ? theme.primaryContent : theme.baseContent }
                  ]}>
                    Membre
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.roleSelector,
                    { backgroundColor: inviteFormData.role === 'admin' ? theme.primary : theme.base200 }
                  ]}
                  onPress={() => setInviteFormData(prev => ({ ...prev, role: 'admin' }))}
                  disabled={saving}
                >
                  <Text style={[
                    styles.roleSelectorText,
                    { color: inviteFormData.role === 'admin' ? theme.primaryContent : theme.baseContent }
                  ]}>
                    Admin
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

                          <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Message</Text>
                <TextInput
                  style={[styles.formInput, styles.formInputMultiline]}
                  value={inviteFormData.message}
                  onChangeText={(text) => setInviteFormData(prev => ({ ...prev, message: text }))}
                  placeholder="Message d'invitation..."
                  placeholderTextColor={theme.neutralContent}
                  multiline={true}
                  numberOfLines={3}
                  editable={!saving}
                />
              </View>
            
                          <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => setInviteModalVisible(false)}
                  disabled={saving}
                >
                  <Text style={[styles.modalButtonText, styles.modalButtonTextCancel]}>
                    Annuler
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSave]}
                  onPress={sendInvitation}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color={theme.primaryContent} />
                  ) : (
                    <Text style={[styles.modalButtonText, styles.modalButtonTextSave]}>
                      Envoyer
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CompanyDetailScreen; 