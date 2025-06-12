import React, { useState } from 'react';
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
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const { theme, mode, toggleTheme } = useTheme();
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'JD',
    memberSince: '2024',
    fullName: 'Jean Dupont',
    phone: '+33 6 12 34 56 78',
    address: '123 Rue de la Paix, 75001 Paris',
  });

  const [settings, setSettings] = useState({
    darkMode: mode === 'dark',
  });

  const [editModal, setEditModal] = useState({
    visible: false,
    field: '',
    value: '',
    title: '',
  });

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: () => {
            // Handle logout logic here
            navigation.navigate('Login');
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Cette action est irréversible. Toutes vos données seront supprimées définitivement.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Compte supprimé', 'Votre compte a été supprimé avec succès.');
          }
        }
      ]
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
      fullName: 'Nom complet',
      phone: 'Numéro de téléphone',
      address: 'Adresse'
    };
    
    setEditModal({
      visible: true,
      field: field,
      value: user[field],
      title: titles[field]
    });
  };

  const savePersonalInfo = () => {
    setUser(prev => ({
      ...prev,
      [editModal.field]: editModal.value
    }));
    setEditModal({ visible: false, field: '', value: '', title: '' });
    Alert.alert('Succès', 'Vos informations ont été mises à jour.');
  };

  const menuItems = [
    {
      section: 'Informations personnelles',
      items: [
        { icon: 'person-outline', title: 'Nom complet', subtitle: user.fullName, onPress: () => editPersonalInfo('fullName') },
        { icon: 'call-outline', title: 'Numéro de téléphone', subtitle: user.phone, onPress: () => editPersonalInfo('phone') },
        { icon: 'location-outline', title: 'Adresse', subtitle: user.address, onPress: () => editPersonalInfo('address') },
      ]
    },
    {
      section: 'Compte',
      items: [
        { icon: 'card-outline', title: 'Méthodes de paiement', onPress: () => navigation.navigate('PaymentMethods') },
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base100,
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Profil</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color={theme.baseContent} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.avatar}</Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.memberSince}>
            Membre depuis {user.memberSince}
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
                disabled={!!item.toggle}
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
          >
            <Text style={styles.dangerButtonText}>
              Supprimer mon compte
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
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
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextCancel]}>
                  Annuler
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={savePersonalInfo}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextSave]}>
                  Enregistrer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen; 