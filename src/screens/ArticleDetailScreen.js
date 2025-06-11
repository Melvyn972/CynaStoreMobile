import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { articleService } from '../services/articleService';
import { cartService } from '../services/cartService';

const ArticleDetailScreen = ({ route, navigation }) => {
  const { articleId } = route.params;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadArticle();
  }, [articleId]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const response = await articleService.getArticle(articleId);
      setArticle(response);
    } catch (error) {
      console.error('Error loading article:', error);
      Alert.alert('Error', 'Failed to load article', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!article) return;

    try {
      setAddingToCart(true);
      await cartService.addToCart(article.id);
      Alert.alert('Success', 'Article added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add article to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading article...</Text>
      </View>
    );
  }

  if (!article) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Article not found</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{article.title}</Text>
        <View style={styles.meta}>
          <Text style={styles.author}>By {article.author?.name}</Text>
          <Text style={styles.date}>
            {new Date(article.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.articleText}>{article.content}</Text>
      </View>

      {article.price && (
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Price:</Text>
          <Text style={styles.price}>${article.price}</Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.addToCartButton, addingToCart && styles.buttonDisabled]}
          onPress={handleAddToCart}
          disabled={addingToCart}
        >
          <Ionicons 
            name="cart" 
            size={20} 
            color="#fff" 
            style={styles.buttonIcon} 
          />
          <Text style={styles.addToCartText}>
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => {
            // You can implement sharing functionality here
            Alert.alert('Share', 'Sharing functionality coming soon!');
          }}
        >
          <Ionicons 
            name="share-outline" 
            size={20} 
            color="#007AFF" 
            style={styles.buttonIcon} 
          />
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    lineHeight: 30,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    padding: 20,
  },
  articleText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 20,
    borderRadius: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  actions: {
    padding: 20,
    gap: 10,
  },
  addToCartButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  shareButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  shareText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ArticleDetailScreen; 