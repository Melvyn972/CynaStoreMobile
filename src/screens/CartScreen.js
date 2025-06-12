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
import { cartService, companyService } from '../services';
import { useAuth } from '../context/AuthContext';

const CartScreen = ({ navigation }) => {
  const { theme, mode } = useTheme();
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch cart items
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchCompanies();
    } else {
      setLoading(false);
      setLoadingCompanies(false);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCartItems(response.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      Alert.alert('Erreur', 'Impossible de charger le panier');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      setLoadingCompanies(true);
      const response = await companyService.getCompanies();
      setCompanies(response.companies || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      // Non-blocking error - user can still checkout without company
    } finally {
      setLoadingCompanies(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    
    try {
      setUpdating(true);
      await cartService.updateCartItem(cartItemId, newQuantity);
      
      // Update local state
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour la quantité');
    } finally {
      setUpdating(false);
    }
  };

  const removeFromCart = (cartItemId) => {
    Alert.alert(
      'Supprimer l\'article',
      'Êtes-vous sûr de vouloir supprimer cet article du panier ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: async () => {
            try {
              setUpdating(true);
              await cartService.removeFromCart(cartItemId);
              
              // Update local state
              setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
            } catch (error) {
              console.error('Error removing from cart:', error);
              Alert.alert('Erreur', 'Impossible de supprimer l\'article');
            } finally {
              setUpdating(false);
            }
          }
        },
      ]
    );
  };

  const clearCart = () => {
    Alert.alert(
      'Vider le panier',
      'Êtes-vous sûr de vouloir vider votre panier ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Vider', 
          style: 'destructive',
          onPress: async () => {
            try {
              setUpdating(true);
              await cartService.clearCart();
              setCartItems([]);
            } catch (error) {
              console.error('Error clearing cart:', error);
              Alert.alert('Erreur', 'Impossible de vider le panier');
            } finally {
              setUpdating(false);
            }
          }
        },
      ]
    );
  };

  // Calculate total
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0).toFixed(2);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour passer commande.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Panier vide', 'Ajoutez des articles à votre panier avant de procéder au paiement.');
      return;
    }
    
    if (selectedCompany) {
      navigation.navigate('Checkout', { companyId: selectedCompany.id });
    } else {
      navigation.navigate('Checkout');
    }
  };

  const renderCartItem = (item) => (
    <View key={item.id} style={styles.cartItem}>
      <Image 
                      source={{ uri: item.product?.image || 'https://picsum.photos/150/150' }} 
        style={styles.itemImage} 
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title || item.product?.title}</Text>
        <Text style={styles.itemPrice}>{item.price?.toFixed(2)} €</Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
          disabled={updating}
        >
          <Ionicons name="remove" size={16} color={theme.baseContent} />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
          disabled={updating}
        >
          <Ionicons name="add" size={16} color={theme.baseContent} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeFromCart(item.id)}
        disabled={updating}
      >
        <Ionicons name="trash-outline" size={20} color={theme.error} />
      </TouchableOpacity>
    </View>
  );

  const renderCompanySelector = () => (
    <View style={styles.companySection}>
      <Text style={styles.companySectionTitle}>Facturer à une entreprise (optionnel)</Text>
      {loadingCompanies ? (
        <ActivityIndicator size="small" color={theme.primary} />
      ) : companies.length > 0 ? (
        <View>
          <TouchableOpacity 
            style={[
              styles.companyOption,
              !selectedCompany && styles.companyOptionSelected
            ]}
            onPress={() => setSelectedCompany(null)}
          >
            <Ionicons 
              name={!selectedCompany ? "radio-button-on" : "radio-button-off"} 
              size={20} 
              color={theme.primary} 
            />
            <Text style={styles.companyOptionText}>Particulier</Text>
          </TouchableOpacity>
          
          {companies.map((company) => (
            <TouchableOpacity 
              key={company.id}
              style={[
                styles.companyOption,
                selectedCompany?.id === company.id && styles.companyOptionSelected
              ]}
              onPress={() => setSelectedCompany(company)}
            >
              <Ionicons 
                name={selectedCompany?.id === company.id ? "radio-button-on" : "radio-button-off"} 
                size={20} 
                color={theme.primary} 
              />
              <View style={styles.companyInfo}>
                <Text style={styles.companyName}>{company.name}</Text>
                {company.description && (
                  <Text style={styles.companyDescription}>{company.description}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.noCompaniesText}>
          Aucune entreprise disponible
        </Text>
      )}
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
    clearButton: {
      backgroundColor: theme.error + '20',
      borderRadius: 12,
      padding: 8,
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
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyDescription: {
      fontSize: 16,
      color: theme.neutralContent,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 24,
    },
    emptyButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: theme.borderRadius.xl,
      flexDirection: 'row',
      alignItems: 'center',
    },
    emptyButtonText: {
      color: theme.primaryContent,
      fontSize: 16,
      fontWeight: '600',
      marginRight: 8,
    },
    scrollContainer: {
      paddingBottom: 200,
    },
    companySection: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      backgroundColor: theme.base200,
    },
    companySectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 12,
    },
    companyOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    companyOptionSelected: {
      backgroundColor: theme.primary + '20',
      borderColor: theme.primary + '30',
    },
    companyOptionText: {
      fontSize: 16,
      color: theme.baseContent,
      marginLeft: 12,
    },
    companyInfo: {
      marginLeft: 12,
      flex: 1,
    },
    companyName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.baseContent,
    },
    companyDescription: {
      fontSize: 14,
      color: theme.neutralContent,
      marginTop: 2,
    },
    noCompaniesText: {
      fontSize: 14,
      color: theme.neutralContent,
      textAlign: 'center',
      paddingVertical: 16,
    },
    cartItems: {
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    cartItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.base200,
      borderRadius: theme.borderRadius.xl,
      padding: 16,
      marginBottom: 12,
    },
    itemImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      backgroundColor: theme.neutral + '20',
    },
    itemInfo: {
      flex: 1,
      marginLeft: 12,
    },
    itemTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.baseContent,
      marginBottom: 4,
    },
    itemPrice: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: 'bold',
    },
    quantityControls: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.base100,
      borderRadius: 8,
      marginRight: 12,
    },
    quantityButton: {
      backgroundColor: theme.base300,
      borderRadius: 6,
      padding: 8,
      marginHorizontal: 2,
    },
    quantityText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginHorizontal: 12,
      minWidth: 30,
      textAlign: 'center',
    },
    removeButton: {
      padding: 8,
    },
    summary: {
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
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    totalLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.baseContent,
    },
    totalAmount: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.primary,
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
  });

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.baseContent} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Panier</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="lock-closed-outline" 
            size={64} 
            color={theme.neutralContent} 
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>Connexion requise</Text>
          <Text style={styles.emptyDescription}>
            Vous devez être connecté pour voir votre panier.
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.emptyButtonText}>Se connecter</Text>
            <Ionicons name="log-in-outline" size={20} color={theme.primaryContent} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
          <Text style={styles.headerTitle}>Panier</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Chargement du panier...</Text>
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
        <Text style={styles.headerTitle}>Panier</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearCart}
            disabled={updating}
          >
            <Ionicons name="trash-outline" size={20} color={theme.error} />
          </TouchableOpacity>
        )}
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="cart-outline" 
            size={64} 
            color={theme.neutralContent} 
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>Panier vide</Text>
          <Text style={styles.emptyDescription}>
            Votre panier est vide. Explorez nos produits et ajoutez-en quelques-uns !
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.emptyButtonText}>Voir les produits</Text>
            <Ionicons name="arrow-forward" size={20} color={theme.primaryContent} />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Company Selection */}
            {renderCompanySelector()}

            {/* Cart Items */}
            <View style={styles.cartItems}>
              {cartItems.map(renderCartItem)}
            </View>
          </ScrollView>

          {/* Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>{calculateTotal()} €</Text>
            </View>
            <TouchableOpacity 
              style={[
                styles.checkoutButton,
                updating && styles.checkoutButtonDisabled
              ]}
              onPress={handleCheckout}
              disabled={updating}
            >
              <Text style={styles.checkoutButtonText}>
                {updating ? 'Mise à jour...' : 'Passer commande'}
              </Text>
              {!updating && (
                <Ionicons name="arrow-forward" size={20} color={theme.primaryContent} />
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default CartScreen; 