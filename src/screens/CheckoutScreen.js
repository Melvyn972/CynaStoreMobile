import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const CheckoutScreen = ({ navigation, route }) => {
  const { theme, mode } = useTheme();
  const { companyId } = route.params || {};
  const [cart, setCart] = useState([]);
  const [articles, setArticles] = useState({});
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [company, setCompany] = useState(null);

  // Fetch company details if companyId is provided
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!companyId) return;
      
      try {
        // Simulate API call - replace with actual API
        const mockCompany = {
          id: companyId,
          name: 'Mon Entreprise',
          description: 'Entreprise principale',
          address: '123 Rue de la Tech, 75001 Paris',
          email: 'contact@monentreprise.com'
        };
        setCompany(mockCompany);
      } catch (error) {
        console.error('Error fetching company details:', error);
        Alert.alert('Erreur', 'Erreur lors du chargement des détails de l\'entreprise');
        navigation.goBack();
      }
    };

    fetchCompanyDetails();
  }, [companyId, navigation]);

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        // Simulate API call - replace with actual API
        const mockCart = [
          { id: 1, productId: 1, quantity: 2 },
          { id: 2, productId: 2, quantity: 1 },
        ];
        const mockArticles = {
          1: { id: 1, title: 'Produit 1', price: 29.99, image: 'https://via.placeholder.com/150' },
          2: { id: 2, title: 'Produit 2', price: 49.99, image: 'https://via.placeholder.com/150' },
        };
        
        setCart(mockCart);
        setArticles(mockArticles);
      } catch (error) {
        console.error('Error fetching cart:', error);
        Alert.alert('Erreur', 'Erreur lors du chargement du panier');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [companyId]);

  // Calculate total
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const article = articles[item.productId];
      if (article) {
        return total + (article.price * item.quantity);
      }
      return total;
    }, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Commande confirmée !',
        'Votre commande a été traitée avec succès. Vous recevrez un email de confirmation.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Success')
          }
        ]
      );
    } catch (error) {
      console.error('Error creating checkout session:', error);
      Alert.alert('Erreur', 'Erreur lors de la création de la session de paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base100,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 16,
      paddingTop: 60,
      backgroundColor: theme.base100,
      borderBottomWidth: 1,
      borderBottomColor: theme.neutral,
    },
    backButton: {
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.baseContent,
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContainer: {
      paddingBottom: 120,
    },
    section: {
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 12,
    },
    companyCard: {
      backgroundColor: theme.base200,
      borderRadius: theme.borderRadius.xl,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    companyName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.baseContent,
      marginBottom: 4,
    },
    companyDescription: {
      fontSize: 14,
      color: theme.neutralContent,
      marginBottom: 8,
    },
    companyAddress: {
      fontSize: 14,
      color: theme.neutralContent,
    },
    orderSummarySection: {
      backgroundColor: theme.base200,
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    cartItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.base100,
      borderRadius: theme.borderRadius.xl,
      padding: 12,
      marginBottom: 8,
    },
    productImage: {
      width: 50,
      height: 50,
      borderRadius: 8,
      marginRight: 12,
    },
    productInfo: {
      flex: 1,
    },
    productTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.baseContent,
      marginBottom: 2,
    },
    productPrice: {
      fontSize: 12,
      color: theme.primary,
      fontWeight: '600',
    },
    productQuantity: {
      fontSize: 14,
      color: theme.neutralContent,
      marginLeft: 12,
    },
    summaryCard: {
      backgroundColor: theme.base100,
      borderRadius: theme.borderRadius.xl,
      padding: 16,
      marginTop: 16,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    summaryLabel: {
      fontSize: 16,
      color: theme.neutralContent,
    },
    summaryValue: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.baseContent,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.neutral,
    },
    totalLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.baseContent,
    },
    totalValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.primary,
    },
    paymentSection: {
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    paymentCard: {
      backgroundColor: theme.base200,
      borderRadius: theme.borderRadius.xl,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    paymentIcon: {
      marginRight: 12,
    },
    paymentInfo: {
      flex: 1,
    },
    paymentTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.baseContent,
      marginBottom: 4,
    },
    paymentDescription: {
      fontSize: 14,
      color: theme.neutralContent,
    },
    checkoutSection: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.base100,
      borderTopWidth: 1,
      borderTopColor: theme.neutral,
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    checkoutButton: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      borderRadius: theme.borderRadius.xl,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkoutButtonDisabled: {
      backgroundColor: theme.neutral,
    },
    checkoutButtonText: {
      color: theme.primaryContent,
      fontSize: 18,
      fontWeight: '600',
      marginRight: 8,
    },
    checkoutButtonTextDisabled: {
      color: theme.neutralContent,
    },
    securityNote: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    securityText: {
      fontSize: 12,
      color: theme.neutralContent,
      marginLeft: 8,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.baseContent} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Finalisation de la commande</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.summaryLabel, { marginTop: 16, textAlign: 'center' }]}>
            Chargement...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.baseContent} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finalisation de la commande</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Company Information */}
        {company && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Commande pour l'entreprise</Text>
            <View style={styles.companyCard}>
              <Text style={styles.companyName}>{company.name}</Text>
              <Text style={styles.companyDescription}>{company.description}</Text>
              <Text style={styles.companyAddress}>{company.address}</Text>
            </View>
          </View>
        )}

        {/* Order Summary */}
        <View style={styles.orderSummarySection}>
          <Text style={styles.sectionTitle}>Résumé de la commande</Text>
          {cart.map((item) => {
            const article = articles[item.productId];
            if (!article) return null;

            return (
              <View key={item.id} style={styles.cartItem}>
                <Image 
                  source={{ uri: article.image }} 
                  style={styles.productImage}
                  defaultSource={{ uri: 'https://via.placeholder.com/150' }}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productTitle}>{article.title}</Text>
                  <Text style={styles.productPrice}>
                    {article.price.toFixed(2)} €
                  </Text>
                </View>
                <Text style={styles.productQuantity}>x{item.quantity}</Text>
              </View>
            );
          })}

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sous-total</Text>
              <Text style={styles.summaryValue}>{calculateTotal()} €</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Livraison</Text>
              <Text style={styles.summaryValue}>Gratuite</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>TVA (20%)</Text>
              <Text style={styles.summaryValue}>
                {(parseFloat(calculateTotal()) * 0.2).toFixed(2)} €
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total TTC</Text>
              <Text style={styles.totalValue}>
                {(parseFloat(calculateTotal()) * 1.2).toFixed(2)} €
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Méthode de paiement</Text>
          
          <View style={styles.paymentCard}>
            <Ionicons 
              name="card-outline" 
              size={24} 
              color={theme.primary} 
              style={styles.paymentIcon}
            />
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Carte bancaire</Text>
              <Text style={styles.paymentDescription}>
                Paiement sécurisé via Stripe
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color={theme.success} />
          </View>

          <View style={styles.paymentCard}>
            <Ionicons 
              name="logo-paypal" 
              size={24} 
              color="#0070ba" 
              style={styles.paymentIcon}
            />
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>PayPal</Text>
              <Text style={styles.paymentDescription}>
                Paiement rapide et sécurisé
              </Text>
            </View>
          </View>

          <View style={styles.paymentCard}>
            <Ionicons 
              name="business-outline" 
              size={24} 
              color={theme.neutralContent} 
              style={styles.paymentIcon}
            />
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Virement bancaire</Text>
              <Text style={styles.paymentDescription}>
                Pour les commandes entreprise
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Section */}
      <View style={styles.checkoutSection}>
        <View style={styles.securityNote}>
          <Ionicons name="shield-checkmark" size={16} color={theme.success} />
          <Text style={styles.securityText}>
            Paiement 100% sécurisé • Chiffrement SSL
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.checkoutButton,
            isProcessing && styles.checkoutButtonDisabled
          ]}
          onPress={handleCheckout}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <ActivityIndicator size="small" color={theme.primaryContent} />
              <Text style={[styles.checkoutButtonText, { marginLeft: 8 }]}>
                Traitement en cours...
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.checkoutButtonText}>
                Payer {(parseFloat(calculateTotal()) * 1.2).toFixed(2)} €
              </Text>
              <Ionicons name="arrow-forward" size={18} color={theme.primaryContent} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckoutScreen; 