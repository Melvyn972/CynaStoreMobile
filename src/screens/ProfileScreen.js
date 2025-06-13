import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services';

const ProfileScreen = ({ navigation }) => {
  const { theme, mode, toggleTheme } = useTheme();
  const { logout, user: authUser, refreshUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [settings, setSettings] = useState({
    darkMode: mode === 'dark',
  });

  const [editModal, setEditModal] = useState({
    visible: false,
    field: '',
    value: '',
    title: '',
  });

  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    title: '',
    message: '',
    confirmText: '',
    cancelText: 'Annuler',
    onConfirm: null,
    isDestructive: false,
  });

  useEffect(() => {
    loadUserProfile();
  }, [authUser]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      if (authUser) {
        // Use data from AuthContext first
        setUser(authUser);
        
        // Try to get fresh data from server
        try {
          const freshProfile = await userService.getUserProfile();
          setUser(freshProfile);
        } catch (error) {
          console.log('Using cached user data:', error.message);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      showAlert('Erreur', 'Impossible de charger le profil utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (title, message, buttons = [{ text: 'OK' }]) => {
    // For simple alerts, use Alert if available, otherwise use custom modal
    if (buttons.length === 1) {
      if (typeof Alert !== 'undefined' && Alert.alert) {
        Alert.alert(title, message, buttons);
      } else {
        // Fallback for web
        alert(`${title}: ${message}`);
      }
    }
  };

  const showConfirm = (title, message, confirmText, onConfirm, isDestructive = false) => {
    setConfirmModal({
      visible: true,
      title,
      message,
      confirmText,
      cancelText: 'Annuler',
      onConfirm,
      isDestructive,
    });
  };

  const hideConfirm = () => {
    setConfirmModal({
      visible: false,
      title: '',
      message: '',
      confirmText: '',
      cancelText: 'Annuler',
      onConfirm: null,
      isDestructive: false,
    });
  };

  const handleLogout = () => {
    showConfirm(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      'Se déconnecter',
      () => {
        logout();
        navigation.navigate('Login');
        hideConfirm();
      },
      true
    );
  };

  const handleDeleteAccount = () => {
    showConfirm(
      'Supprimer le compte',
      'Cette action est irréversible. Toutes vos données seront supprimées définitivement.',
      'Supprimer',
      async () => {
        try {
          setUpdating(true);
          hideConfirm();
          await userService.deleteAccount();
          showAlert('Compte supprimé', 'Votre compte a été supprimé avec succès.');
          logout();
          navigation.navigate('Login');
        } catch (error) {
          showAlert('Erreur', 'Impossible de supprimer le compte');
        } finally {
          setUpdating(false);
        }
      },
      true
    );
  };

  const toggleSetting = (key) => {
    if (key === 'darkMode') {
      toggleTheme();
    }
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const editPersonalInfo = (field) => {
    const titles = {
      name: 'Nom complet',
      phone: 'Numéro de téléphone',
      address: 'Adresse'
    };
    
    setEditModal({
      visible: true,
      field: field,
      value: user[field] || '',
      title: titles[field]
    });
  };

  const savePersonalInfo = async () => {
    try {
      setUpdating(true);
      const updateData = {
        [editModal.field]: editModal.value
      };
      
      const response = await userService.updateUserProfile(updateData);
      
      // Update local user state
      setUser(prev => ({
        ...prev,
        [editModal.field]: editModal.value
      }));
      
      // Refresh user data in AuthContext
      await refreshUser();
      
      setEditModal({ visible: false, field: '', value: '', title: '' });
      showAlert('Succès', 'Vos informations ont été mises à jour.');
    } catch (error) {
      console.error('Error updating profile:', error);
      showAlert('Erreur', 'Impossible de mettre à jour le profil');
    } finally {
      setUpdating(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();
  };

  const formatMemberSince = (createdAt) => {
    if (!createdAt) return new Date().getFullYear().toString();
    return new Date(createdAt).toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  // Create styles object
  const styles = createStyles(theme);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.baseContent }]}>
          Chargement du profil...
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.errorText, { color: theme.error }]}>
          Impossible de charger le profil utilisateur
        </Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: theme.primary }]}
          onPress={loadUserProfile}
        >
          <Text style={[styles.retryButtonText, { color: theme.primaryContent }]}>
            Réessayer
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const menuItems = [
    {
      section: 'Informations personnelles',
      items: [
        { 
          icon: 'person-outline', 
          title: 'Nom complet', 
          subtitle: user.name || 'Non défini', 
          onPress: () => editPersonalInfo('name') 
        },
        { 
          icon: 'call-outline', 
          title: 'Numéro de téléphone', 
          subtitle: user.phone || 'Non défini', 
          onPress: () => editPersonalInfo('phone') 
        },
        { 
          icon: 'location-outline', 
          title: 'Adresse', 
          subtitle: user.address || 'Non définie', 
          onPress: () => editPersonalInfo('address') 
        },
      ]
    },
    {
      section: 'Compte',
      items: [
        { icon: 'receipt-outline', title: 'Historique des commandes', onPress: () => navigation.navigate('Orders') },
        { icon: 'business-outline', title: 'Mes entreprises', onPress: () => navigation.navigate('Companies') },
      ]
    },
    {
      section: 'Préférences',
      items: [
        { icon: 'moon-outline', title: 'Mode sombre', toggle: 'darkMode' },
        { icon: 'shield-checkmark-outline', title: 'Confidentialité & RGPD', onPress: () => navigation.navigate('RGPDSettings') },
      ]
    },
    {
      section: 'Support',
      items: [
        { icon: 'chatbubble-outline', title: 'Contacter le support', onPress: () => navigation.navigate('Contact') },
        { icon: 'information-circle-outline', title: 'À propos', onPress: () => navigation.navigate('About') },
        { icon: 'document-outline', title: 'Mentions légales', onPress: () => navigation.navigate('LegalMentions') },
        { icon: 'document-text-outline', title: 'Conditions d\'utilisation', onPress: () => navigation.navigate('Terms') },
        { icon: 'shield-checkmark-outline', title: 'Politique de confidentialité', onPress: () => navigation.navigate('PrivacyPolicy') },
      ]
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
          </View>
          <Text style={styles.userName}>{user.name || 'Utilisateur'}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.memberSince}>
            Membre depuis {formatMemberSince(user.createdAt)}
          </Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {menuItems.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.menuItem}
                onPress={item.onPress}
                disabled={!!item.toggle || updating}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons 
                    name={item.icon} 
                    size={24} 
                    color={theme.baseContent} 
                    style={styles.menuItemIcon}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    {item.subtitle && (
                      <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                    )}
                  </View>
                </View>
                
                {item.toggle ? (
                  <Switch
                    value={settings[item.toggle]}
                    onValueChange={() => toggleSetting(item.toggle)}
                    trackColor={{ false: theme.neutral, true: theme.primary + '40' }}
                    thumbColor={settings[item.toggle] ? theme.primary : theme.base100}
                  />
                ) : (
                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color={theme.neutralContent} 
                    style={styles.menuItemArrow}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.sectionTitle}>Zone de danger</Text>
          
          <TouchableOpacity 
            style={styles.dangerButton}
            onPress={handleDeleteAccount}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator size="small" color={theme.error} />
            ) : (
              <Text style={styles.dangerButtonText}>
                Supprimer mon compte
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={updating}
          >
            <Text style={styles.logoutButtonText}>
              Se déconnecter
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal d'édition */}
      <Modal
        visible={editModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEditModal({ visible: false, field: '', value: '', title: '' })}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier {editModal.title}</Text>
            
            <TextInput
              style={styles.modalInput}
              value={editModal.value}
              onChangeText={(text) => setEditModal(prev => ({ ...prev, value: text }))}
              placeholder={`Entrez votre ${editModal.title.toLowerCase()}`}
              placeholderTextColor={theme.neutralContent}
              multiline={editModal.field === 'address'}
              numberOfLines={editModal.field === 'address' ? 3 : 1}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setEditModal({ visible: false, field: '', value: '', title: '' })}
                disabled={updating}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextCancel]}>
                  Annuler
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={savePersonalInfo}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator size="small" color={theme.primaryContent} />
                ) : (
                  <Text style={[styles.modalButtonText, styles.modalButtonSave]}>
                    Enregistrer
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        visible={confirmModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={hideConfirm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{confirmModal.title}</Text>
            <Text style={styles.confirmMessage}>{confirmModal.message}</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={hideConfirm}
                disabled={updating}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextCancel]}>
                  {confirmModal.cancelText}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.modalButton, 
                  confirmModal.isDestructive ? styles.modalButtonDanger : styles.modalButtonSave
                ]}
                onPress={confirmModal.onConfirm}
                disabled={updating}
              >
                <Text style={[
                  styles.modalButtonText, 
                  confirmModal.isDestructive ? styles.modalButtonTextDanger : styles.modalButtonSave
                ]}>
                  {confirmModal.confirmText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Move styles outside component to avoid initialization issues
const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.base100,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingTop: 60,
    backgroundColor: theme.base100,
    borderBottomWidth: 1,
    borderBottomColor: theme.neutral,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.baseContent,
  },
  settingsButton: {
    backgroundColor: theme.base200,
    borderRadius: 12,
    padding: 8,
  },
  profileCard: {
    backgroundColor: theme.base200,
    borderRadius: theme.borderRadius.xl,
    padding: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.primaryContent,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.baseContent,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: theme.neutralContent,
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 14,
    color: theme.neutralContent,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.baseContent,
    marginBottom: 16,
  },
  menuItem: {
    backgroundColor: theme.base200,
    borderRadius: theme.borderRadius.xl,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    marginRight: 16,
  },
  menuItemTitle: {
    fontSize: 16,
    color: theme.baseContent,
    flex: 1,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: theme.neutralContent,
    marginTop: 2,
  },
  menuItemArrow: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.base100,
    borderRadius: theme.borderRadius.xl,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.baseContent,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: theme.base200,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.baseContent,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.neutral,
  },
  confirmMessage: {
    fontSize: 16,
    color: theme.baseContent,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  modalButtonDanger: {
    backgroundColor: theme.error,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextCancel: {
    color: theme.baseContent,
  },
  modalButtonTextDanger: {
    color: theme.base100,
  },
  dangerSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: theme.neutral,
  },
  dangerButton: {
    backgroundColor: theme.error + '20',
    borderWidth: 1,
    borderColor: theme.error + '30',
    borderRadius: theme.borderRadius.xl,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.error,
  },
  logoutButton: {
    backgroundColor: theme.base200,
    borderRadius: theme.borderRadius.xl,
    padding: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.baseContent,
  },
});

export default ProfileScreen; 