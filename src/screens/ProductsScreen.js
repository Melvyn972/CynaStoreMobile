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
import { articleService, cartService } from '../services';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const numColumns = 2;
const cardSize = (width - 48) / numColumns;

const ProductsScreen = ({ navigation }) => {
  const { theme, mode } = useTheme();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [addingToCart, setAddingToCart] = useState({}); // Track loading state for each product

  const categories = [
    { id: 'all', name: 'Tous', icon: 'grid-outline' },
    { id: 'security', name: 'Sécurité', icon: 'shield-checkmark-outline' },
    { id: 'monitoring', name: 'Surveillance', icon: 'eye-outline' },
    { id: 'compliance', name: 'Conformité', icon: 'document-text-outline' },
    { id: 'support', name: 'Support', icon: 'headset-outline' },
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchQuery]);

  const loadProducts = async (pageNumber = 1, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        setPage(1);
      } else if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await articleService.getArticles(pageNumber, 20);
      
      if (pageNumber === 1 || isRefresh) {
        setProducts(response.articles || []);
      } else {
        setProducts(prev => [...prev, ...(response.articles || [])]);
      }

      setHasMore(response.pagination?.hasMore || false);
      setPage(pageNumber);

    } catch (error) {
      console.error('Error loading products:', error);
      Alert.alert('Erreur', 'Impossible de charger les produits');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim()) {
      try {
        setLoading(true);
        const response = await articleService.searchArticles(query, 1, 20);
        setProducts(response.articles || []);
        setHasMore(response.pagination?.hasMore || false);
      } catch (error) {
        console.error('Error searching products:', error);
        Alert.alert('Erreur', 'Erreur lors de la recherche');
      } finally {
        setLoading(false);
      }
    } else {
      loadProducts(1, true);
    }
  };

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    
    try {
      setLoading(true);
      if (categoryId === 'all') {
        await loadProducts(1, true);
      } else {
        const response = await articleService.getArticlesByCategory(categoryId, 1, 20);
        setProducts(response.articles || []);
        setHasMore(response.pagination?.hasMore || false);
      }
    } catch (error) {
      console.error('Error filtering by category:', error);
      Alert.alert('Erreur', 'Erreur lors du filtrage');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    if (!isAuthenticated) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour ajouter des articles au panier.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    // Set loading state for this specific product
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));

    try {
      await cartService.addToCart(product.id, 1);
      
      // Show success feedback with a short delay to show the loading state
      setTimeout(() => {
        Alert.alert(
          '✅ Ajouté au panier',
          `${product.title} a été ajouté à votre panier.`,
          [
            { text: 'Continuer les achats', style: 'cancel' },
            { text: 'Voir le panier', onPress: () => navigation.navigate('Cart') }
          ]
        );
      }, 300);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter l\'article au panier. Veuillez réessayer.');
    } finally {
      // Remove loading state for this product
      setTimeout(() => {
        setAddingToCart(prev => ({ ...prev, [product.id]: false }));
      }, 300);
    }
  };

  const loadMoreProducts = () => {
    if (hasMore && !loadingMore && !searchQuery) {
      loadProducts(page + 1);
    }
  };

  const handleRefresh = () => {
    loadProducts(1, true);
  };

  const renderProduct = ({ item }) => {
    const isLoadingThisItem = addingToCart[item.id];
    
    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
        activeOpacity={0.9}
      >
        <Image 
          source={{ uri: item.image || 'https://picsum.photos/300/200' }} 
          style={styles.productImage} 
          resizeMode="cover" 
        />
        
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.title}</Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description || 'Aucune description disponible'}
          </Text>
          
          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>{item.price?.toFixed(2) || '0.00'} €</Text>
            <TouchableOpacity 
              style={[
                styles.addToCartButton,
                isLoadingThisItem && styles.addToCartButtonLoading
              ]}
              onPress={() => addToCart(item)}
              disabled={isLoadingThisItem}
            >
              {isLoadingThisItem ? (
                <ActivityIndicator size={16} color={theme.primaryContent} />
              ) : (
                <Ionicons name="cart-outline" size={16} color={theme.primaryContent} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.categoryButtonActive
      ]}
      onPress={() => handleCategoryChange(item.id)}
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

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.primary} />
      </View>
    );
  };

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
      backgroundColor: theme.base200,
      borderRadius: 12,
      padding: 8,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.base200,
      borderRadius: 12,
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
      marginBottom: 16,
    },
    categoryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.base200,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 12,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    categoryButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    categoryButtonText: {
      fontSize: 14,
      color: theme.baseContent,
      marginLeft: 8,
      fontWeight: '500',
    },
    categoryButtonTextActive: {
      color: theme.primaryContent,
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
    productsContainer: {
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    productCard: {
      backgroundColor: theme.base200,
      borderRadius: theme.borderRadius.xl,
      marginBottom: 16,
      marginRight: 16,
      width: cardSize,
      overflow: 'hidden',
    },
    productImage: {
      width: '100%',
      height: 120,
      backgroundColor: theme.neutral + '20',
    },
    productInfo: {
      padding: 16,
    },
    productName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 4,
    },
    productDescription: {
      fontSize: 14,
      color: theme.neutralContent,
      marginBottom: 12,
      lineHeight: 20,
    },
    productFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    productPrice: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.primary,
    },
    addToCartButton: {
      backgroundColor: theme.primary,
      borderRadius: 8,
      padding: 8,
      minWidth: 32,
      minHeight: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addToCartButtonLoading: {
      opacity: 0.7,
    },
    footerLoader: {
      paddingVertical: 20,
      alignItems: 'center',
    },
  });

  if (loading && products.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Produits</Text>
            <TouchableOpacity 
              style={styles.cartButton}
              onPress={() => navigation.navigate('Cart')}
            >
              <Ionicons name="cart-outline" size={24} color={theme.baseContent} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Chargement des produits...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Produits</Text>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="cart-outline" size={24} color={theme.baseContent} />
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
            onChangeText={handleSearch}
          />
        </View>

        {/* Categories */}
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />
      </View>

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="cube-outline" 
            size={64} 
            color={theme.neutralContent} 
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'Aucun résultat' : 'Aucun produit'}
          </Text>
          <Text style={styles.emptyDescription}>
            {searchQuery 
              ? `Aucun produit ne correspond à votre recherche "${searchQuery}"`
              : 'Aucun produit disponible pour le moment'
            }
          </Text>
          {searchQuery && (
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => handleSearch('')}
            >
              <Text style={styles.emptyButtonText}>Effacer la recherche</Text>
              <Ionicons name="close-outline" size={20} color={theme.primaryContent} />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={item => item.id.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.productsContainer}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onEndReached={loadMoreProducts}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ProductsScreen; 