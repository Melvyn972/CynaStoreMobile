import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
  Modal,
  ScrollView,
  Image,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { articleService, categoryService, specificationService, contentService } from '../services';
import { useTheme } from '../context/ThemeContext';

const ArticlesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSpecs, setSelectedSpecs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [exactMatch, setExactMatch] = useState(false);
  const [sortBy, setSortBy] = useState('name-asc');
  const [totalProducts, setTotalProducts] = useState(0);
  
  // États pour le carrousel
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    loadArticles();
    loadFilters();
    loadCarousel();
  }, []);

  useEffect(() => {
    if (carouselSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % carouselSlides.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [carouselSlides]);

  const loadCarousel = async () => {
    try {
      const slides = await contentService.getCarouselSlides();
      setCarouselSlides(slides || []);
    } catch (error) {
      console.error('Error loading carousel:', error);
    }
  };

  const loadFilters = async () => {
    try {
      const [categoriesData, specificationsData] = await Promise.all([
        categoryService.getCategories().catch(() => []),
        specificationService.getSpecifications().catch(() => [])
      ]);
      setCategories(categoriesData || []);
      setSpecifications(specificationsData || []);
    } catch (error) {
      console.error('Error loading filters:', error);
    }
  };

  const loadArticles = async (isRefresh = false) => {
    if (loading) return;

    try {
      setLoading(true);
      const currentPage = isRefresh ? 1 : page;
      
      let response;
      if (searchQuery.trim()) {
        response = await articleService.searchArticles(searchQuery, currentPage);
      } else {
        const specIds = selectedSpecs.length > 0 ? selectedSpecs.join(',') : null;
        response = await articleService.getArticles(
          currentPage, 
          10, 
          selectedCategory, 
          null, 
          specIds
        );
      }

      const newArticles = response.articles || [];
      
      if (isRefresh) {
        setArticles(newArticles);
        setPage(2);
      } else {
        setArticles(prev => [...prev, ...newArticles]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(newArticles.length === 10); // Assuming 10 items per page
    } catch (error) {
      console.error('Error loading articles:', error);
      Alert.alert('Error', 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await Promise.all([
      loadArticles(true),
      loadCarousel()
    ]);
    setRefreshing(false);
  }, [searchQuery]);

  const handleSearch = useCallback(async () => {
    setPage(1);
    setArticles([]);
    await loadArticles(true);
  }, [searchQuery]);

  const renderArticleItem = ({ item }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.articleImage} />
      )}
      <View style={styles.articleContent}>
        <View style={styles.articleHeader}>
          <Text style={styles.articleTitle} numberOfLines={2}>
            {item.title}
          </Text>
          {item.categoryObj && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{item.categoryObj.name}</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.articleDescription} numberOfLines={3}>
          {item.description}
        </Text>

        {item.specifications && item.specifications.length > 0 && (
          <View style={styles.specificationsContainer}>
            {item.specifications.slice(0, 2).map((spec, index) => (
              <View key={index} style={styles.specificationChip}>
                <Text style={styles.specificationText}>
                  {spec.technicalSpecification.name}
                </Text>
              </View>
            ))}
            {item.specifications.length > 2 && (
              <View style={styles.specificationChip}>
                <Text style={styles.specificationText}>
                  +{item.specifications.length - 2}
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.articleFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.articlePrice}>
              {item.price ? `${item.price.toFixed(2)} €` : 'Gratuit'}
            </Text>
            {item.subscriptionDuration && (
              <Text style={styles.subscriptionDuration}>
                {item.subscriptionDuration}
              </Text>
            )}
          </View>
          
          <View style={styles.stockContainer}>
            <View style={[styles.stockIndicator, { 
              backgroundColor: item.stock > 0 ? theme.success : theme.error 
            }]} />
            <Text style={[styles.stockText, { 
              color: item.stock > 0 ? theme.success : theme.error 
            }]}>
              {item.stock > 0 ? `${item.stock} en stock` : 'Rupture de stock'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>Voir</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderCarousel = () => {
    if (carouselSlides.length === 0) return null;

    return (
      <View style={styles.carouselContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const slideIndex = Math.round(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
            setCurrentSlide(slideIndex);
          }}
          contentOffset={{ x: currentSlide * 300, y: 0 }}
        >
          {carouselSlides.map((slide, index) => (
            <TouchableOpacity
              key={slide.id}
              style={styles.carouselSlide}
              activeOpacity={0.9}
            >
              {slide.image ? (
                <Image source={{ uri: slide.image }} style={styles.carouselImage} />
              ) : (
                <View style={styles.carouselImagePlaceholder}>
                  <Ionicons name="image-outline" size={40} color={theme.neutralContent} />
                </View>
              )}
              
              <View style={styles.carouselOverlay}>
                <Text style={styles.carouselTitle} numberOfLines={2}>
                  {slide.title}
                </Text>
                {slide.description && (
                  <Text style={styles.carouselDescription} numberOfLines={3}>
                    {slide.description}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {carouselSlides.length > 1 && (
          <View style={styles.carouselDots}>
            {carouselSlides.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.carouselDot,
                  currentSlide === index && styles.carouselDotActive
                ]}
                onPress={() => setCurrentSlide(index)}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingFooter}>
        <Text>Loading more articles...</Text>
      </View>
    );
  };

  const renderFiltersModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.filtersModal}>
        <View style={styles.filtersHeader}>
          <Text style={styles.filtersTitle}>Filtres</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Ionicons name="close" size={24} color={theme.baseContent} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.filtersContent}>
          {/* Categories */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Catégorie</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.categoryFilter, !selectedCategory && styles.categoryFilterActive]}
                onPress={() => setSelectedCategory(null)}
              >
                <Text style={[styles.categoryFilterText, !selectedCategory && styles.categoryFilterTextActive]}>
                  Toutes
                </Text>
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryFilter, selectedCategory === category.name && styles.categoryFilterActive]}
                  onPress={() => setSelectedCategory(category.name)}
                >
                  <Text style={[styles.categoryFilterText, selectedCategory === category.name && styles.categoryFilterTextActive]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Options */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Options</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>En stock uniquement</Text>
              <Switch
                value={inStockOnly}
                onValueChange={setInStockOnly}
                trackColor={{ false: theme.neutral, true: theme.primary }}
                thumbColor={inStockOnly ? theme.primaryContent : theme.baseContent}
              />
            </View>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Correspondance exacte</Text>
              <Switch
                value={exactMatch}
                onValueChange={setExactMatch}
                trackColor={{ false: theme.neutral, true: theme.primary }}
                thumbColor={exactMatch ? theme.primaryContent : theme.baseContent}
              />
            </View>
          </View>

          {/* Specifications */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Spécifications techniques</Text>
            {specifications.map((spec) => (
              <TouchableOpacity
                key={spec.id}
                style={styles.specificationFilter}
                onPress={() => {
                  if (selectedSpecs.includes(spec.id)) {
                    setSelectedSpecs(prev => prev.filter(id => id !== spec.id));
                  } else {
                    setSelectedSpecs(prev => [...prev, spec.id]);
                  }
                }}
              >
                <View style={[styles.checkbox, selectedSpecs.includes(spec.id) && styles.checkboxActive]}>
                  {selectedSpecs.includes(spec.id) && (
                    <Ionicons name="checkmark" size={16} color={theme.primaryContent} />
                  )}
                </View>
                <Text style={styles.specificationFilterText}>{spec.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.filtersFooter}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setSelectedCategory(null);
              setSelectedSpecs([]);
              setInStockOnly(false);
              setExactMatch(false);
            }}
          >
            <Text style={styles.resetButtonText}>Réinitialiser les filtres</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => {
              setShowFilters(false);
              handleSearch();
            }}
          >
            <Text style={styles.applyButtonText}>Appliquer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header with search and filters */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color={theme.neutralContent} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher..."
              placeholderTextColor={theme.neutralContent}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  handleSearch();
                }}
              >
                <Ionicons name="close-circle" size={20} color={theme.neutralContent} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.filtersButton}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="options-outline" size={20} color={theme.primary} />
            <Text style={styles.filtersButtonText}>Filtres</Text>
          </TouchableOpacity>

          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Trier par :</Text>
            <TouchableOpacity style={styles.sortButton}>
              <Text style={styles.sortButtonText}>
                {sortBy === 'name-asc' ? 'Nom A-Z' : 
                 sortBy === 'name-desc' ? 'Nom Z-A' : 
                 sortBy === 'price-asc' ? 'Prix croissant' : 'Prix décroissant'}
              </Text>
              <Ionicons name="chevron-down" size={16} color={theme.baseContent} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {totalProducts || articles.length} produit{(totalProducts || articles.length) > 1 ? 's' : ''} trouvé{(totalProducts || articles.length) > 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {renderCarousel()}

      <FlatList
        data={articles}
        renderItem={renderArticleItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={() => {
          if (hasMore && !loading) {
            loadArticles();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContainer}
        numColumns={1}
      />

      {renderFiltersModal()}
    </View>
  );
};

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base100,
    },
    header: {
      backgroundColor: theme.base100,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.neutral,
    },
    searchContainer: {
      marginBottom: 16,
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.base200,
      borderRadius: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: theme.neutral,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.baseContent,
    },
    controlsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    filtersButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary + '20',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    filtersButtonText: {
      color: theme.primary,
      fontWeight: '600',
      marginLeft: 8,
    },
    sortContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sortLabel: {
      fontSize: 14,
      color: theme.neutralContent,
      marginRight: 8,
    },
    sortButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.base200,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme.neutral,
    },
    sortButtonText: {
      fontSize: 14,
      color: theme.baseContent,
      marginRight: 4,
    },
    resultsContainer: {
      marginBottom: 8,
    },
    resultsText: {
      fontSize: 14,
      color: theme.neutralContent,
      fontWeight: '600',
    },
    listContainer: {
      padding: 16,
    },
    // Carousel Styles
    carouselContainer: {
      height: 200,
      marginBottom: 16,
    },
    carouselSlide: {
      width: 300,
      height: 200,
      marginHorizontal: 8,
      borderRadius: 12,
      overflow: 'hidden',
      position: 'relative',
    },
    carouselImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    carouselImagePlaceholder: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.base300,
      justifyContent: 'center',
      alignItems: 'center',
    },
    carouselOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 16,
    },
    carouselTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 4,
    },
    carouselDescription: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.9)',
      lineHeight: 18,
    },
    carouselDots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 12,
    },
    carouselDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.neutral,
      marginHorizontal: 4,
    },
    carouselDotActive: {
      backgroundColor: theme.primary,
      width: 24,
    },
    articleCard: {
      backgroundColor: theme.base200,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.neutral,
      overflow: 'hidden',
    },
    articleImage: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
    },
    articleContent: {
      padding: 16,
    },
    articleHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    articleTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginRight: 12,
      lineHeight: 24,
    },
    categoryBadge: {
      backgroundColor: theme.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    categoryBadgeText: {
      fontSize: 12,
      color: theme.primary,
      fontWeight: '600',
    },
    articleDescription: {
      fontSize: 14,
      color: theme.neutralContent,
      lineHeight: 20,
      marginBottom: 12,
    },
    specificationsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    specificationChip: {
      backgroundColor: theme.base100,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      marginRight: 8,
      marginBottom: 4,
      borderWidth: 1,
      borderColor: theme.neutral,
    },
    specificationText: {
      fontSize: 12,
      color: theme.baseContent,
    },
    articleFooter: {
      marginBottom: 16,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    articlePrice: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.primary,
      marginRight: 8,
    },
    subscriptionDuration: {
      fontSize: 14,
      color: theme.neutralContent,
      fontStyle: 'italic',
    },
    stockContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    stockIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    stockText: {
      fontSize: 14,
      fontWeight: '600',
    },
    viewButton: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
    },
    viewButtonText: {
      color: theme.primaryContent,
      fontSize: 16,
      fontWeight: '600',
    },
    loadingFooter: {
      padding: 20,
      alignItems: 'center',
    },
    // Filters Modal
    filtersModal: {
      flex: 1,
      backgroundColor: theme.base100,
    },
    filtersHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.neutral,
    },
    filtersTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.baseContent,
    },
    filtersContent: {
      flex: 1,
      padding: 16,
    },
    filterSection: {
      marginBottom: 24,
    },
    filterSectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.baseContent,
      marginBottom: 12,
    },
    categoryFilter: {
      backgroundColor: theme.base200,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 1,
      borderColor: theme.neutral,
    },
    categoryFilterActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    categoryFilterText: {
      color: theme.baseContent,
      fontWeight: '500',
    },
    categoryFilterTextActive: {
      color: theme.primaryContent,
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.neutral + '40',
    },
    switchLabel: {
      fontSize: 16,
      color: theme.baseContent,
    },
    specificationFilter: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.neutral + '40',
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: theme.neutral,
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    specificationFilterText: {
      fontSize: 16,
      color: theme.baseContent,
    },
    filtersFooter: {
      flexDirection: 'row',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.neutral,
    },
    resetButton: {
      flex: 1,
      backgroundColor: theme.base200,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginRight: 8,
      borderWidth: 1,
      borderColor: theme.neutral,
    },
    resetButtonText: {
      color: theme.baseContent,
      fontWeight: '600',
    },
    applyButton: {
      flex: 1,
      backgroundColor: theme.primary,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginLeft: 8,
    },
    applyButtonText: {
      color: theme.primaryContent,
      fontWeight: '600',
    },
  });

export default ArticlesScreen; 