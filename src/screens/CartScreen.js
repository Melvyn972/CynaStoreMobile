import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const CartScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Produit 1',
      price: 99.99,
      quantity: 1,
      image: 'https://via.placeholder.com/300x200',
    },
    {
      id: 2,
      name: 'Produit 2',
      price: 149.99,
      quantity: 2,
      image: 'https://via.placeholder.com/300x200',
    },
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const renderCartItem = ({ item }) => (
    <View style={[styles.cartItem, { backgroundColor: isDarkMode ? '#18192a' : '#fff' }]}> 
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>€{item.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, -1)}
          >
            <Ionicons name="remove" size={20} color="#a78bfa" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, 1)}
          >
            <Ionicons name="add" size={20} color="#a78bfa" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeItem(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyCartContainer}>
        <Ionicons name="cart-outline" size={64} color="#a78bfa" />
        <Text style={styles.emptyCartText}>Votre panier est vide</Text>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('Products')}
        >
          <Text style={styles.checkoutButtonText}>Commencer vos achats</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#10111a' : '#f8f8ff' }}>
      {/* Custom Header */}
      <LinearGradient
        colors={[isDarkMode ? '#23234b' : '#a78bfa', isDarkMode ? '#18192a' : '#f8f8ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerContainer}
      >
        <Text style={styles.headerTitle}>Mon Panier</Text>
        <Ionicons name="cart-outline" size={26} color="#fff" style={styles.headerIcon} />
      </LinearGradient>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.cartList}
        contentContainerStyle={{ padding: 16, paddingBottom: 120, paddingTop: 0 }}
        showsVerticalScrollIndicator={false}
      />
      <LinearGradient
        colors={[isDarkMode ? '#18192a' : '#fff', 'rgba(167,139,250,0.08)']}
        style={styles.summaryContainer}
      >
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Sous-total</Text>
          <Text style={styles.summaryText}>€{calculateTotal().toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Livraison</Text>
          <Text style={styles.summaryText}>Gratuite</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalText}>€{calculateTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Procéder au paiement</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    marginBottom: 16,
    padding: 12,
    elevation: 2,
    shadowColor: '#a78bfa',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 14,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#23234b',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    color: '#7c3aed',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  quantityButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(167,139,250,0.08)',
    marginHorizontal: 4,
  },
  quantity: {
    fontSize: 15,
    color: '#23234b',
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  summaryContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowColor: '#a78bfa',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 15,
    color: '#23234b',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7c3aed',
    marginBottom: 8,
  },
  checkoutButton: {
    backgroundColor: '#a78bfa',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#a78bfa',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  headerIcon: {
    backgroundColor: 'rgba(124,58,237,0.18)',
    borderRadius: 16,
    padding: 8,
  },
  cartList: {
    flex: 1,
  },
});

export default CartScreen; 