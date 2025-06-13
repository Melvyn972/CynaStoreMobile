import React, { useState } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { cartService } from '../services';

const { width } = Dimensions.get('window');

const features = [
  'Paiement sécurisé',
  'Livraison rapide',
  'Retour facile',
  'Support 24/7',
];

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { theme, mode } = useTheme();
  const { isAuthenticated } = useAuth();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

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
      await cartService.addToCart(product.id, 1);
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

  const styles = StyleSheet.create({
    imageContainer: {
      width: width,
      height: width * 0.6,
      backgroundColor: theme.base200,
      elevation: 2,
      marginBottom: 0,
    },
    productImage: {
      width: '100%',
      height: '100%',
    },
    productImageOverlay: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 0,
    },
    backButton: {
      position: 'absolute',
      top: 50,
      left: 24,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.base100 + 'CC',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    infoContainer: {
      padding: 24,
      backgroundColor: theme.base100,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      marginTop: -24,
      elevation: 4,
      shadowColor: theme.primary,
      shadowOpacity: 0.10,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
    name: {
      fontSize: 26,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 8,
    },
    price: {
      fontSize: 22,
      color: theme.primary,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    desc: {
      fontSize: 16,
      color: theme.neutralContent,
      marginBottom: 18,
      lineHeight: 22,
    },
    featuresRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 18,
    },
    featureCard: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: theme.primary + '20',
      borderRadius: 12,
      marginHorizontal: 4,
      paddingVertical: 10,
      paddingHorizontal: 2,
    },
    featureText: {
      fontSize: 13,
      color: theme.baseContent,
      textAlign: 'center',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
    },
    addToCartBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary,
      borderRadius: 10,
      paddingVertical: 16,
      paddingHorizontal: 32,
      justifyContent: 'center',
      opacity: isAddingToCart ? 0.7 : 1,
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
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image || 'https://picsum.photos/400/300' }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["rgba(91,33,182,0.4)", "rgba(255,255,255,0)"]}
            style={styles.productImageOverlay}
          />
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.baseContent} />
          </TouchableOpacity>
        </View>
        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{product.title || product.name}</Text>
          <Text style={styles.price}>€{(product.price || 0).toFixed(2)}</Text>
          <Text style={styles.desc}>{product.description || 'Aucune description disponible'}</Text>
          {/* Features */}
          <View style={styles.featuresRow}>
            {features.map((f, i) => (
              <View key={f} style={styles.featureCard}>
                <Ionicons
                  name={i === 0 ? 'shield-checkmark' : i === 1 ? 'rocket-outline' : i === 2 ? 'return-down-back' : 'headset'}
                  size={22}
                  color={i % 2 === 0 ? '#a78bfa' : '#6366f1'}
                  style={{ marginBottom: 4 }}
                />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>
          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.addToCartBtn}
              onPress={addToCart}
              disabled={isAddingToCart}
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