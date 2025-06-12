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
      const response = await userService.getOrders();
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

  const renderOrderCard = (order) => (
    <View key={order.id} style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>#{order.id}</Text>
          <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
        </View>
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor(order.status) + '20' }]}>
          <Ionicons 
            name={getStatusIcon(order.status)} 
            size={14} 
            color={getStatusColor(order.status)}
            style={styles.statusIcon}
          />
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {getStatusText(order.status)}
          </Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <Text style={styles.orderTotal}>
          {order.total?.toFixed(2) || '0.00'} €
        </Text>
        <Text style={styles.orderItems}>
          {order.itemsCount || order.items?.length || 0} article{(order.itemsCount || order.items?.length || 0) > 1 ? 's' : ''}
        </Text>

        {order.items && order.items.length > 0 && (
          <ScrollView style={styles.productsList} showsVerticalScrollIndicator={false}>
            {order.items.slice(0, 3).map((item, index) => (
              <View key={index} style={styles.productItem}>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.title || item.name || 'Article'}
                </Text>
                <Text style={styles.productQuantity}>x{item.quantity}</Text>
              </View>
            ))}
            {order.items.length > 3 && (
              <Text style={styles.moreItems}>
                +{order.items.length - 3} autre{order.items.length - 3 > 1 ? 's' : ''}
              </Text>
            )}
          </ScrollView>
        )}
      </View>

      <View style={styles.orderActions}>
        <TouchableOpacity
          style={styles.reorderButton}
          onPress={() => {
            Alert.alert(
              'Commander à nouveau',
              'Cette fonctionnalité sera bientôt disponible.',
              [{ text: 'OK' }]
            );
          }}
        >
          <Ionicons name="refresh-outline" size={16} color={theme.primary} />
          <Text style={styles.reorderButtonText}>Commander à nouveau</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => {
            Alert.alert(
              'Détails de la commande',
              `Commande #${order.id}\nTotal: ${order.total?.toFixed(2) || '0.00'} €\nStatut: ${getStatusText(order.status)}`,
              [{ text: 'OK' }]
            );
          }}
        >
          <Text style={styles.detailsButtonText}>Détails</Text>
          <Ionicons name="arrow-forward" size={16} color={theme.baseContent} />
        </TouchableOpacity>
      </View>
    </View>
  );

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
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.baseContent,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.neutralContent,
      textAlign: 'center',
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
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: mode === 'dark' ? theme.neutral + '40' : theme.base300,
    },
    orderHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    orderInfo: {
      flex: 1,
    },
    orderId: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 4,
    },
    orderDate: {
      fontSize: 14,
      color: theme.neutralContent,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    statusIcon: {
      marginRight: 6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
    },
    orderDetails: {
      marginBottom: 16,
    },
    orderTotal: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 8,
    },
    orderItems: {
      fontSize: 14,
      color: theme.neutralContent,
      marginBottom: 12,
    },
    productsList: {
      maxHeight: 100,
      marginBottom: 16,
    },
    productItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 4,
    },
    productName: {
      fontSize: 14,
      color: theme.baseContent,
      flex: 1,
    },
    productQuantity: {
      fontSize: 14,
      color: theme.neutralContent,
      fontWeight: '500',
    },
    moreItems: {
      fontSize: 12,
      color: theme.neutralContent,
      fontStyle: 'italic',
      marginTop: 4,
    },
    orderActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    reorderButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary + '20',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 8,
      flex: 1,
      marginRight: 8,
      justifyContent: 'center',
    },
    reorderButtonText: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: '600',
      marginLeft: 6,
    },
    detailsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.base100,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: theme.neutral,
    },
    detailsButtonText: {
      fontSize: 14,
      color: theme.baseContent,
      fontWeight: '600',
      marginRight: 6,
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
            <Text style={styles.title}>Mes Commandes</Text>
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
            <Text style={styles.title}>Mes Commandes</Text>
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
          <Text style={styles.title}>Mes Commandes</Text>
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
          orders.map(renderOrderCard)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrdersScreen; 