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
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const numColumns = 2;
const cardSize = (width - 48) / numColumns;

const ProductsScreen = ({ navigation }) => {
  const { theme, mode } = useTheme();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tous', icon: 'grid-outline' },
    { id: 'security', name: 'Sécurité', icon: 'shield-checkmark-outline' },
    { id: 'monitoring', name: 'Surveillance', icon: 'eye-outline' },
    { id: 'compliance', name: 'Conformité', icon: 'document-text-outline' },
    { id: 'support', name: 'Support', icon: 'headset-outline' },
  ];

  useEffect(() => {
    // Simulate API call - replace with actual API
    setTimeout(() => {
      setProducts([
        {
          id: 1,
          name: 'Protection Avancée',
          price: 99.99,
          image: 'https://via.placeholder.com/300x200',
          description: 'Solution de cybersécurité complète pour votre entreprise',
          category: 'security',
          features: ['Antivirus', 'Firewall', 'Protection temps réel'],
          popular: true,
        },
        {
          id: 2,
          name: 'Surveillance 24/7',
          price: 149.99,
          image: 'https://via.placeholder.com/300x200',
          description: 'Monitoring continu de votre infrastructure',
          category: 'monitoring',
          features: ['Alertes temps réel', 'Rapports détaillés', 'Dashboard'],
          popular: false,
        },
        {
          id: 3,
          name: 'Conformité RGPD',
          price: 199.99,
          image: 'https://via.placeholder.com/300x200',
          description: 'Mise en conformité avec les réglementations',
          category: 'compliance',
          features: ['Audit RGPD', 'Documentation', 'Formation'],
          popular: true,
        },
        {
          id: 4,
          name: 'Support Premium',
          price: 79.99,
          image: 'https://via.placeholder.com/300x200',
          description: 'Assistance technique prioritaire',
          category: 'support',
          features: ['Support 24/7', 'Intervention rapide', 'Formation'],
          popular: false,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery]);

  const addToCart = (product) => {
    Alert.alert(
      'Ajouté au panier',
      `${product.name} a été ajouté à votre panier.`,
      [
        { text: 'Continuer', style: 'cancel' },
        { text: 'Voir le panier', onPress: () => navigation.navigate('Cart') }
      ]
    );
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
      activeOpacity={0.9}
    >
      {item.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>Populaire</Text>
        </View>
      )}
      
      <Image 
        source={{ uri: item.image }} 
        style={styles.productImage} 
        resizeMode="cover" 
      />
      
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.featuresContainer}>
          {item.features.slice(0, 2).map((feature, index) => (
            <View key={index} style={styles.featureTag}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>{item.price.toFixed(2)} €</Text>
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={() => addToCart(item)}
          >
            <Ionicons name="cart-outline" size={16} color={theme.primaryContent} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.categoryButtonActive
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Ionicons 
        name={item.icon} 
        size={20} 
        color={selectedCategory === item.id ? theme.primaryContent : theme.baseContent} 
      />
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === item.id && styles.categoryButtonTextActive
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base100,
    },
    header: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      paddingTop: 60,
      backgroundColor: theme.base100,
      borderBottomWidth: 1,
      borderBottomColor: theme.neutral,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.baseContent,
    },
    cartButton: {
      backgroundColor: theme.primary + '20',
      borderRadius: 12,
      padding: 8,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.base200,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 16,
    },
    searchIcon: {
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.baseContent,
    },
    categoriesContainer: {
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    categoryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.base200,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginRight: 12,
    },
    categoryButtonActive: {
      backgroundColor: theme.primary,
    },
    categoryButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.baseContent,
      marginLeft: 8,
    },
    categoryButtonTextActive: {
      color: theme.primaryContent,
    },
    productsContainer: {
      flex: 1,
      paddingHorizontal: 16,
    },
    productCard: {
      width: cardSize,
      backgroundColor: theme.base200,
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
      marginBottom: 16,
      position: 'relative',
    },
    popularBadge: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: theme.accent,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      zIndex: 1,
    },
    popularBadgeText: {
      fontSize: 10,
      fontWeight: '600',
      color: theme.primaryContent,
    },
    productImage: {
      width: '100%',
      height: cardSize * 0.6,
    },
    productInfo: {
      padding: 16,
    },
    productName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.baseContent,
      marginBottom: 4,
    },
    productDescription: {
      fontSize: 12,
      color: theme.neutralContent,
      marginBottom: 12,
      lineHeight: 16,
    },
    featuresContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 12,
    },
    featureTag: {
      backgroundColor: theme.primary + '20',
      borderRadius: 8,
      paddingHorizontal: 6,
      paddingVertical: 2,
      marginRight: 4,
      marginBottom: 4,
    },
    featureText: {
      fontSize: 10,
      color: theme.primary,
      fontWeight: '500',
    },
    productFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    productPrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.primary,
    },
    addToCartButton: {
      backgroundColor: theme.primary,
      borderRadius: 8,
      padding: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.base100,
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
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyDescription: {
      fontSize: 16,
      color: theme.neutralContent,
      textAlign: 'center',
      lineHeight: 24,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.emptyDescription, { marginTop: 16 }]}>
          Chargement des produits...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Boutique</Text>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="cart-outline" size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons 
            name="search-outline" 
            size={20} 
            color={theme.neutralContent} 
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un produit..."
            placeholderTextColor={theme.neutralContent}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Products */}
      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="search-outline" 
            size={64} 
            color={theme.neutralContent} 
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>Aucun produit trouvé</Text>
          <Text style={styles.emptyDescription}>
            Essayez de modifier vos critères de recherche ou explorez d'autres catégories.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={item => item.id.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.productsContainer}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ProductsScreen; 