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
  Linking,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { paymentService, cartService, companyService } from '../services';
import { useAuth } from '../context/AuthContext';

const CheckoutScreen = ({ navigation, route }) => {
  const { theme, mode } = useTheme();
  const { isAuthenticated } = useAuth();
  const { companyId } = route.params || {};
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [company, setCompany] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour passer commande.',
        [
          { text: 'Annuler', style: 'cancel', onPress: () => navigation.goBack() },
          { text: 'Se connecter', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    fetchCart();
    if (companyId) {
      fetchCompanyDetails();
    }
  }, [isAuthenticated, companyId]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCartItems(response.items || []);
      
      if (!response.items || response.items.length === 0) {
        Alert.alert(
          'Panier vide',
          'Votre panier est vide. Ajoutez des articles avant de passer commande.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      Alert.alert('Erreur', 'Impossible de charger le panier');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyDetails = async () => {
    try {
      setLoadingCompany(true);
      const response = await companyService.getCompany(companyId);
      setCompany(response.company);
    } catch (error) {
      console.error('Error fetching company details:', error);
      Alert.alert('Erreur', 'Impossible de charger les détails de l\'entreprise');
    } finally {
      setLoadingCompany(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.2; // 20% TVA
  };

  const calculateTotal = () => {
    return (calculateSubtotal() + calculateTax()).toFixed(2);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      Alert.alert('Erreur', 'Vous devez être connecté pour passer commande.');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Erreur', 'Votre panier est vide.');
      return;
    }

    setIsProcessing(true);
    try {
      console.log('Cart items for checkout:', cartItems);
      
      let checkoutResponse;
      
      // Prepare checkout options with URLs
      const checkoutOptions = {
        successUrl: 'cynastore://checkout/success',
        cancelUrl: 'cynastore://checkout/cancel',
        metadata: {
          source: 'mobile_app',
        },
      };
      
      if (companyId) {
        // Company checkout
        checkoutResponse = await paymentService.createCompanyCheckout(companyId, cartItems, checkoutOptions);
      } else {
        // Regular cart checkout
        checkoutResponse = await paymentService.createCartCheckout(cartItems, checkoutOptions);
      }

      if (checkoutResponse.url) {
        // Open Stripe checkout in browser
        const supported = await Linking.canOpenURL(checkoutResponse.url);
        if (supported) {
          await Linking.openURL(checkoutResponse.url);
          
          // Navigate to a waiting screen or back to cart
          navigation.navigate('Cart');
          
          Alert.alert(
            'Redirection vers le paiement',
            'Vous allez être redirigé vers la page de paiement sécurisée.',
            [{ text: 'OK' }]
          );
        } else {
          throw new Error('Impossible d\'ouvrir l\'URL de paiement');
        }
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      Alert.alert(
        'Erreur de paiement',
        error.message || 'Une erreur s\'est produite lors de la création de la session de paiement. Veuillez réessayer.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const renderCartItem = (item) => (
    <View key={item.id} style={styles.cartItem}>
      <Image 
        source={{ uri: item.product?.image || item.image || 'https://via.placeholder.com/150' }} 
        style={styles.productImage}
        defaultSource={{ uri: 'https://via.placeholder.com/150' }}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{item.title || item.product?.title}</Text>
        <Text style={styles.productPrice}>{item.price?.toFixed(2)} €</Text>
      </View>
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityText}>x{item.quantity}</Text>
        <Text style={styles.itemTotal}>
          {(item.price * item.quantity).toFixed(2)} €
        </Text>
      </View>
    </View>
  );

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
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: theme.neutralContent,
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
      backgroundColor: theme.neutral + '20',
    },
    productInfo: {
      flex: 1,
    },
    productTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.baseContent,
      marginBottom: 4,
    },
    productPrice: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: 'bold',
    },
    quantityContainer: {
      alignItems: 'flex-end',
    },
    quantityText: {
      fontSize: 14,
      color: theme.neutralContent,
      marginBottom: 4,
    },
    itemTotal: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.baseContent,
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
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.neutral,
    },
    totalLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.baseContent,
    },
    totalValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.primary,
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
      paddingBottom: 40,
    },
    checkoutButton: {
      backgroundColor: theme.primary,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: 16,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    checkoutButtonDisabled: {
      backgroundColor: theme.neutral,
    },
    checkoutButtonText: {
      color: theme.primaryContent,
      fontSize: 18,
      fontWeight: 'bold',
      marginRight: 8,
    },
    paymentInfo: {
      backgroundColor: theme.info + '20',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    paymentInfoText: {
      fontSize: 14,
      color: theme.info,
      marginLeft: 12,
      flex: 1,
      lineHeight: 20,
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
          <Text style={styles.headerTitle}>Commande</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Chargement de votre commande...</Text>
        </View>
      </View>
    );
  }

  if (!isAuthenticated || cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.baseContent} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Commande</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Ionicons name="cart-outline" size={64} color={theme.neutralContent} />
          <Text style={styles.loadingText}>
            {!isAuthenticated ? 'Connexion requise' : 'Panier vide'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.baseContent} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Commande</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Company Information */}
        {companyId && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="business-outline" size={20} color={theme.baseContent} /> 
              {' '}Facturation entreprise
            </Text>
            {loadingCompany ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : company ? (
              <View style={styles.companyCard}>
                <Text style={styles.companyName}>{company.name}</Text>
                {company.description && (
                  <Text style={styles.companyDescription}>{company.description}</Text>
                )}
                {company.address && (
                  <Text style={styles.companyAddress}>{company.address}</Text>
                )}
              </View>
            ) : (
              <Text style={styles.companyDescription}>
                Impossible de charger les informations de l'entreprise
              </Text>
            )}
          </View>
        )}

        {/* Order Summary */}
        <View style={styles.orderSummarySection}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="receipt-outline" size={20} color={theme.baseContent} />
            {' '}Résumé de la commande ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})
          </Text>
          
          {cartItems.map(renderCartItem)}

          {/* Payment Information */}
          <View style={styles.paymentInfo}>
            <Ionicons name="shield-checkmark" size={20} color={theme.info} />
            <Text style={styles.paymentInfoText}>
              Paiement sécurisé par Stripe. Vos informations de paiement sont protégées et chiffrées.
            </Text>
          </View>

          {/* Price Summary */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sous-total</Text>
            <Text style={styles.summaryValue}>{calculateSubtotal().toFixed(2)} €</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>TVA (20%)</Text>
            <Text style={styles.summaryValue}>{calculateTax().toFixed(2)} €</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Livraison</Text>
            <Text style={styles.summaryValue}>Gratuite</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{calculateTotal()} €</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutSection}>
        <TouchableOpacity 
          style={[
            styles.checkoutButton,
            isProcessing && styles.checkoutButtonDisabled
          ]}
          onPress={handleCheckout}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color={theme.primaryContent} />
          ) : (
            <>
              <Text style={styles.checkoutButtonText}>
                Payer {calculateTotal()} €
              </Text>
              <Ionicons name="card-outline" size={20} color={theme.primaryContent} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CheckoutScreen; 