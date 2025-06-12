import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackgroundEffects from '../components/BackgroundEffects';

const CheckoutScreen = ({ navigation }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingMethod, setShippingMethod] = useState('standard');

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8ff' }}>
      <BackgroundEffects />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#7c3aed" />
          <Text style={styles.backText}>Retour au panier</Text>
        </TouchableOpacity>
        {/* Header */}
        <Text style={styles.title}>Finaliser la commande</Text>
        <Text style={styles.subtitle}>Vérifiez vos informations et choisissez votre mode de paiement</Text>
        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Récapitulatif de la commande</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sous-total</Text>
            <Text style={styles.summaryValue}>299,00 €</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Livraison</Text>
            <Text style={styles.summaryValue}>Gratuite</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>TVA (20%)</Text>
            <Text style={styles.summaryValue}>49,83 €</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>299,00 €</Text>
          </View>
        </View>
        {/* Shipping Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informations de livraison</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Adresse de livraison</Text>
            <TextInput style={styles.input} placeholder="123 rue de la Paix" />
          </View>
          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Code postal</Text>
              <TextInput style={styles.input} placeholder="75001" />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Ville</Text>
              <TextInput style={styles.input} placeholder="Paris" />
            </View>
          </View>
          <View style={styles.shippingMethods}>
            <TouchableOpacity style={[styles.shippingMethod, shippingMethod === 'standard' && styles.shippingMethodActive]} onPress={() => setShippingMethod('standard')}>
              <Ionicons name="car-outline" size={24} color={shippingMethod === 'standard' ? '#7c3aed' : '#6b7280'} />
              <View style={styles.shippingMethodInfo}>
                <Text style={styles.shippingMethodTitle}>Livraison standard</Text>
                <Text style={styles.shippingMethodDesc}>3-5 jours ouvrés</Text>
              </View>
              <Text style={styles.shippingMethodPrice}>Gratuite</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.shippingMethod, shippingMethod === 'express' && styles.shippingMethodActive]} onPress={() => setShippingMethod('express')}>
              <Ionicons name="flash-outline" size={24} color={shippingMethod === 'express' ? '#7c3aed' : '#6b7280'} />
              <View style={styles.shippingMethodInfo}>
                <Text style={styles.shippingMethodTitle}>Livraison express</Text>
                <Text style={styles.shippingMethodDesc}>1-2 jours ouvrés</Text>
              </View>
              <Text style={styles.shippingMethodPrice}>9,99 €</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Payment Method */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mode de paiement</Text>
          <View style={styles.paymentMethods}>
            <TouchableOpacity style={[styles.paymentMethod, paymentMethod === 'card' && styles.paymentMethodActive]} onPress={() => setPaymentMethod('card')}>
              <Ionicons name="card-outline" size={24} color={paymentMethod === 'card' ? '#7c3aed' : '#6b7280'} />
              <Text style={styles.paymentMethodTitle}>Carte bancaire</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.paymentMethod, paymentMethod === 'paypal' && styles.paymentMethodActive]} onPress={() => setPaymentMethod('paypal')}>
              <Ionicons name="logo-paypal" size={24} color={paymentMethod === 'paypal' ? '#7c3aed' : '#6b7280'} />
              <Text style={styles.paymentMethodTitle}>PayPal</Text>
            </TouchableOpacity>
          </View>
          {paymentMethod === 'card' && (
            <View style={styles.cardDetails}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Numéro de carte</Text>
                <TextInput style={styles.input} placeholder="4242 4242 4242 4242" />
              </View>
              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Date d'expiration</Text>
                  <TextInput style={styles.input} placeholder="MM/AA" />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>CVC</Text>
                  <TextInput style={styles.input} placeholder="123" />
                </View>
              </View>
            </View>
          )}
        </View>
        {/* Place Order Button */}
        <TouchableOpacity style={styles.placeOrderBtn}>
          <Text style={styles.placeOrderText}>Passer la commande</Text>
        </TouchableOpacity>
        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Ionicons name="shield-checkmark" size={20} color="#10b981" />
          <Text style={styles.securityText}>Paiement 100% sécurisé</Text>
        </View>
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
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#23234b', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: '#6b7280' },
  summaryValue: { color: '#6b7280' },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 12 },
  totalLabel: { fontWeight: 'bold', color: '#23234b', fontSize: 18 },
  totalValue: { fontWeight: 'bold', color: '#23234b', fontSize: 18 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { color: '#6b7280', marginBottom: 4 },
  input: { backgroundColor: 'white', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  inputRow: { flexDirection: 'row' },
  shippingMethods: { marginTop: 8 },
  shippingMethod: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  shippingMethodActive: { borderColor: '#7c3aed', backgroundColor: '#f5f3ff' },
  shippingMethodInfo: { flex: 1, marginLeft: 12 },
  shippingMethodTitle: { fontWeight: 'bold', color: '#23234b' },
  shippingMethodDesc: { color: '#6b7280', fontSize: 13 },
  shippingMethodPrice: { fontWeight: 'bold', color: '#23234b' },
  paymentMethods: { flexDirection: 'row', marginBottom: 16 },
  paymentMethod: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: 12, padding: 16, marginHorizontal: 4, borderWidth: 1, borderColor: '#e5e7eb' },
  paymentMethodActive: { borderColor: '#7c3aed', backgroundColor: '#f5f3ff' },
  paymentMethodTitle: { fontWeight: 'bold', color: '#23234b', marginLeft: 8 },
  cardDetails: { marginTop: 16 },
  placeOrderBtn: { backgroundColor: '#7c3aed', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  placeOrderText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  securityNotice: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  securityText: { color: '#10b981', fontWeight: 'bold', marginLeft: 8 },
});

export default CheckoutScreen; 