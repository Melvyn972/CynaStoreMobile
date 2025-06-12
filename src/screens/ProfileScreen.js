import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, colors, toggleTheme } = useTheme();
  const [showEditProfile, setShowEditProfile] = React.useState(false);
  const [editName, setEditName] = React.useState(user?.name || '');
  const [editPhone, setEditPhone] = React.useState(user?.phone || '');
  const [editAddress, setEditAddress] = React.useState(user?.address || '');
  const [showOrdersModal, setShowOrdersModal] = React.useState(false);
  const [showAddressesModal, setShowAddressesModal] = React.useState(false);
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  const handleSaveProfile = () => {
    // TODO: Save logic (API call or context update)
    setShowEditProfile(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#10111a' : '#f8f8ff',
    },
    scrollView: {
      flex: 1,
    },
    profileCard: {
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 24,
      margin: 24,
      marginBottom: 12,
      padding: 24,
      elevation: 4,
      shadowColor: '#a78bfa',
      shadowOpacity: 0.10,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 12,
    },
    userName: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#23234b',
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 15,
      color: '#6b7280',
      marginBottom: 10,
    },
    editProfileButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#a78bfa',
      borderRadius: 16,
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginTop: 8,
    },
    editProfileText: {
      color: '#fff',
      fontWeight: 'bold',
      marginLeft: 6,
      fontSize: 14,
    },
    settingsSection: {
      margin: 24,
      marginTop: 0,
      backgroundColor: '#fff',
      borderRadius: 24,
      paddingVertical: 8,
      elevation: 2,
      shadowColor: '#a78bfa',
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
    settingsItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 18,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    settingsIcon: {
      marginRight: 12,
    },
    settingsText: {
      flex: 1,
      fontSize: 16,
      color: '#23234b',
      fontWeight: '500',
    },
    themeToggleBtn: {
      backgroundColor: '#a78bfa',
      borderRadius: 12,
      padding: 6,
      marginLeft: 8,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FF3B30',
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 24,
      margin: 24,
      marginTop: 0,
      justifyContent: 'center',
    },
    logoutText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    legalLinksCardSection: {
      marginHorizontal: 24,
      marginTop: 32,
      marginBottom: 24,
    },
    legalCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 18,
      paddingVertical: 18,
      paddingHorizontal: 20,
      marginBottom: 14,
      elevation: 2,
      shadowColor: '#a78bfa',
      shadowOpacity: 0.10,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
    legalCardIcon: {
      marginRight: 14,
    },
    legalCardText: {
      fontSize: 16,
      color: '#23234b',
      fontWeight: 'bold',
    },
    profileActionsSection: {
      marginHorizontal: 24,
      marginTop: 12,
      marginBottom: 12,
    },
    profileActionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 18,
      paddingVertical: 18,
      paddingHorizontal: 20,
      marginBottom: 14,
      elevation: 2,
      shadowColor: '#a78bfa',
      shadowOpacity: 0.10,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
    profileActionIcon: {
      marginRight: 14,
    },
    profileActionText: {
      fontSize: 16,
      color: '#23234b',
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 48 }}>
        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          <TouchableOpacity style={styles.editProfileButton}>
            <Ionicons name="pencil" size={18} color="#fff" />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileActionsSection}>
          <TouchableOpacity style={styles.profileActionCard} onPress={() => setShowEditProfile(true)}>
            <Ionicons name="create-outline" size={22} color="#7c3aed" style={styles.profileActionIcon} />
            <Text style={styles.profileActionText}>Modifier mon profil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileActionCard} onPress={() => navigation.navigate('Companies')}>
            <Ionicons name="business-outline" size={22} color="#7c3aed" style={styles.profileActionIcon} />
            <Text style={styles.profileActionText}>Mes entreprises</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileActionCard} onPress={() => setShowOrdersModal(true)}>
            <Ionicons name="receipt-outline" size={22} color="#7c3aed" style={styles.profileActionIcon} />
            <Text style={styles.profileActionText}>Mes commandes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileActionCard} onPress={() => setShowAddressesModal(true)}>
            <Ionicons name="location-outline" size={22} color="#7c3aed" style={styles.profileActionIcon} />
            <Text style={styles.profileActionText}>Adresses de livraison</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileActionCard} onPress={() => setShowPaymentModal(true)}>
            <Ionicons name="card-outline" size={22} color="#7c3aed" style={styles.profileActionIcon} />
            <Text style={styles.profileActionText}>Moyens de paiement</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingsItem}>
            <Ionicons name="moon" size={22} color="#a78bfa" style={styles.settingsIcon} />
            <Text style={styles.settingsText}>Mode {isDarkMode ? 'clair' : 'sombre'}</Text>
            <TouchableOpacity onPress={toggleTheme} style={styles.themeToggleBtn}>
              <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={20} color="#fff" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

        {/* Legal & Info Links Section */}
        <View style={styles.legalLinksCardSection}>
          <TouchableOpacity style={styles.legalCard} onPress={() => navigation.navigate('About')}>
            <Ionicons name="information-circle-outline" size={22} color="#7c3aed" style={styles.legalCardIcon} />
            <Text style={styles.legalCardText}>À propos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalCard} onPress={() => navigation.navigate('Contact')}>
            <Ionicons name="mail-outline" size={22} color="#7c3aed" style={styles.legalCardIcon} />
            <Text style={styles.legalCardText}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalCard} onPress={() => navigation.navigate('PrivacyPolicy')}>
            <Ionicons name="lock-closed-outline" size={22} color="#7c3aed" style={styles.legalCardIcon} />
            <Text style={styles.legalCardText}>Politique de confidentialité</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalCard} onPress={() => navigation.navigate('Terms')}>
            <Ionicons name="document-text-outline" size={22} color="#7c3aed" style={styles.legalCardIcon} />
            <Text style={styles.legalCardText}>Conditions d'utilisation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalCard} onPress={() => navigation.navigate('Legal')}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#7c3aed" style={styles.legalCardIcon} />
            <Text style={styles.legalCardText}>Mentions légales</Text>
          </TouchableOpacity>
        </View>

        {/* Edit Profile Modal */}
        <Modal
          visible={showEditProfile}
          animationType="slide"
          transparent
          onRequestClose={() => setShowEditProfile(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(36, 33, 58, 0.25)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 24, padding: 28, width: '90%', shadowColor: '#a78bfa', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#23234b', marginBottom: 18, textAlign: 'center' }}>Modifier mon profil</Text>
              <TextInput
                style={{ backgroundColor: '#f8f8ff', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' }}
                placeholder="Nom complet"
                value={editName}
                onChangeText={setEditName}
              />
              <TextInput
                style={{ backgroundColor: '#f8f8ff', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' }}
                placeholder="Téléphone"
                value={editPhone}
                onChangeText={setEditPhone}
                keyboardType="phone-pad"
              />
              <TextInput
                style={{ backgroundColor: '#f8f8ff', borderRadius: 12, padding: 12, marginBottom: 18, borderWidth: 1, borderColor: '#e5e7eb', height: 80, textAlignVertical: 'top' }}
                placeholder="Adresse"
                value={editAddress}
                onChangeText={setEditAddress}
                multiline
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                <TouchableOpacity onPress={() => setShowEditProfile(false)} style={{ padding: 12, borderRadius: 12, backgroundColor: '#ede9fe', flex: 1, marginRight: 8, alignItems: 'center' }}>
                  <Text style={{ color: '#7c3aed', fontWeight: 'bold' }}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveProfile} style={{ padding: 12, borderRadius: 12, backgroundColor: '#7c3aed', flex: 1, marginLeft: 8, alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Orders Modal */}
        <Modal
          visible={showOrdersModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowOrdersModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(36, 33, 58, 0.25)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.97)', borderRadius: 24, padding: 28, width: '90%', maxHeight: '80%', shadowColor: '#a78bfa', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#23234b', marginBottom: 18, textAlign: 'center' }}>Mes commandes</Text>
              <Text style={{ color: '#6b7280', marginBottom: 18, textAlign: 'center' }}>[Liste ou gestion des commandes ici]</Text>
              <TouchableOpacity onPress={() => setShowOrdersModal(false)} style={{ padding: 12, borderRadius: 12, backgroundColor: '#ede9fe', alignItems: 'center' }}>
                <Text style={{ color: '#7c3aed', fontWeight: 'bold' }}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Addresses Modal */}
        <Modal
          visible={showAddressesModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowAddressesModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(36, 33, 58, 0.25)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.97)', borderRadius: 24, padding: 28, width: '90%', maxHeight: '80%', shadowColor: '#a78bfa', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#23234b', marginBottom: 18, textAlign: 'center' }}>Adresses de livraison</Text>
              <Text style={{ color: '#6b7280', marginBottom: 18, textAlign: 'center' }}>[Gestion des adresses ici]</Text>
              <TouchableOpacity onPress={() => setShowAddressesModal(false)} style={{ padding: 12, borderRadius: 12, backgroundColor: '#ede9fe', alignItems: 'center' }}>
                <Text style={{ color: '#7c3aed', fontWeight: 'bold' }}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Payment Methods Modal */}
        <Modal
          visible={showPaymentModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowPaymentModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(36, 33, 58, 0.25)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.97)', borderRadius: 24, padding: 28, width: '90%', maxHeight: '80%', shadowColor: '#a78bfa', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#23234b', marginBottom: 18, textAlign: 'center' }}>Moyens de paiement</Text>
              <Text style={{ color: '#6b7280', marginBottom: 18, textAlign: 'center' }}>[Gestion des moyens de paiement ici]</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)} style={{ padding: 12, borderRadius: 12, backgroundColor: '#ede9fe', alignItems: 'center' }}>
                <Text style={{ color: '#7c3aed', fontWeight: 'bold' }}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen; 