import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { userService } from '../services';
import { useAuth } from '../context/AuthContext';

const OrdersScreen = ({ navigation }) => {
  const { theme, mode } = useTheme();
  const { isAuthenticated } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserOrders();
      console.log('Orders response:', response); // Pour déboguer
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Erreur', 'Impossible de charger les commandes');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return theme.warning;
      case 'processing':
        return theme.info;
      case 'shipped':
        return theme.primary;
      case 'delivered':
        return theme.success;
      case 'cancelled':
        return theme.error;
      default:
        return theme.neutralContent;
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'En attente';
      case 'processing':
        return 'En traitement';
      case 'shipped':
        return 'Expédiée';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status || 'Statut inconnu';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'time-outline';
      case 'processing':
        return 'cog-outline';
      case 'shipped':
        return 'car-outline';
      case 'delivered':
        return 'checkmark-circle-outline';
      case 'cancelled':
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const renderOrderCard = (order) => {
    // Utiliser directement les items de l'ordre
    if (!order.items || order.items.length === 0) {
      return null;
    }

    return (
      <View key={order.date} style={styles.orderCard}>
        {order.items.map((item, index) => (
          <View 
            key={`${order.date}-${item.article.id}-${index}`} 
            style={[
              styles.purchaseItem,
              index === order.items.length - 1 && styles.lastPurchaseItem
            ]}
          >
            <View style={styles.itemRow}>
              <Image 
                source={{ uri: item.article.image || 'https://via.placeholder.com/80x80' }} 
                style={styles.itemImage}
                resizeMode="cover"
              />
              <View style={styles.itemDetails}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.article.title}</Text>
                  <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                </View>
                <Text style={styles.itemTitle}>{item.article.title}</Text>
                <Text style={styles.purchaseDate}>Acheté le {formatDate(order.date)}</Text>
                <Text style={styles.itemPrice}>
                  {(item.article.price * item.quantity).toFixed(2)} €
                </Text>
              </View>
            </View>
          </View>
        ))}
        
        <View style={styles.orderFooter}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total de la commande</Text>
            <Text style={styles.orderTotal}>
              {order.total?.toFixed(2) || '0.00'} €
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base100,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingVertical: 40,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: mode === 'dark' ? theme.base200 + '80' : theme.base100 + 'CC',
      borderWidth: 1,
      borderColor: mode === 'dark' ? theme.neutral : theme.base300,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 32,
      alignSelf: 'flex-start',
    },
    backButtonText: {
      fontSize: 14,
      color: theme.baseContent,
      marginLeft: 8,
    },
    header: {
      alignItems: 'center',
      marginBottom: 32,
    },
    headerIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.baseContent,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.neutralContent,
      textAlign: 'center',
      marginBottom: 8,
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
    orderCard: {
      backgroundColor: theme.base200,
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: mode === 'dark' ? theme.neutral + '40' : theme.base300,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    purchaseItem: {
      marginBottom: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: mode === 'dark' ? theme.neutral + '30' : theme.base300,
    },
    lastPurchaseItem: {
      borderBottomWidth: 0,
      marginBottom: 0,
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    itemImage: {
      width: 80,
      height: 80,
      borderRadius: 12,
      marginRight: 16,
      backgroundColor: theme.neutral + '20',
    },
    itemDetails: {
      flex: 1,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 6,
    },
    itemName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.baseContent,
      flex: 1,
      lineHeight: 22,
    },
    itemQuantity: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.primary,
      backgroundColor: theme.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      overflow: 'hidden',
    },
    itemTitle: {
      fontSize: 16,
      color: theme.neutralContent,
      marginBottom: 6,
    },
    purchaseDate: {
      fontSize: 14,
      color: theme.neutralContent,
      marginBottom: 8,
      fontStyle: 'italic',
    },
    itemPrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.primary,
    },
    orderFooter: {
      marginTop: 8,
      paddingTop: 16,
      borderTopWidth: 2,
      borderTopColor: theme.primary + '30',
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.baseContent,
    },
    orderTotal: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.primary,
    },
  });

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={theme.baseContent} />
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="receipt-outline" size={24} color={theme.primary} />
            </View>
            <Text style={styles.title}>Mes achats récents</Text>
            <Text style={styles.subtitle}>Historique de vos achats</Text>
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
              Vous devez être connecté pour voir vos commandes.
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.emptyButtonText}>Se connecter</Text>
              <Ionicons name="log-in-outline" size={20} color={theme.primaryContent} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={theme.baseContent} />
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="receipt-outline" size={24} color={theme.primary} />
            </View>
            <Text style={styles.title}>Mes achats récents</Text>
            <Text style={styles.subtitle}>Historique de vos achats</Text>
          </View>

          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={styles.loadingText}>Chargement des commandes...</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={theme.baseContent} />
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="receipt-outline" size={24} color={theme.primary} />
          </View>
          <Text style={styles.title}>Mes achats récents</Text>
          <Text style={styles.subtitle}>
            {orders.length > 0 
              ? `${orders.length} commande${orders.length > 1 ? 's' : ''}`
              : 'Historique de vos achats'
            }
          </Text>
        </View>

        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons 
              name="receipt-outline" 
              size={64} 
              color={theme.neutralContent} 
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>Aucune commande</Text>
            <Text style={styles.emptyDescription}>
              Vous n'avez encore passé aucune commande. Explorez nos produits et faites votre première commande !
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
          orders.map((order) => renderOrderCard(order))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrdersScreen; 