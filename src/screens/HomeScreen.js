import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { articleService, contentService, categoryService } from '../services';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');



const HomeScreen = ({ navigation }) => {
  const { theme, mode } = useTheme();
  const { isAuthenticated } = useAuth();
  const scrollViewRef = useRef(null);
  
  // État pour toutes les données de la page d'accueil
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [contentBlocks, setContentBlocks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    loadAllContent();
  }, []);

  useEffect(() => {
    if (carouselSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [carouselSlides.length]);

  const loadAllContent = async () => {
    try {
      setLoading(true);
      const [slidesData, categoriesData, contentData, articlesData] = await Promise.all([
        contentService.getCarouselSlides().catch(() => []),
        categoryService.getCategories().catch(() => []),
        contentService.getContentBlocks('homepage').catch(() => []),
        articleService.getArticles(1, 6).catch(() => ({ articles: [] }))
      ]);
      
      setCarouselSlides(slidesData || []);
      setCategories(categoriesData || []);
      setContentBlocks(contentData || []);
      setFeaturedArticles(articlesData.articles || []);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllContent();
    setRefreshing(false);
  };

  const handleStartShopping = () => {
    navigation.navigate('Products');
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('Products', { category: category.name });
  };

  const handleArticlePress = (article) => {
    navigation.navigate('ProductDetail', { product: article });
  };

  const renderCarouselSlide = (slide, index) => (
    <View key={slide.id} style={[styles.slide, { width }]}>
      <Image source={{ uri: slide.image }} style={styles.slideImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.slideOverlay}
      />
      <View style={styles.slideContent}>
        {slide.subtitle && (
          <View style={styles.slideBadge}>
            <View style={styles.slideBadgeDot} />
            <Text style={styles.slideBadgeText}>{slide.subtitle}</Text>
          </View>
        )}
        <Text style={styles.slideTitle}>{slide.title}</Text>
        {slide.description && (
          <Text style={styles.slideDescription}>{slide.description}</Text>
        )}
        {slide.buttonText && slide.buttonLink && (
          <TouchableOpacity style={styles.slideButton} onPress={handleStartShopping}>
            <Text style={styles.slideButtonText}>{slide.buttonText}</Text>
            <Ionicons name="arrow-forward" size={16} color={theme.primaryContent} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderDefaultHero = () => (
    <View style={[styles.slide, { width }]}>
      <LinearGradient
        colors={[theme.primary + '20', theme.secondary + '20']}
        style={styles.slideImage}
      />
      <View style={styles.slideContent}>
        <View style={styles.slideBadge}>
          <View style={styles.slideBadgeDot} />
          <Text style={styles.slideBadgeText}>✨ Découvrez une nouvelle façon de créer</Text>
        </View>
        <Text style={styles.slideTitle}>
          Élevez votre vision{'\n'}
          <Text style={[styles.slideTitle, { color: theme.primary }]}>
            en réalité digitale
          </Text>
        </Text>
        <Text style={styles.slideDescription}>
          Transformez vos idées en expériences numériques exceptionnelles avec notre plateforme de cybersécurité avancée.
        </Text>
        <TouchableOpacity style={styles.slideButton} onPress={handleStartShopping}>
          <Text style={styles.slideButtonText}>Commencer</Text>
          <Ionicons name="arrow-forward" size={16} color={theme.primaryContent} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCarousel = () => (
    <View style={styles.carouselContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentSlide(slideIndex);
        }}
        style={styles.carousel}
      >
        {carouselSlides.length > 0 
          ? carouselSlides.map(renderCarouselSlide)
          : renderDefaultHero()
        }
      </ScrollView>
      
      {carouselSlides.length > 1 && (
        <View style={styles.carouselIndicators}>
          {carouselSlides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.carouselIndicator,
                index === currentSlide && styles.carouselIndicatorActive
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );

  const renderCategories = () => {
    if (!categories.length) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Découvrez nos <Text style={{ color: theme.primary }}>catégories</Text>
          </Text>
          <Text style={styles.sectionDescription}>
            Explorez notre large gamme de produits et services organisés par catégories pour trouver exactement ce que vous cherchez.
          </Text>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(category)}
            >
              <View style={styles.categoryImageContainer}>
                {category.image ? (
                  <Image source={{ uri: category.image }} style={styles.categoryImage} />
                ) : (
                  <View style={[styles.categoryImage, styles.categoryImagePlaceholder]}>
                    <Text style={styles.categoryImagePlaceholderText}>
                      {category.name.charAt(0)}
                    </Text>
                  </View>
                )}
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>
                    {category._count.articles} article{category._count.articles > 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <View style={styles.categoryAction}>
                <Text style={styles.categoryActionText}>Explorer</Text>
                <Ionicons name="arrow-forward" size={14} color={theme.primary} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <TouchableOpacity style={styles.viewAllButton} onPress={() => navigation.navigate('Products')}>
          <Ionicons name="grid-outline" size={20} color={theme.primaryContent} />
          <Text style={styles.viewAllButtonText}>Voir tous les produits</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContentBlocks = () => {
    if (!contentBlocks.length) return null;

    return contentBlocks.map((block, index) => {
      switch (block.blockType) {
        case 'text':
          return (
            <View key={block.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{block.title}</Text>
              <Text style={styles.sectionText}>{block.content}</Text>
            </View>
          );
        
        case 'text_image':
          return (
            <View key={block.id} style={styles.section}>
              <View style={[styles.textImageBlock, index % 2 === 1 && styles.textImageBlockReverse]}>
                <View style={styles.textImageContent}>
                  <Text style={styles.sectionTitle}>{block.title}</Text>
                  <Text style={styles.sectionText}>{block.content}</Text>
                </View>
                {block.image && (
                  <View style={styles.textImageImageContainer}>
                    <Image source={{ uri: block.image }} style={styles.textImageImage} />
                  </View>
                )}
              </View>
            </View>
          );

        case 'testimonial':
          return (
            <View key={block.id} style={[styles.section, styles.testimonialSection]}>
              <Text style={styles.sectionTitle}>{block.title}</Text>
              <View style={styles.testimonialCard}>
                <View style={styles.testimonialQuoteIcon}>
                  <Ionicons name="chatbubble-outline" size={24} color={theme.primary} />
                </View>
                <Text style={styles.testimonialText}>{block.content}</Text>
                {block.author && (
                  <View style={styles.testimonialAuthor}>
                    <Text style={styles.testimonialAuthorName}>— {block.author}</Text>
                  </View>
                )}
              </View>
            </View>
          );
        
        default:
          return null;
      }
    });
  };

  const renderFeaturedArticles = () => {
    if (!featuredArticles.length) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Articles Récents</Text>
        <View style={styles.articlesGrid}>
          {featuredArticles.map((article) => (
    <TouchableOpacity
      key={article.id}
              style={styles.articleCard}
      onPress={() => handleArticlePress(article)}
    >
      <Image 
        source={{ uri: article.image || 'https://picsum.photos/150/150' }} 
                style={styles.articleImage}
      />
              <View style={styles.articleContent}>
                <Text style={styles.articleTitle} numberOfLines={2}>
          {article.title}
        </Text>
                <Text style={styles.articleDescription} numberOfLines={3}>
                  {article.description}
        </Text>
                <View style={styles.articleFooter}>
                  <Text style={styles.articlePrice}>
            {article.price ? `${article.price.toFixed(2)} €` : 'Gratuit'}
          </Text>
                  <Ionicons name="arrow-forward" size={16} color={theme.primary} />
        </View>
      </View>
    </TouchableOpacity>
          ))}
        </View>
      </View>
  );
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
    // Carousel Styles
    carouselContainer: {
      height: 500,
      position: 'relative',
    },
    carousel: {
      flex: 1,
    },
    slide: {
      height: 500,
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
    },
    slideImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    slideOverlay: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    slideContent: {
      position: 'absolute',
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: 24,
      zIndex: 10,
    },
    slideBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 20,
      marginBottom: 24,
    },
    slideBadgeDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.primary,
      marginRight: 8,
    },
    slideBadgeText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '500',
    },
    slideTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: 36,
    },
    slideDescription: {
      fontSize: 16,
      color: 'rgba(255,255,255,0.9)',
      textAlign: 'center',
      marginBottom: 32,
      lineHeight: 24,
    },
    slideButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: theme.borderRadius.xl,
      flexDirection: 'row',
      alignItems: 'center',
    },
    slideButtonText: {
      color: theme.primaryContent,
      fontSize: 16,
      fontWeight: '600',
      marginRight: 8,
    },
    carouselIndicators: {
      position: 'absolute',
      bottom: 20,
      flexDirection: 'row',
      alignSelf: 'center',
    },
    carouselIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255,255,255,0.5)',
      marginHorizontal: 4,
    },
    carouselIndicatorActive: {
      backgroundColor: 'white',
    },
    // Section Styles
    section: {
      paddingHorizontal: 24,
      paddingVertical: 40,
    },
    sectionHeader: {
      marginBottom: 32,
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.baseContent,
      textAlign: 'center',
      marginBottom: 16,
    },
    sectionDescription: {
      fontSize: 16,
      color: theme.neutralContent,
      textAlign: 'center',
      lineHeight: 24,
    },
    sectionText: {
      fontSize: 16,
      color: theme.neutralContent,
      lineHeight: 24,
      textAlign: 'center',
    },
    // Categories Styles
    categoriesContainer: {
      paddingHorizontal: 8,
    },
    categoryCard: {
      width: 160,
      marginRight: 16,
      backgroundColor: theme.base200,
      borderRadius: theme.borderRadius.xl,
      padding: 16,
    },
    categoryImageContainer: {
      position: 'relative',
      marginBottom: 12,
    },
    categoryImage: {
      width: '100%',
      height: 100,
      borderRadius: theme.borderRadius.lg,
      resizeMode: 'cover',
    },
    categoryImagePlaceholder: {
      backgroundColor: theme.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
    },
    categoryImagePlaceholderText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.primary,
    },
    categoryBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'rgba(255,255,255,0.9)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    categoryBadgeText: {
      fontSize: 10,
      fontWeight: '600',
      color: theme.baseContent,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.baseContent,
      marginBottom: 8,
    },
    categoryAction: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryActionText: {
      fontSize: 14,
      color: theme.primary,
      marginRight: 4,
    },
    viewAllButton: {
      backgroundColor: theme.primary,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: 16,
      paddingHorizontal: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 24,
    },
    viewAllButtonText: {
      color: theme.primaryContent,
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    // Text Image Block Styles
    textImageBlock: {
      flexDirection: 'column',
      gap: 24,
    },
    textImageBlockReverse: {
      flexDirection: 'column-reverse',
    },
    textImageContent: {
      flex: 1,
    },
    textImageImageContainer: {
      flex: 1,
    },
    textImageImage: {
      width: '100%',
      height: 200,
      borderRadius: theme.borderRadius.xl,
      resizeMode: 'cover',
    },
    // Testimonial Styles
    testimonialSection: {
      backgroundColor: theme.base200,
    },
    testimonialCard: {
      backgroundColor: theme.base100,
      borderRadius: theme.borderRadius.xl,
      padding: 24,
      borderWidth: 1,
      borderColor: theme.neutral,
      position: 'relative',
    },
    testimonialQuoteIcon: {
      position: 'absolute',
      top: 16,
      right: 16,
      opacity: 0.3,
    },
    testimonialText: {
      fontSize: 16,
      color: theme.baseContent,
      lineHeight: 24,
      fontStyle: 'italic',
      marginBottom: 16,
    },
    testimonialAuthor: {
      alignItems: 'flex-end',
    },
    testimonialAuthorName: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: '600',
    },
    // Articles Styles
    articlesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    articleCard: {
      width: '48%',
      backgroundColor: theme.base200,
      borderRadius: theme.borderRadius.xl,
      marginBottom: 16,
      overflow: 'hidden',
    },
    articleImage: {
      width: '100%',
      height: 120,
      resizeMode: 'cover',
    },
    articleContent: {
      padding: 12,
    },
    articleTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 8,
    },
    articleDescription: {
      fontSize: 12,
      color: theme.neutralContent,
      lineHeight: 16,
      marginBottom: 12,
    },
    articleFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    articlePrice: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.primary,
      },
    });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderCarousel()}
        {renderCategories()}
        {renderContentBlocks()}
        {renderFeaturedArticles()}
      </ScrollView>
    </View>
  );
};

export default HomeScreen; 