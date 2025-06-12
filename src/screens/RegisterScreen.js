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
  Dimensions,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // For gradients
import { useAuth } from '../context/AuthContext'; // Assuming this is your context

const CheckIcon = () => (
  <View style={styles.iconCircleGreen}>
    <Text style={styles.iconTextGreen}>✓</Text>
  </View>
);
const CalendarIcon = () => (
  <View style={styles.iconCirclePurple}>
    <Text style={styles.iconTextWhite}>🗓️</Text>
  </View>
);
const StarIcon = () => (
  <View style={styles.iconCircleBlue}>
    <Text style={styles.iconTextWhite}>⭐</Text>
  </View>
);
const GoogleIcon = () => (
    <Text style={styles.googleIconText}>G</Text> // Simplified representation
);


const { width } = Dimensions.get('window');
const IS_LARGE_SCREEN = width > 768; // Define what constitutes a "large screen"

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // Note: Your Next.js code doesn't explicitly register a "name" field during email sign-in,
  // it relies on NextAuth's email provider. I've removed `name` from state and `handleRegister`
  // to align with the Next.js `signIn('email', { email, ... })` logic.
  // If your `useAuth().register` requires `name`, you'll need to add it back and handle it.
  const { signIn: authSignIn, register: authRegister, signInWithGoogle: authSignInWithGoogle } = useAuth();


  const handleSubmit = async () => {
    if (!email) {
      setMessage("Veuillez entrer votre adresse email.");
      return;
    }
    if (!agreeTerms) {
      setMessage("Vous devez accepter les conditions d'utilisation et la politique de confidentialité.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // Mimicking NextAuth's email sign-in which acts as registration if user doesn't exist
      // Assuming your auth context's signIn method can handle this, or you have a specific register method.
      // If your `authSignIn` acts like NextAuth email provider, it will send a magic link.
      await authSignIn(email); // Or authRegister(email, password/magic link method)
      setMessage("Vérifiez votre email pour le lien de connexion!");
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };




  return (
    <KeyboardAvoidingView
      style={styles.fullScreenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.mainContentGrid}>
          {/* Left side - Features (Hidden on small screens) */}
          {IS_LARGE_SCREEN && (
            <View style={styles.leftPanel}>
              <View style={styles.joinUsSection}>
                <Text style={styles.tagline}>Rejoignez-nous</Text>
                <Text style={styles.heading}>
                  Renforcez votre{" "}
                  <Text style={styles.gradientText}>cybersécurité</Text> dès
                  aujourd'hui
                </Text>
                <Text style={styles.subHeading}>
                  Créez votre compte pour accéder à notre plateforme de sécurité
                  avancée et protéger votre entreprise contre les cybermenaces
                  modernes.
                </Text>
              </View>

              <LinearGradient
                colors={['#8A2BE220', '#4169E120']} // purple-900/20 to blue-900/20 (approx)
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBox}
              >
                <View style={styles.featureItem}>
                  <CalendarIcon />
                  <View>
                    <Text style={styles.featureTitle}>Installation rapide</Text>
                    <Text style={styles.featureDescription}>
                      Configuration en moins de 10 minutes, sans compétences
                      techniques requises.
                    </Text>
                  </View>
                </View>

                <View style={styles.featureItem}>
                  <StarIcon />
                  <View>
                    <Text style={styles.featureTitle}>C&apos;est partie</Text>
                    <Text style={styles.featureDescription}>
                      Commencé avec toutes les fonctionnalités premium
                      disponibles.
                    </Text>
                  </View>
                </View>
              </LinearGradient>

              <View style={styles.bulletPoints}>
                <View style={styles.bulletItem}>
                  <CheckIcon />
                  <Text style={styles.bulletText}>
                    Surveillance en temps réel 24/7
                  </Text>
                </View>
                <View style={styles.bulletItem}>
                  <CheckIcon />
                  <Text style={styles.bulletText}>
                    Protection contre les malwares avancés
                  </Text>
                </View>
                <View style={styles.bulletItem}>
                  <CheckIcon />
                  <Text style={styles.bulletText}>
                    Mises à jour automatiques de sécurité
                  </Text>
                </View>
                <View style={styles.bulletItem}>
                  <CheckIcon />
                  <Text style={styles.bulletText}>
                    Assistance technique prioritaire
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Right side - Register form */}
          <View style={styles.formPanel}>
            <View style={styles.formInnerContainer}>
              <Text style={styles.formTitle}>Créer un compte</Text>
              <Text style={styles.formSubtitle}>Commencez votre dès maintenant</Text>


              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Adresse email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="email@exemple.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setAgreeTerms(!agreeTerms)}
                >
                  {agreeTerms && <Text style={styles.checkboxChecked}>✓</Text>}
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>
                  J&apos;accepte les{" "}
                  <Text
                    style={styles.linkText}
                    onPress={() => Linking.openURL('https://yourwebsite.com/tos')}
                  >
                    conditions d&apos;utilisation
                  </Text>{" "}
                  et la{" "}
                  <Text
                    style={styles.linkText}
                    onPress={() => Linking.openURL('https://yourwebsite.com/privacy-policy')}
                  >
                    politique de confidentialité
                  </Text>
                </Text>
              </View>

              {message && (
                <View
                  style={[
                    styles.messageBox,
                    message.includes('Vérifiez')
                      ? styles.successMessage
                      : styles.errorMessage,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.includes('Vérifiez')
                        ? styles.successMessageText
                        : styles.errorMessageText,
                    ]}
                  >
                    {message}
                  </Text>
                </View>
              )}

              <LinearGradient
                colors={['#8A2BE2', '#4169E1']} // purple-600 to blue-600
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.createAccountButtonGradient,
                  (isLoading || !agreeTerms) && styles.buttonDisabledOverlay,
                ]}
              >
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.createAccountButton}
                  disabled={isLoading || !agreeTerms}
                >
                  <Text style={styles.createAccountButtonText}>
                    {isLoading ? "Envoi en cours..." : "Créer mon compte"}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>

              <View style={styles.loginPrompt}>
                <Text style={styles.loginPromptText}>
                  Vous avez déjà un compte?{" "}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLink}>Se connecter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A', // Dark background to mimic web dark mode, adjust if needed
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  mainContentGrid: {
    flexDirection: IS_LARGE_SCREEN ? 'row' : 'column',
    gap: IS_LARGE_SCREEN ? 32 : 0, // Approx gap-8
    maxWidth: 1200, // Approx max-w-6xl
    alignSelf: 'center',
    width: '100%',
  },

  // --- Left Panel Styles (Features) ---
  leftPanel: {
    flex: 1, // Takes half width on large screens
    justifyContent: 'center',
    paddingHorizontal: 32, // px-8
  },
  joinUsSection: {
    marginBottom: 40, // mb-10
  },
  tagline: {
    backgroundColor: '#007AFF20', // blue-500/10
    color: '#007AFF', // blue-700
    paddingVertical: 4, // py-1
    paddingHorizontal: 12, // px-3
    borderRadius: 9999, // rounded-full
    alignSelf: 'flex-start', // so it doesn't stretch
    marginBottom: 16, // mb-4
    fontSize: 12, // text-xs
    overflow: 'hidden', // Ensures borderRadius is applied
  },
  heading: {
    fontSize: IS_LARGE_SCREEN ? 30 : 28, // text-3xl, text-4xl
    fontWeight: 'bold',
    color: 'white', // dark:text-white
    marginBottom: 16, // mb-4
  },
  gradientText: {
    color: 'transparent', // Make text transparent
    // To achieve gradient text, you typically need a mask or specific libraries.
    // For simplicity here, we'll use a fixed color, but note it's a limitation of StyleSheet.
    // A common workaround is to use SVG for text or specialized libraries.
    // As a fallback, we'll use a purple color here to show it's different.
    color: '#A78BFA', // A static color approximating purple-500
  },
  subHeading: {
    color: '#D1D5DB', // dark:text-gray-300
    fontSize: 15,
  },
  gradientBox: {
    borderRadius: 12, // rounded-xl
    borderWidth: 1,
    borderColor: '#374151', // dark:border-gray-800
    padding: 24, // p-6
    marginBottom: 32, // mb-8
    overflow: 'hidden', // Crucial for borderRadius to work with gradients
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20, // gap-5
    marginBottom: 20, // mb-5
  },
  featureTitle: {
    color: 'white', // dark:text-white
    fontWeight: '500', // font-medium
    marginBottom: 4, // mb-1
    fontSize: 16,
  },
  featureDescription: {
    color: '#9CA3AF', // dark:text-gray-400
    fontSize: 13, // text-sm
  },
  iconCirclePurple: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#A78BFA20', // purple-500/20
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleBlue: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F620', // blue-500/20
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTextWhite: {
    color: 'white', // dark:text-white
    fontSize: 16,
  },
  bulletPoints: {
    flexDirection: 'column',
    gap: 16, // space-y-4
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // gap-3
  },
  iconCircleGreen: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B98120', // green-500/20
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTextGreen: {
    color: '#10B981', // green-600
    fontSize: 10,
  },
  bulletText: {
    color: '#D1D5DB', // dark:text-gray-300
    fontSize: 14, // text-sm
  },

  // --- Right Panel Styles (Form) ---
  formPanel: {
    flex: 1, // Takes half width on large screens
    paddingHorizontal: 24, // px-6
    paddingVertical: 32, // py-8
    borderRadius: 16, // rounded-2xl
    borderWidth: 1,
    borderColor: '#374151', // dark:border-gray-800
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // white/5 backdrop-blur-md (simplified)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  formInnerContainer: {
    maxWidth: 400, // max-w-md mx-auto
    alignSelf: 'center',
    width: '100%',
  },
  formTitle: {
    fontSize: 28, // text-3xl md:text-4xl
    fontWeight: 'bold',
    marginBottom: 8, // mb-2
    color: 'white', // dark:text-white
    textAlign: 'left', // Added for consistency, though default is left
  },
  formSubtitle: {
    color: '#D1D5DB', // dark:text-gray-300
    marginBottom: 32, // mb-8
    fontSize: 15,
  },
  googleSignInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12, // gap-3
    paddingHorizontal: 20, // px-5
    paddingVertical: 14, // py-3.5
    backgroundColor: 'white', // dark:bg-white, matches dark:text-black
    borderRadius: 12, // rounded-xl
    marginBottom: 24, // mb-6
  },
  googleIconText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#4285F4', // Google blue
  },
  googleSignInButtonText: {
    color: 'black', // dark:text-black
    fontWeight: '500', // font-medium
    fontSize: 16,
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24, // mb-6
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#374151', // dark:border-gray-800
  },
  orText: {
    color: '#9CA3AF', // dark:text-gray-400
    fontSize: 13, // text-sm
    paddingHorizontal: 12, // px-3
  },
  inputGroup: {
    marginBottom: 20, // space-y-5 for the form
  },
  inputLabel: {
    color: '#E5E7EB', // dark:text-gray-200
    fontSize: 14, // text-sm
    fontWeight: '500', // font-medium
    marginBottom: 8, // mb-2
  },
  input: {
    width: '100%',
    paddingHorizontal: 16, // px-4
    paddingVertical: 14, // py-3
    backgroundColor: 'rgba(255,255,255,0.05)', // dark:bg-white/5
    borderColor: '#374151', // dark:border-gray-800
    borderWidth: 1,
    borderRadius: 12, // rounded-xl
    color: 'white', // dark:text-white
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4, // rounded
    borderWidth: 1,
    borderColor: '#4B5563', // dark:border-gray-700
    backgroundColor: '#0A0A0A', // dark:bg-gray-900
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    color: '#A78BFA', // text-purple-500
    fontSize: 12,
  },
  checkboxLabel: {
    color: '#D1D5DB', // dark:text-gray-300
    fontSize: 14, // text-sm
    flexShrink: 1, // Allows text to wrap
  },
  linkText: {
    color: '#A78BFA', // text-purple-600 dark:text-purple-400
    textDecorationLine: 'underline',
  },
  messageBox: {
    padding: 12, // p-3
    borderRadius: 8, // rounded-lg
    marginBottom: 20,
  },
  successMessage: {
    backgroundColor: '#10B9811A', // bg-green-500/10
  },
  errorMessage: {
    backgroundColor: '#EF44441A', // bg-red-500/10
  },
  messageText: {
    fontSize: 14, // text-sm
  },
  successMessageText: {
    color: '#10B981', // text-green-700 dark:text-green-300
  },
  errorMessageText: {
    color: '#EF4444', // text-red-700 dark:text-red-300
  },
  createAccountButtonGradient: {
    borderRadius: 12, // rounded-xl
    overflow: 'hidden', // Important for gradient to respect borderRadius
    marginBottom: 20,
  },
  createAccountButton: {
    width: '100%',
    paddingHorizontal: 20, // px-5
    paddingVertical: 14, // py-3.5
    alignItems: 'center',
    justifyContent: 'center',
  },
  createAccountButtonText: {
    color: 'white',
    fontWeight: '500', // font-medium
    fontSize: 16,
  },
  buttonDisabledOverlay: {
    opacity: 0.8, // opacity-80
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32, // mt-8
    textAlign: 'center',
  },
  loginPromptText: {
    color: '#9CA3AF', // dark:text-gray-300 text-gray-500
    fontSize: 14, // text-sm
  },
  loginLink: {
    color: '#A78BFA', // text-purple-600 dark:text-purple-400
    fontWeight: '500', // font-medium
    fontSize: 14,
  },
});

export default RegisterScreen;