import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { cartService } from '../services';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { theme, mode } = useTheme();
  const { isAuthenticated } = useAuth();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const carouselRef = useRef(null);

  // Récupérer les vraies images du produit depuis l'API
  const getProductImages = () => {
    const images = [];
    
    // Ajouter l'image principale si elle existe
    if (product.image) {
      images.push(product.image);
    }
    
    // Ajouter les images du carrousel si elles existent
    if (product.images) {
      try {
        const carouselImages = typeof product.images === 'string' 
          ? JSON.parse(product.images) 
          : product.images;
        
        if (Array.isArray(carouselImages)) {
          carouselImages.forEach(img => {
            if (img.url && !images.includes(img.url)) {
              images.push(img.url);
            }
          });
        }
      } catch (error) {
        console.error('Error parsing product images:', error);
      }
    }
    
    // Si aucune image n'est trouvée, utiliser une image par défaut
    return images.length > 0 ? images : ['https://picsum.photos/400/300'];
  };

  const productImages = getProductImages();

  // Informations sur les notes (simulé)
  const rating = 4.9;
  const reviewCount = 12;

  const handleThumbnailPress = (index) => {
    if (productImages.length > 1) {
      setCurrentImageIndex(index);
      carouselRef.current?.scrollToIndex({ index, animated: true });
    }
  };

  const handleQuantityChange = (increment) => {
    const newQuantity = quantity + increment;
    if (newQuantity >= 1 && newQuantity <= (product.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const addToCart = async () => {
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

    setIsAddingToCart(true);
    try {
      await cartService.addToCart(product.id, quantity);
      Alert.alert(
        '✅ Ajouté au panier',
        `${product.title || product.name} a été ajouté à votre panier.`,
        [
          { text: 'Continuer les achats', style: 'cancel' },
          { text: 'Voir le panier', onPress: () => navigation.navigate('Cart') }
        ]
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter l\'article au panier. Veuillez réessayer.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const renderImageCarousel = () => (
    <View style={styles.carouselContainer}>
      {productImages.length > 1 && (
        <View style={styles.imageCounter}>
          <Text style={styles.imageCounterText}>
            {currentImageIndex + 1} / {productImages.length}
          </Text>
        </View>
      )}

      <FlatList
        ref={carouselRef}
        data={productImages}
        horizontal
        pagingEnabled={productImages.length > 1}
        scrollEnabled={productImages.length > 1}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        onMomentumScrollEnd={(event) => {
          if (productImages.length > 1) {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(index);
          }
        }}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={styles.carouselImage}
            resizeMode="cover"
          />
        )}
      />

      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={theme.baseContent} />
      </TouchableOpacity>
    </View>
  );

  const renderThumbnails = () => {
    // Ne pas afficher la section miniatures s'il n'y a qu'une seule image
    if (productImages.length <= 1) {
      return null;
    }

    return (
      <View style={styles.thumbnailContainer}>
        <Text style={styles.thumbnailTitle}>Images disponibles</Text>
        <Text style={styles.thumbnailCount}>{productImages.length}</Text>
        <Text style={styles.thumbnailSubtitle}>Cliquez sur les miniatures pour naviguer</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailScroll}>
          {productImages.map((image, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.thumbnail,
                currentImageIndex === index && styles.thumbnailActive
              ]}
              onPress={() => handleThumbnailPress(index)}
            >
              <Image source={{ uri: image }} style={styles.thumbnailImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderRating = () => (
    <View style={styles.ratingContainer}>
      <View style={styles.ratingStars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name="star"
            size={16}
            color={star <= Math.floor(rating) ? '#FFD700' : theme.neutral}
          />
        ))}
        <Text style={styles.ratingText}>{rating}/5</Text>
      </View>
      <Text style={styles.reviewCount}>· {reviewCount} avis</Text>
    </View>
  );

  const renderSpecifications = () => (
    <View style={styles.specContainer}>
      <Text style={styles.specTitle}>Spécifications</Text>
      
      {/* Disponibilité */}
      <View style={styles.specRow}>
        <Text style={styles.specLabel}>Disponibilité</Text>
        <View style={styles.stockInfo}>
          <View style={[styles.stockDot, { backgroundColor: (product.stock || 0) > 0 ? theme.success : theme.error }]} />
          <Text style={[styles.specValue, { color: (product.stock || 0) > 0 ? theme.success : theme.error }]}>
            {(product.stock || 0) > 0 ? `En stock (${product.stock} unités)` : 'Rupture de stock'}
          </Text>
        </View>
      </View>

      {/* Catégorie */}
      {(product.categoryObj?.name || product.category) && (
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Catégorie</Text>
          <Text style={styles.specValue}>{product.categoryObj?.name || product.category}</Text>
        </View>
      )}

      {/* Durée */}
      {product.subscriptionDuration && (
        <View style={styles.specRow}>
          <Text style={styles.specLabel}>Durée</Text>
          <Text style={styles.specValue}>{product.subscriptionDuration}</Text>
        </View>
      )}

      {/* Livraison */}
      <View style={styles.specRow}>
        <Text style={styles.specLabel}>Livraison</Text>
        <Text style={styles.specValue}>2-4 jours ouvrables</Text>
      </View>

      {/* Spécifications techniques */}
      {product.specifications && product.specifications.length > 0 && (
        <>
          <Text style={styles.techSpecTitle}>Caractéristiques techniques</Text>
          <View style={styles.techSpecContainer}>
            {product.specifications.map((spec, index) => (
              <View key={index} style={styles.techSpecItem}>
                <Text style={styles.techSpecText}>
                  {spec.technicalSpecification?.name || spec.name}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );

  const styles = StyleSheet.create({
    // Carrousel d'images
    carouselContainer: {
      height: width * 0.7,
      backgroundColor: theme.base200,
      position: 'relative',
    },
    carouselImage: {
      width: width,
      height: width * 0.7,
    },
    imageCounter: {
      position: 'absolute',
      top: 16,
      right: 16,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      zIndex: 1,
    },
    imageCounterText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
    },
    backButton: {
      position: 'absolute',
      top: 50,
      left: 16,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      zIndex: 1,
    },

    // Miniatures
    thumbnailContainer: {
      backgroundColor: theme.base100,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.neutral,
    },
    thumbnailTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 4,
    },
    thumbnailCount: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: 4,
    },
    thumbnailSubtitle: {
      fontSize: 14,
      color: theme.neutralContent,
      marginBottom: 12,
    },
    thumbnailScroll: {
      marginHorizontal: -16,
      paddingHorizontal: 16,
    },
    thumbnail: {
      width: 60,
      height: 60,
      marginRight: 8,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    thumbnailActive: {
      borderColor: theme.primary,
    },
    thumbnailImage: {
      width: '100%',
      height: '100%',
      borderRadius: 6,
    },

    // Informations produit
    productInfo: {
      padding: 16,
      backgroundColor: theme.base100,
    },
    brandName: {
      fontSize: 16,
      color: theme.primary,
      fontWeight: '600',
      marginBottom: 4,
    },
    productTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 8,
      lineHeight: 26,
    },

    // Rating
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    ratingStars: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      fontSize: 14,
      color: theme.baseContent,
      fontWeight: '600',
      marginLeft: 4,
    },
    reviewCount: {
      fontSize: 14,
      color: theme.neutralContent,
      marginLeft: 4,
    },

    // Description
    descriptionContainer: {
      marginBottom: 20,
    },
    descriptionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 8,
    },
    description: {
      fontSize: 16,
      color: theme.neutralContent,
      lineHeight: 22,
    },

    // Spécifications
    specContainer: {
      marginBottom: 20,
    },
    specTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 12,
    },
    specRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.neutral + '40',
    },
    specLabel: {
      fontSize: 16,
      color: theme.neutralContent,
    },
    specValue: {
      fontSize: 16,
      color: theme.baseContent,
      fontWeight: '500',
    },
    stockInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    stockDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    techSpecTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.baseContent,
      marginTop: 12,
      marginBottom: 8,
    },
    techSpecContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    techSpecItem: {
      backgroundColor: theme.base200,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
    },
    techSpecText: {
      fontSize: 14,
      color: theme.baseContent,
    },

    // Prix
    priceContainer: {
      marginBottom: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.neutral + '40',
    },
    priceTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 8,
    },
    price: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: 4,
    },
    priceNote: {
      fontSize: 14,
      color: theme.success,
      marginBottom: 2,
    },
    deliveryNote: {
      fontSize: 14,
      color: theme.success,
    },

    // Section panier
    cartSection: {
      marginTop: 20,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      backgroundColor: theme.base200,
      borderRadius: 8,
      padding: 4,
      alignSelf: 'center',
    },
    quantityButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.base100,
      borderRadius: 6,
    },
    quantityText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginHorizontal: 20,
      minWidth: 30,
      textAlign: 'center',
    },
    addToCartBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 32,
      justifyContent: 'center',
    },
    addToCartText: {
      color: theme.primaryContent,
      fontWeight: 'bold',
      fontSize: 16,
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.base100 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Carrousel d'images */}
        {renderImageCarousel()}
        
        {/* Miniatures */}
        {renderThumbnails()}

        {/* Informations produit */}
        <View style={styles.productInfo}>
          {/* Marque/Catégorie */}
          {(product.categoryObj?.name || product.category) && (
            <Text style={styles.brandName}>{product.categoryObj?.name || product.category}</Text>
          )}
          
          {/* Titre */}
          <Text style={styles.productTitle}>{product.title || product.name || 'Produit sans nom'}</Text>
          
          {/* Note */}
          {renderRating()}

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.description}>
              {product.description || 'Aucune description disponible pour ce produit.'}
            </Text>
          </View>

          {/* Spécifications */}
          {renderSpecifications()}

          {/* Prix */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceTitle}>Prix</Text>
            <Text style={styles.price}>{(product.price || 0).toFixed(2)} €</Text>
            <Text style={styles.priceNote}>Économies</Text>
            <Text style={styles.deliveryNote}>Livraison gratuite</Text>
          </View>

          {/* Quantité et Panier */}
          <View style={styles.cartSection}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Ionicons name="remove" size={20} color={theme.baseContent} />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{quantity}</Text>
              
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(1)}
                disabled={quantity >= (product.stock || 1)}
              >
                <Ionicons name="add" size={20} color={theme.baseContent} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.addToCartBtn, { opacity: isAddingToCart || (product.stock || 0) === 0 ? 0.5 : 1 }]}
              onPress={addToCart}
              disabled={isAddingToCart || (product.stock || 0) === 0}
            >
              {isAddingToCart ? (
                <ActivityIndicator size="small" color={theme.primaryContent} />
              ) : (
                <Ionicons name="cart-outline" size={20} color={theme.primaryContent} style={{ marginRight: 8 }} />
              )}
              <Text style={styles.addToCartText}>
                {isAddingToCart ? 'Ajout en cours...' : 'Ajouter au panier'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetailScreen;