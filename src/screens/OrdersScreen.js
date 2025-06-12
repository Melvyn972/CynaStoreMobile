import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const OrdersScreen = ({ navigation }) => {
  const { theme, mode } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState([
    {
      id: 'CMD-2024-001',
      date: '15 Janvier 2024',
      total: 89.99,
      items: 3,
      products: [
        { name: 'iPhone 15 Pro Max', quantity: 1 },
        { name: 'AirPods Pro', quantity: 1 },
        { name: 'Coque iPhone', quantity: 1 }
      ]
    },
    {
      id: 'CMD-2024-002',
      date: '8 Janvier 2024',
      total: 156.50,
      items: 2,
      products: [
        { name: 'MacBook Air M2', quantity: 1 },
        { name: 'Magic Mouse', quantity: 1 }
      ]
    },

    {
      id: 'CMD-2023-044',
      date: '18 Décembre 2023',
      total: 299.99,
      items: 4,
      products: [
        { name: 'iPad Pro 11"', quantity: 1 },
        { name: 'Apple Pencil', quantity: 1 },
        { name: 'Smart Keyboard', quantity: 1 },
        { name: 'Étui iPad', quantity: 1 }
      ]
    },
    {
      id: 'CMD-2023-043',
      date: '10 Décembre 2023',
      total: 78.50,
      items: 2,
      products: [
        { name: 'AirTag Pack', quantity: 1 },
        { name: 'Chargeur MagSafe', quantity: 1 }
      ]
    }
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
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
    orderCard: {
      backgroundColor: theme.base200,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: mode === 'dark' ? theme.neutral + '40' : theme.base300,
    },
    orderHeader: {
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
      backgroundColor: theme.base100,
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
      marginBottom: 0,
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
    orderActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginHorizontal: 4,
    },
    primaryButton: {
      backgroundColor: theme.primary,
    },
    secondaryButton: {
      backgroundColor: theme.base100,
      borderWidth: 1,
      borderColor: theme.neutral,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '600',
    },
    primaryButtonText: {
      color: theme.primaryContent,
    },
    secondaryButtonText: {
      color: theme.baseContent,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.neutral + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 8,
    },
    emptyDescription: {
      fontSize: 14,
      color: theme.neutralContent,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  const renderOrderCard = (order) => (
    <View key={order.id} style={styles.orderCard}>
      {/* Header */}
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.orderDate}>{order.date}</Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.orderDetails}>
        <Text style={styles.orderTotal}>{order.total.toFixed(2)} €</Text>
        <Text style={styles.orderItems}>{order.items} article{order.items > 1 ? 's' : ''}</Text>
        
        {/* Products List */}
        <View style={styles.productsList}>
          {order.products.map((product, index) => (
            <View key={index} style={styles.productItem}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productQuantity}>x{product.quantity}</Text>
            </View>
          ))}
        </View>
      </View>


    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Bouton retour */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={theme.baseContent} />
          <Text style={styles.backButtonText}>Retour au profil</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="receipt-outline" size={24} color={theme.primary} />
          </View>
          <Text style={styles.title}>Historique des commandes</Text>
          <Text style={styles.subtitle}>
            Retrouvez toutes vos commandes passées
          </Text>
        </View>

        {/* Orders List */}
        {orders.length > 0 ? (
          orders.map(renderOrderCard)
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="receipt-outline" size={40} color={theme.neutral} />
            </View>
            <Text style={styles.emptyTitle}>Aucune commande</Text>
            <Text style={styles.emptyDescription}>
              Vous n'avez pas encore passé de commande.{'\n'}
              Découvrez nos produits pour commencer !
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrdersScreen; 