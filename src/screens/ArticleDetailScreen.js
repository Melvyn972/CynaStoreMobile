import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { articleService, cartService } from '../services';

const { width } = Dimensions.get('window');

const ArticleDetailScreen = ({ route, navigation }) => {
  const { theme, mode } = useTheme();
  const { isAuthenticated } = useAuth();
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
      setArticle(response.article);
    } catch (error) {
      console.error('Error loading article:', error);
      Alert.alert('Erreur', 'Impossible de charger l\'article', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!article) return;

    if (!isAuthenticated) {
      Alert.alert(
        'Connexion requise',
        'Vous devez vous connecter pour ajouter des articles au panier.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    try {
      setAddingToCart(true);
      await cartService.addToCart(article.id, 1);
      Alert.alert('Succès', 'Article ajouté au panier !');
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter l\'article au panier');
    } finally {
      setAddingToCart(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base100,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.base100,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: theme.neutralContent,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.base100,
    },
    errorText: {
      fontSize: 18,
      color: theme.neutralContent,
      marginBottom: 20,
      textAlign: 'center',
    },
    headerSection: {
      position: 'relative',
    },
    backButton: {
      position: 'absolute',
      top: 60,
      left: 24,
      zIndex: 10,
      backgroundColor: theme.base100 + 'CC',
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    articleImage: {
      width: width,
      height: width * 0.6,
      backgroundColor: theme.neutral + '20',
    },
    contentContainer: {
      paddingHorizontal: 24,
      paddingVertical: 20,
    },
    categoryBadge: {
      alignSelf: 'flex-start',
      backgroundColor: theme.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginBottom: 16,
    },
    categoryText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.primary,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 16,
      lineHeight: 36,
    },
    meta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.neutral + '40',
    },
    authorSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    authorAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    authorName: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.baseContent,
    },
    date: {
      fontSize: 14,
      color: theme.neutralContent,
    },
    description: {
      fontSize: 16,
      color: theme.neutralContent,
      lineHeight: 24,
      marginBottom: 24,
    },
    content: {
      marginBottom: 24,
    },
    contentTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 16,
    },
    contentText: {
      fontSize: 16,
      lineHeight: 26,
      color: theme.baseContent,
      textAlign: 'justify',
    },
    priceSection: {
      backgroundColor: theme.base200,
      borderRadius: theme.borderRadius.xl,
      padding: 20,
      marginBottom: 24,
    },
    priceLabel: {
      fontSize: 14,
      color: theme.neutralContent,
      marginBottom: 8,
    },
    price: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.primary,
    },
    priceSubtext: {
      fontSize: 14,
      color: theme.neutralContent,
      marginTop: 4,
    },
    actionsSection: {
      paddingHorizontal: 24,
      paddingVertical: 20,
      borderTopWidth: 1,
      borderTopColor: theme.neutral + '40',
    },
    addToCartButton: {
      backgroundColor: theme.primary,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: 16,
      paddingHorizontal: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    addToCartButtonDisabled: {
      backgroundColor: theme.neutral,
    },
    buttonIcon: {
      marginRight: 8,
    },
    addToCartText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.primaryContent,
    },
    shareButton: {
      backgroundColor: theme.base200,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: 12,
      paddingHorizontal: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.neutral,
    },
    shareText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.baseContent,
    },
    button: {
      backgroundColor: theme.primary,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.primaryContent,
      textAlign: 'center',
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Chargement de l'article...</Text>
      </View>
    );
  }

  if (!article) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="document-outline" size={64} color={theme.neutralContent} />
        <Text style={styles.errorText}>Article introuvable</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.baseContent} />
          </TouchableOpacity>
          
          <Image 
            source={{ uri: article.image || 'https://via.placeholder.com/400x240' }} 
            style={styles.articleImage}
            defaultSource={{ uri: 'https://via.placeholder.com/400x240' }}
          />
        </View>

        <View style={styles.contentContainer}>
          {article.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{article.category}</Text>
            </View>
          )}

          <Text style={styles.title}>{article.title}</Text>

          <View style={styles.meta}>
            <View style={styles.authorSection}>
              <View style={styles.authorAvatar}>
                <Ionicons name="person" size={16} color={theme.primary} />
              </View>
              <Text style={styles.authorName}>
                {article.author?.name || 'Auteur inconnu'}
              </Text>
            </View>
            <Text style={styles.date}>
              {formatDate(article.createdAt)}
            </Text>
          </View>

          {article.description && (
            <Text style={styles.description}>{article.description}</Text>
          )}

          <View style={styles.content}>
            <Text style={styles.contentTitle}>Contenu</Text>
            <Text style={styles.contentText}>{article.content}</Text>
          </View>

          {article.price && (
            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>Prix</Text>
              <Text style={styles.price}>{article.price.toFixed(2)} €</Text>
              <Text style={styles.priceSubtext}>TVA incluse</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            addingToCart && styles.addToCartButtonDisabled
          ]}
          onPress={handleAddToCart}
          disabled={addingToCart}
        >
          {addingToCart ? (
            <ActivityIndicator size="small" color={theme.primaryContent} />
          ) : (
            <>
              <Ionicons 
                name="cart" 
                size={20} 
                color={theme.primaryContent} 
                style={styles.buttonIcon} 
              />
              <Text style={styles.addToCartText}>
                Ajouter au panier
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => {
            Alert.alert('Partager', 'Fonctionnalité de partage bientôt disponible !');
          }}
        >
          <Ionicons 
            name="share-outline" 
            size={20} 
            color={theme.baseContent} 
            style={styles.buttonIcon} 
          />
          <Text style={styles.shareText}>Partager</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ArticleDetailScreen; 