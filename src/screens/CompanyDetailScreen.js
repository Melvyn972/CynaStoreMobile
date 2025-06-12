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
  Switch,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const CompanyDetailScreen = ({ navigation, route }) => {
  const { theme, mode } = useTheme();
  const { company } = route.params;
  const [activeTab, setActiveTab] = useState('info');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [companyData, setCompanyData] = useState(company);
  
  const [editFormData, setEditFormData] = useState({
    name: company.name,
    siret: company.siret,
    address: company.address,
    phone: company.phone,
    email: company.email,
    website: company.website || '',
    tva: company.tva || '',
    description: company.description || ''
  });

  const [inviteFormData, setInviteFormData] = useState({
    email: '',
    role: 'member',
    message: 'Rejoignez notre équipe !'
  });

  const [purchases] = useState([
    {
      id: 1,
      date: '2024-01-15',
      amount: 299.99,
      description: 'Licence logiciel CRM',
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-01-10',
      amount: 150.00,
      description: 'Formation équipe',
      status: 'completed'
    },
    {
      id: 3,
      date: '2024-01-05',
      amount: 89.99,
      description: 'Abonnement cloud',
      status: 'pending'
    }
  ]);

  const canEdit = companyData.role === 'owner' || companyData.role === 'admin';
  const canManageMembers = companyData.role === 'owner';

  const saveCompanyInfo = () => {
    setCompanyData(prev => ({ ...prev, ...editFormData }));
    setEditModalVisible(false);
    Alert.alert('Succès', 'Informations mises à jour avec succès.');
  };

  const sendInvitation = () => {
    if (!inviteFormData.email) {
      Alert.alert('Erreur', 'Veuillez saisir un email.');
      return;
    }
    
    Alert.alert('Invitation envoyée', `Une invitation a été envoyée à ${inviteFormData.email}.`);
    setInviteFormData({ email: '', role: 'member', message: 'Rejoignez notre équipe !' });
    setInviteModalVisible(false);
  };

  const removeMember = (member) => {
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
          onPress: () => {
            setCompanyData(prev => ({
              ...prev,
              members: prev.members.filter(m => m.id !== member.id)
            }));
            Alert.alert('Succès', 'Membre supprimé avec succès.');
          }
        }
      ]
    );
  };

  const changeRole = (member, newRole) => {
    if (member.role === 'owner') {
      Alert.alert('Erreur', 'Impossible de modifier le rôle du propriétaire.');
      return;
    }

    setCompanyData(prev => ({
      ...prev,
      members: prev.members.map(m => 
        m.id === member.id ? { ...m, role: newRole } : m
      )
    }));
    Alert.alert('Succès', `Rôle de ${member.name} modifié en ${newRole === 'admin' ? 'Administrateur' : 'Membre'}.`);
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
      
      {companyData.members?.map((member) => (
        <View key={member.id} style={styles.memberItem}>
          <View style={styles.memberAvatar}>
            <Text style={styles.memberAvatarText}>
              {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.memberEmail}>{member.email}</Text>
            <Text style={styles.memberRole}>
              {member.role === 'owner' ? 'Propriétaire' : member.role === 'admin' ? 'Administrateur' : 'Membre'}
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
                {new Date(purchase.date).toLocaleDateString('fr-FR')}
              </Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: purchase.status === 'completed' ? theme.success + '20' : theme.warning + '20' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: purchase.status === 'completed' ? theme.success : theme.warning }
                ]}>
                  {purchase.status === 'completed' ? 'Terminé' : 'En attente'}
                </Text>
              </View>
            </View>
            <Text style={styles.purchaseAmount}>{purchase.amount.toFixed(2)} €</Text>
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
              {companyData.role === 'owner' ? 'Propriétaire' : companyData.role === 'admin' ? 'Administrateur' : 'Membre'}
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
              ℹ️ Infos
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
              👥 Membres
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
              🛒 Achats
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
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setInviteModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextCancel]}>
                  Annuler
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={sendInvitation}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextSave]}>
                  Envoyer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CompanyDetailScreen; 