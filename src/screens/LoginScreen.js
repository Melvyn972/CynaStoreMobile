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
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('email'); // 'email' or 'token'
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const { login } = useAuth();

  const handleSendMagicLink = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await login.sendMagicLink(email);
      setMagicLinkSent(true);
      setStep('token');
      
      // In development, show the token for testing
      if (response.devToken) {
        Alert.alert(
          'Development Mode', 
          `Magic link sent! Use this token for testing: ${response.devToken}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Success', 'Magic link sent to your email! Check your inbox and copy the verification token.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async () => {
    if (!token) {
      Alert.alert('Error', 'Please enter the verification token');
      return;
    }

    setLoading(true);
    try {
      await login.verifyMagicLink(token);
      // Navigation will be handled by the auth context
    } catch (error) {
      Alert.alert('Error', error.message || 'Token verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <Text style={styles.title}>Welcome to CynaStore</Text>
          <Text style={styles.subtitle}>
            {step === 'email' ? 'Sign in with magic link' : 'Enter verification token'}
          </Text>

          {step === 'email' ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!magicLinkSent}
              />

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSendMagicLink}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Sending...' : 'Send Magic Link'}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.instructionText}>
                Check your email for the magic link and copy the verification token
              </Text>
              
              <TextInput
                style={styles.input}
                placeholder="Verification Token"
                value={token}
                onChangeText={setToken}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleVerifyToken}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Verifying...' : 'Verify & Sign In'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => {
                  setStep('email');
                  setMagicLinkSent(false);
                  setToken('');
                }}
              >
                <Text style={styles.linkText}>Back to Email</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.linkText}>
              Don't have an account? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  form: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    padding: 10,
  },
  linkText: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 16,
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    lineHeight: 20,
  },
});

export default LoginScreen; 