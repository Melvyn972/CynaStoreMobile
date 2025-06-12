// LoginScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
// import { useAuth } from '../context/AuthContext'; // Gardez votre contexte d'authentification

// Icône SVG pour Google (similaire à la version web)
const googleIconSvg = `
<svg viewBox="0 0 24 24">
  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
</svg>
`;

// Icône SVG pour l'utilisateur
const userIconSvg = `
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#1F2937" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#1F2937" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  // const { loginWithEmail, loginWithGoogle } = useAuth(); // Adaptez selon votre contexte

  const handleEmailLogin = async () => {
    if (!email) {
      setMessage('Veuillez entrer une adresse e-mail.');
      return;
    }
    setIsLoading(true);
    setMessage('');
    try {
      // Simule l'appel API pour envoyer le lien magique
      // await loginWithEmail(email); 
      console.log('Sending magic link to:', email);
      // À la place de la redirection web, naviguez vers un écran de confirmation
      navigation.navigate('CheckEmailScreen', { email }); // Créez cet écran
    } catch (error) {
      setMessage(error.message || "Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

 
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <SvgXml xml={userIconSvg} width="28" height="28" />
              </View>
              <Text style={styles.title}>Connexion</Text>
              <Text style={styles.subtitle}>Accédez à votre compte pour continuer</Text>
            </View>

            {message && (
              <View style={[styles.messageBox, message.includes('Veuillez') ? styles.errorBox : styles.successBox]}>
                <Text style={message.includes('Veuillez') ? styles.errorText : styles.successText}>{message}</Text>
              </View>
            )}

            <View style={styles.form}>
              <Text style={styles.label}>Adresse email</Text>
              <TextInput
                style={styles.input}
                placeholder="email@exemple.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
              />

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleEmailLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Se connecter</Text>
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>Vous n'avez pas de compte? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>S'inscrire</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles inspirés de la version web avec Tailwind CSS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Similaire à un fond gris clair
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 24,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    shadowColor: "#4B5563",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(167, 139, 250, 0.1)', // Dégradé simulé avec une couleur
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.2)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
  },
  messageBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  errorText: {
    color: '#B91C1C',
    textAlign: 'center',
  },
  successBox: { // Au cas où vous auriez des messages de succès
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  successText: {
    color: '#047857',
    textAlign: 'center',
  },
  socialLoginContainer: {
    marginBottom: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#6B7280',
    fontSize: 14,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 16,
    color: '#111827',
  },
  button: {
    marginTop: 16,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#8B5CF6', // Couleur principale du dégradé web
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  linkText: {
    color: '#8B5CF6',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default LoginScreen;