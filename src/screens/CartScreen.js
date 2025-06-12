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

const CartScreen = ({ navigation }) => {
  const { theme, mode } = useTheme();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState({});
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Fetch user's companies
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoadingCompanies(true);
      try {
        // Simulate API call - replace with actual API
        const mockCompanies = [
          { id: 1, name: 'Mon Entreprise', description: 'Entreprise principale' },
          { id: 2, name: 'Startup Tech', description: 'Projet secondaire' },
        ];
        setCompanies(mockCompanies);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
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
          onPress: () => {
            setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));
          }
        },
      ]
    );
  };

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

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Panier vide', 'Ajoutez des articles à votre panier avant de procéder au paiement.');
      return;
    }
    
    if (selectedCompany) {
      navigation.navigate('Checkout', { companyId: selectedCompany.id });
    } else {
      navigation.navigate('Checkout');
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
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 12,
    },
    companyCard: {
      backgroundColor: theme.base100,
      borderRadius: theme.borderRadius.xl,
      padding: 16,
      marginBottom: 8,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    companyCardSelected: {
      borderColor: theme.primary,
      backgroundColor: theme.primary + '10',
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
    },
    cartSection: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      paddingBottom: 32,
    },
    cartSectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 16,
    },
    cartItem: {
      backgroundColor: theme.base200,
      borderRadius: theme.borderRadius.xl,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    productImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 12,
    },
    productInfo: {
      flex: 1,
    },
    productTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.baseContent,
      marginBottom: 4,
    },
    productPrice: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: '600',
    },
    quantityControls: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 12,
    },
    quantityButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.neutral,
      justifyContent: 'center',
      alignItems: 'center',
    },
    quantityText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.baseContent,
      marginHorizontal: 16,
      minWidth: 24,
      textAlign: 'center',
    },
    removeButton: {
      marginLeft: 12,
      padding: 8,
    },
    summarySection: {
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
      marginBottom: 16,
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
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.primary,
    },
    checkoutButton: {
      backgroundColor: theme.primary,
      paddingVertical: 16,
      borderRadius: theme.borderRadius.xl,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkoutButtonText: {
      color: theme.primaryContent,
      fontSize: 18,
      fontWeight: '600',
      marginRight: 8,
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
          <Text style={styles.headerTitle}>Mon Panier</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.emptyDescription, { marginTop: 16 }]}>
            Chargement de votre panier...
          </Text>
        </View>
    </View>
  );
  }

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.baseContent} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mon Panier</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="bag-outline" 
            size={80} 
            color={theme.neutralContent} 
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>Votre panier est vide</Text>
          <Text style={styles.emptyDescription}>
            Découvrez nos produits et ajoutez-les à votre panier pour commencer vos achats.
          </Text>
        <TouchableOpacity
            style={styles.emptyButton}
          onPress={() => navigation.navigate('Products')}
        >
            <Text style={styles.emptyButtonText}>Voir les produits</Text>
            <Ionicons name="arrow-forward" size={16} color={theme.primaryContent} />
        </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Mon Panier</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Company Selection */}
        {companies.length > 0 && (
          <View style={styles.companySection}>
            <Text style={styles.companySectionTitle}>
              Acheter pour une entreprise (optionnel)
            </Text>
            <TouchableOpacity 
              style={[
                styles.companyCard,
                !selectedCompany && styles.companyCardSelected
              ]}
              onPress={() => setSelectedCompany(null)}
            >
              <Text style={styles.companyName}>Achat personnel</Text>
              <Text style={styles.companyDescription}>
                Acheter pour votre compte personnel
              </Text>
            </TouchableOpacity>
            {companies.map((company) => (
              <TouchableOpacity
                key={company.id}
                style={[
                  styles.companyCard,
                  selectedCompany?.id === company.id && styles.companyCardSelected
                ]}
                onPress={() => setSelectedCompany(company)}
              >
                <Text style={styles.companyName}>{company.name}</Text>
                <Text style={styles.companyDescription}>
                  {company.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Cart Items */}
        <View style={styles.cartSection}>
          <Text style={styles.cartSectionTitle}>
            Articles dans votre panier ({cart.length})
          </Text>
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
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Ionicons name="remove" size={16} color={theme.baseContent} />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Ionicons name="add" size={16} color={theme.baseContent} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFromCart(item.id)}
                >
                  <Ionicons name="trash-outline" size={20} color={theme.error} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Summary Section */}
      <View style={styles.summarySection}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sous-total</Text>
          <Text style={styles.summaryValue}>{calculateTotal()} €</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Livraison</Text>
          <Text style={styles.summaryValue}>Gratuite</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{calculateTotal()} €</Text>
        </View>
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>Procéder au paiement</Text>
          <Ionicons name="arrow-forward" size={18} color={theme.primaryContent} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen; 