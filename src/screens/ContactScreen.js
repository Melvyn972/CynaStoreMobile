import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const ContactScreen = ({ navigation }) => {
  const { theme, mode } = useTheme();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    Alert.alert(
      'Message envoyé !',
      'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
      [
        {
          text: 'OK',
          onPress: () => {
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              message: '',
            });
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
    keyboardContainer: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingVertical: 24,
      paddingTop: 80,
    },
    mainCard: {
      backgroundColor: theme.base200,
      borderRadius: theme.borderRadius['2xl'],
      overflow: 'hidden',
      marginBottom: 32,
    },
    leftSection: {
      padding: 32,
      justifyContent: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 16,
      lineHeight: 40,
    },
    subtitle: {
      fontSize: 20,
      color: theme.neutralContent,
      marginBottom: 24,
      lineHeight: 28,
    },
    contactInfo: {
      marginBottom: 16,
    },
    contactLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.baseContent,
      marginBottom: 8,
    },
    contactText: {
      fontSize: 16,
      color: theme.neutralContent,
      marginBottom: 4,
      lineHeight: 24,
    },
    contactLink: {
      fontSize: 16,
      color: theme.primary,
      fontWeight: '500',
    },
    rightSection: {
      backgroundColor: theme.base100 + 'CC',
      padding: 32,
    },
    formTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 24,
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.baseContent,
      marginBottom: 8,
    },
    requiredStar: {
      color: theme.error,
    },
    input: {
      backgroundColor: mode === 'dark' ? theme.base200 : theme.base100,
      borderWidth: 1,
      borderColor: theme.neutral,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.baseContent,
    },
    textArea: {
      height: 120,
      textAlignVertical: 'top',
    },
    submitButton: {
      backgroundColor: theme.primary,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 8,
    },
    submitButtonText: {
      color: theme.primaryContent,
      fontSize: 16,
      fontWeight: '600',
    },
    backButton: {
      position: 'absolute',
      top: 60,
      left: 24,
      zIndex: 10,
      backgroundColor: theme.base100 + 'CC',
      borderRadius: 20,
      padding: 8,
    },
    backButtonContainer: {
      alignItems: 'center',
      marginTop: 32,
    },
    backButtonSecondary: {
      backgroundColor: theme.base200,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: 24,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButtonText: {
      color: theme.baseContent,
      fontSize: 16,
      fontWeight: '500',
      marginLeft: 8,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={theme.baseContent} />
      </TouchableOpacity>

      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainCard}>
            {/* Left Section - Contact Info */}
            <View style={styles.leftSection}>
              <Text style={styles.title}>
                Vous avez un besoin ou une question ?
              </Text>
              <Text style={styles.subtitle}>
                Contactez-nous, nous vous répondrons rapidement.
              </Text>
              
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Adresse :</Text>
                <Text style={styles.contactText}>
                  10 rue de Penthièvre, 75008 Paris
                </Text>
              </View>
              
              <TouchableOpacity>
                <Text style={styles.contactLink}>
                  +33 1 89 70 14 36
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity>
                <Text style={styles.contactLink}>
                  contact@cyna-it.fr
                </Text>
              </TouchableOpacity>
            </View>

            {/* Right Section - Contact Form */}
            <View style={styles.rightSection}>
              <Text style={styles.formTitle}>Formulaire de contact</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Prénom <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Votre prénom"
                  placeholderTextColor={theme.neutralContent}
                  value={formData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  Nom <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Votre nom"
                  placeholderTextColor={theme.neutralContent}
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  E-mail <Text style={styles.requiredStar}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="votre@email.com"
                  placeholderTextColor={theme.neutralContent}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Message</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Votre message..."
                  placeholderTextColor={theme.neutralContent}
                  value={formData.message}
                  onChangeText={(value) => handleInputChange('message', value)}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Envoyer</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Back to Home Button */}
          <View style={styles.backButtonContainer}>
            <TouchableOpacity 
              style={styles.backButtonSecondary}
              onPress={() => navigation.navigate('Home')}
            >
              <Ionicons name="arrow-back" size={16} color={theme.baseContent} />
              <Text style={styles.backButtonText}>Retour à l'accueil</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ContactScreen; 