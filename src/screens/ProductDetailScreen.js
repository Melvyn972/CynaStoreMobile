import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const features = [
  'Paiement sécurisé',
  'Livraison rapide',
  'Retour facile',
  'Support 24/7',
];

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { isDarkMode } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#10111a' : '#f8f8ff' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["rgba(91,33,182,0.4)", "rgba(255,255,255,0)"]}
            style={styles.productImageOverlay}
          />
        </View>
        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>€{product.price.toFixed(2)}</Text>
          <Text style={styles.desc}>{product.description}</Text>
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
            <TouchableOpacity style={styles.addToCartBtn}>
              <Ionicons name="cart-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.addToCartText}>Ajouter au panier</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buyNowBtn}>
              <Ionicons name="flash" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buyNowText}>Acheter maintenant</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: width,
    height: width * 0.6,
    backgroundColor: '#fff',
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
  infoContainer: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    elevation: 4,
    shadowColor: '#a78bfa',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#23234b',
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    color: '#7c3aed',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  desc: {
    fontSize: 16,
    color: '#6b7280',
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
    backgroundColor: 'rgba(167,139,250,0.08)',
    borderRadius: 12,
    marginHorizontal: 4,
    paddingVertical: 10,
    paddingHorizontal: 2,
  },
  featureText: {
    fontSize: 13,
    color: '#23234b',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a78bfa',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginRight: 8,
    justifyContent: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  buyNowBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginLeft: 8,
    justifyContent: 'center',
  },
  buyNowText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default ProductDetailScreen; 