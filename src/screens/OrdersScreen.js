import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackgroundEffects from '../components/BackgroundEffects';

const OrdersScreen = ({ navigation }) => {
  const orders = [
    {
      id: 'ORD-2025-001',
      date: '15 juin 2025',
      status: 'Livré',
      total: '299,00 €',
      items: [
        { name: 'Audit de sécurité complet', quantity: 1, price: '299,00 €' }
      ]
    },
    {
      id: 'ORD-2025-002',
      date: '10 juin 2025',
      status: 'En cours',
      total: '599,00 €',
      items: [
        { name: 'Formation cybersécurité', quantity: 1, price: '599,00 €' }
      ]
    }
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8ff' }}>
      <BackgroundEffects />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#7c3aed" />
          <Text style={styles.backText}>Retour au profil</Text>
        </TouchableOpacity>
        {/* Header */}
        <Text style={styles.title}>Mes commandes</Text>
        <Text style={styles.subtitle}>Consultez l'historique de vos commandes</Text>
        {/* Orders List */}
        {orders.map((order, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: order.status === 'Livré' ? '#dcfce7' : '#fef3c7' }]}>
                <Text style={[styles.statusText, { color: order.status === 'Livré' ? '#10b981' : '#d97706' }]}>{order.status}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            {order.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.orderItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>Quantité : {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>{item.price}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.orderFooter}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{order.total}</Text>
            </View>
            <TouchableOpacity style={styles.detailsBtn}>
              <Text style={styles.detailsText}>Voir les détails</Text>
              <Ionicons name="chevron-forward" size={20} color="#7c3aed" />
            </TouchableOpacity>
          </View>
        ))}
        {/* Empty State */}
        {orders.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color="#a78bfa" />
            <Text style={styles.emptyTitle}>Aucune commande</Text>
            <Text style={styles.emptyText}>Vous n'avez pas encore passé de commande</Text>
            <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.navigate('Products')}>
              <Text style={styles.browseText}>Découvrir nos produits</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backText: { color: '#7c3aed', fontWeight: 'bold', marginLeft: 6, fontSize: 15 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#23234b', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#6b7280', marginBottom: 24, textAlign: 'center' },
  card: { backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 24, padding: 20, marginBottom: 24, shadowColor: '#a78bfa', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  orderId: { fontWeight: 'bold', color: '#23234b', fontSize: 16 },
  orderDate: { color: '#6b7280', fontSize: 14 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontWeight: 'bold', fontSize: 13 },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 12 },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  itemInfo: { flex: 1 },
  itemName: { fontWeight: 'bold', color: '#23234b' },
  itemQuantity: { color: '#6b7280', fontSize: 13 },
  itemPrice: { fontWeight: 'bold', color: '#23234b' },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontWeight: 'bold', color: '#23234b', fontSize: 16 },
  totalValue: { fontWeight: 'bold', color: '#23234b', fontSize: 16 },
  detailsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, padding: 12, backgroundColor: '#f5f3ff', borderRadius: 12 },
  detailsText: { color: '#7c3aed', fontWeight: 'bold', marginRight: 4 },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#23234b', marginTop: 16, marginBottom: 8 },
  emptyText: { color: '#6b7280', textAlign: 'center', marginBottom: 24 },
  browseBtn: { backgroundColor: '#7c3aed', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  browseText: { color: 'white', fontWeight: 'bold' },
});

export default OrdersScreen; 