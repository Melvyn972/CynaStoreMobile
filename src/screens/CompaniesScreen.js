import React, { useState } from 'react';
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
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const CompaniesScreen = ({ navigation }) => {
  const { theme, mode } = useTheme();
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: 'TechCorp Solutions',
      siret: '12345678901234',
      address: '123 Avenue des Champs-Élysées, 75008 Paris',
      phone: '+33 1 23 45 67 89',
      email: 'contact@techcorp.fr',
      website: 'https://techcorp.fr',
      tva: 'FR12345678901',
      description: 'Entreprise spécialisée dans les solutions technologiques',
      createdAt: '2023-01-15',
      role: 'owner',
      members: [
        { id: 1, name: 'Jean Dupont', email: 'jean@techcorp.fr', role: 'owner', joinedAt: '2023-01-15' },
        { id: 2, name: 'Marie Martin', email: 'marie@techcorp.fr', role: 'admin', joinedAt: '2023-02-10' }
      ]
    },
    {
      id: 2,
      name: 'StartUp Ventures',
      siret: '11223344556677',
      address: '789 Boulevard Saint-Germain, 75006 Paris',
      phone: '+33 1 11 22 33 44',
      email: 'hello@startup-ventures.fr',
      website: 'https://startup-ventures.fr',
      tva: 'FR11223344556',
      description: 'Startup innovante dans le domaine du digital',
      createdAt: '2022-08-20',
      role: 'member',
      members: [
        { id: 1, name: 'Paul Durand', email: 'paul@startup.fr', role: 'owner', joinedAt: '2022-08-20' }
      ]
    }
  ]);

  const [invitations, setInvitations] = useState([
    {
      id: 1,
      companyName: 'Digital Innovation SARL',
      inviterName: 'Sophie Leblanc',
      inviterEmail: 'sophie@digital-innovation.fr',
      role: 'admin',
      receivedAt: '2024-01-10',
      message: 'Rejoignez notre équipe pour développer nos projets digitaux !'
    },
    {
      id: 2,
      companyName: 'Green Tech Solutions',
      inviterName: 'Thomas Moreau',
      inviterEmail: 'thomas@greentech.fr',
      role: 'member',
      receivedAt: '2024-01-08',
      message: 'Nous aimerions collaborer avec vous sur nos projets écologiques.'
    }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [invitationModalVisible, setInvitationModalVisible] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [activeTab, setActiveTab] = useState('companies');
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
      name: company.name,
      siret: company.siret,
      address: company.address,
      phone: company.phone,
      email: company.email,
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

  const saveCompany = () => {
    if (!formData.name || !formData.siret) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires (Nom et SIRET).');
      return;
    }

    if (editingCompany) {
      // Modifier une entreprise existante
      setCompanies(prev => prev.map(company => 
        company.id === editingCompany.id 
          ? { ...company, ...formData }
          : company
      ));
      Alert.alert('Succès', 'Entreprise modifiée avec succès.');
    } else {
      // Ajouter une nouvelle entreprise
      const newCompany = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        role: 'owner',
        members: [
          { 
            id: 1, 
            name: 'Jean Dupont', 
            email: formData.email || 'jean.dupont@example.com', 
            role: 'owner', 
            joinedAt: new Date().toISOString().split('T')[0] 
          }
        ]
      };
      setCompanies(prev => [...prev, newCompany]);
      Alert.alert('Succès', 'Entreprise ajoutée avec succès.');
    }

    setModalVisible(false);
  };

  const acceptInvitation = (invitation) => {
    // Créer une nouvelle entreprise basée sur l'invitation
    const newCompany = {
      id: Date.now(),
      name: invitation.companyName,
      siret: '00000000000000', // À compléter
      address: 'Adresse à définir',
      phone: 'Téléphone à définir',
      email: invitation.inviterEmail,
      website: '',
      tva: '',
      description: 'Entreprise rejointe via invitation',
      createdAt: new Date().toISOString().split('T')[0],
      role: invitation.role,
      members: [
        { 
          id: 1, 
          name: invitation.inviterName, 
          email: invitation.inviterEmail, 
          role: 'owner', 
          joinedAt: new Date().toISOString().split('T')[0] 
        },
        { 
          id: 2, 
          name: 'Jean Dupont', 
          email: 'jean.dupont@example.com', 
          role: invitation.role, 
          joinedAt: new Date().toISOString().split('T')[0] 
        }
      ]
    };

    setCompanies(prev => [...prev, newCompany]);
    setInvitations(prev => prev.filter(inv => inv.id !== invitation.id));
    setInvitationModalVisible(false);
    Alert.alert('Succès', `Vous avez rejoint l'entreprise "${invitation.companyName}" avec succès !`);
  };

  const declineInvitation = (invitation) => {
    Alert.alert(
      'Refuser l\'invitation',
      `Êtes-vous sûr de vouloir refuser l'invitation de "${invitation.companyName}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Refuser',
          style: 'destructive',
          onPress: () => {
            setInvitations(prev => prev.filter(inv => inv.id !== invitation.id));
            setInvitationModalVisible(false);
            Alert.alert('Invitation refusée', 'L\'invitation a été refusée.');
          }
        }
      ]
    );
  };

  const deleteCompany = (company) => {
    Alert.alert(
      'Supprimer l\'entreprise',
      `Êtes-vous sûr de vouloir supprimer "${company.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setCompanies(prev => prev.filter(c => c.id !== company.id));
            Alert.alert('Succès', 'Entreprise supprimée avec succès.');
          }
        }
      ]
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
      marginBottom: 24,
    },
    addButton: {
      backgroundColor: theme.primary,
      borderRadius: 16,
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
    invitationBadge: {
      backgroundColor: theme.error,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
    invitationBadgeText: {
      color: theme.errorContent,
      fontSize: 12,
      fontWeight: 'bold',
    },
    companyCard: {
      backgroundColor: theme.base200,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: mode === 'dark' ? theme.neutral + '40' : theme.base300,
    },
    companyHeader: {
      marginBottom: 16,
    },
    companyInfo: {
      flex: 1,
    },
    companyName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 4,
    },
    companySiret: {
      fontSize: 14,
      color: theme.neutralContent,
      marginBottom: 8,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.base100,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    statusIcon: {
      marginRight: 6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
    },
    companyDetails: {
      marginBottom: 16,
    },
    companyActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginHorizontal: 4,
    },
    editButton: {
      backgroundColor: theme.info + '20',
      borderWidth: 1,
      borderColor: theme.info + '40',
    },
    deleteButton: {
      backgroundColor: theme.error + '20',
      borderWidth: 1,
      borderColor: theme.error + '40',
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '600',
    },
    editButtonText: {
      color: theme.info,
    },
    deleteButtonText: {
      color: theme.error,
    },
    roleContainer: {
      backgroundColor: theme.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginTop: 8,
    },
    roleText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.primary,
    },
    invitationCard: {
      backgroundColor: theme.warning + '10',
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.warning + '40',
    },
    invitationHeader: {
      marginBottom: 16,
    },
    invitationCompany: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 4,
    },
    invitationFrom: {
      fontSize: 14,
      color: theme.neutralContent,
      marginBottom: 8,
    },
    invitationMessage: {
      fontSize: 14,
      color: theme.baseContent,
      fontStyle: 'italic',
      marginBottom: 12,
    },
    invitationDate: {
      fontSize: 12,
      color: theme.neutralContent,
    },
    invitationActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    acceptButton: {
      backgroundColor: theme.success,
    },
    declineButton: {
      backgroundColor: theme.error + '20',
      borderWidth: 1,
      borderColor: theme.error + '40',
    },
    acceptButtonText: {
      color: theme.successContent,
    },
    declineButtonText: {
      color: theme.error,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
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
    companyActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginHorizontal: 4,
    },
    editButton: {
      backgroundColor: theme.info + '20',
      borderWidth: 1,
      borderColor: theme.info + '40',
    },
    deleteButton: {
      backgroundColor: theme.error + '20',
      borderWidth: 1,
      borderColor: theme.error + '40',
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '600',
    },
    editButtonText: {
      color: theme.info,
    },
    deleteButtonText: {
      color: theme.error,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.neutral + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
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
    requiredMark: {
      color: theme.error,
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
  });

  const renderCompanyCard = (company) => (
    <View key={company.id} style={styles.companyCard}>
      {/* Header */}
      <View style={styles.companyHeader}>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{company.name}</Text>
          <Text style={styles.companySiret}>SIRET: {company.siret}</Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.companyDetails}>
        {company.description && (
          <View style={styles.detailRow}>
            <Ionicons name="information-circle-outline" size={16} color={theme.neutralContent} style={styles.detailIcon} />
            <Text style={styles.detailText}>{company.description}</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color={theme.neutralContent} style={styles.detailIcon} />
          <Text style={styles.detailText}>{company.address}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="call-outline" size={16} color={theme.neutralContent} style={styles.detailIcon} />
          <Text style={styles.detailText}>{company.phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="mail-outline" size={16} color={theme.neutralContent} style={styles.detailIcon} />
          <Text style={styles.detailText}>{company.email}</Text>
        </View>
        {company.website && (
          <View style={styles.detailRow}>
            <Ionicons name="globe-outline" size={16} color={theme.neutralContent} style={styles.detailIcon} />
            <Text style={styles.detailText}>{company.website}</Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={theme.neutralContent} style={styles.detailIcon} />
          <Text style={styles.detailText}>Créée le {new Date(company.createdAt).toLocaleDateString('fr-FR')}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="people-outline" size={16} color={theme.neutralContent} style={styles.detailIcon} />
          <Text style={styles.detailText}>{company.members?.length || 0} membre{(company.members?.length || 0) > 1 ? 's' : ''}</Text>
        </View>
        
        <View style={styles.roleContainer}>
          <Text style={styles.roleText}>
            {company.role === 'owner' ? 'Propriétaire' : company.role === 'admin' ? 'Administrateur' : 'Membre'}
          </Text>
        </View>
      </View>

      {/* Actions */}
      {(company.role === 'owner' || company.role === 'admin') && (
        <View style={styles.companyActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => navigation.navigate('CompanyDetail', { company })}
          >
            <Text style={[styles.actionButtonText, styles.editButtonText]}>
              {company.role === 'owner' ? 'Gérer' : 'Voir détails'}
            </Text>
          </TouchableOpacity>
          
          {company.role === 'owner' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => deleteCompany(company)}
            >
              <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                Supprimer
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}


    </View>
  );

  const renderInvitationCard = (invitation) => (
    <View key={invitation.id} style={styles.invitationCard}>
      <View style={styles.invitationHeader}>
        <Text style={styles.invitationCompany}>{invitation.companyName}</Text>
        <Text style={styles.invitationFrom}>
          Invitation de {invitation.inviterName} ({invitation.inviterEmail})
        </Text>
        <Text style={styles.invitationMessage}>"{invitation.message}"</Text>
        <Text style={styles.invitationDate}>
          Reçue le {new Date(invitation.receivedAt).toLocaleDateString('fr-FR')}
        </Text>
      </View>

      <View style={styles.invitationActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.declineButton]}
          onPress={() => declineInvitation(invitation)}
        >
          <Text style={[styles.actionButtonText, styles.declineButtonText]}>
            Refuser
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => acceptInvitation(invitation)}
        >
          <Text style={[styles.actionButtonText, styles.acceptButtonText]}>
            Accepter
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
          <Text style={styles.backButtonText}>Retour au profil</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="business-outline" size={24} color={theme.primary} />
          </View>
          <Text style={styles.title}>Mes entreprises</Text>
          <Text style={styles.subtitle}>
            Gérez vos entreprises et leurs informations
          </Text>
        </View>

        {/* Tabs */}
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

        {/* Content based on active tab */}
        {activeTab === 'companies' ? (
          <>
            {/* Add Button */}
            <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
              <Ionicons name="add" size={20} color={theme.primaryContent} />
              <Text style={styles.addButtonText}>Ajouter une entreprise</Text>
            </TouchableOpacity>

            {/* Companies List */}
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
            {/* Invitations List */}
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

      {/* Modal d'ajout/modification */}
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
                >
                  <Text style={[styles.modalButtonText, styles.modalButtonTextSave]}>
                    {editingCompany ? 'Modifier' : 'Ajouter'}
                  </Text>
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