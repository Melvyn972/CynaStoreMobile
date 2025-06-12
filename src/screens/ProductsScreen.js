import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const numColumns = 2;
const cardSize = (width - 48) / numColumns;

const ProductsScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your API call
    setTimeout(() => {
      setProducts([
        {
          id: 1,
          name: 'Produit 1',
          price: 99.99,
          image: 'https://via.placeholder.com/300x200',
          description: 'Description du produit 1',
        },
        {
          id: 2,
          name: 'Produit 2',
          price: 149.99,
          image: 'https://via.placeholder.com/300x200',
          description: 'Description du produit 2',
        },
        // ...add more
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: isDarkMode ? '#18192a' : '#fff' }]}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={['rgba(167,139,250,0.08)', 'rgba(99,102,241,0.04)']}
        style={StyleSheet.absoluteFill}
      />
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>€{item.price.toFixed(2)}</Text>
        <TouchableOpacity style={styles.addToCartBtn}>
          <Ionicons name="cart-outline" size={18} color="#fff" />
          <Text style={styles.addToCartText}>Ajouter au panier</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a78bfa" />
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
        <Text style={styles.headerTitle}>Boutique</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="search-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={{ padding: 16, paddingTop: 0 }}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardSize,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#a78bfa',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: '100%',
    height: cardSize * 0.6,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#23234b',
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    color: '#7c3aed',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a78bfa',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default ProductsScreen; 