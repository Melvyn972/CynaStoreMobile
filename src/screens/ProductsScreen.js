import React, { useState, useEffect, useMemo } from 'react';
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
  Modal,
  ScrollView,
  Switch,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { articleService, cartService, categoryService, specificationService } from '../services';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const numColumns = 2;
const cardSize = (width - 48) / numColumns;

const ProductsScreen = ({ navigation, route }) => {
  const { theme, mode } = useTheme();
  const { isAuthenticated } = useAuth();
  
  // États principaux
  const [initialArticles, setInitialArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addingToCart, setAddingToCart] = useState({});
  
  // États de filtres (comme dans la version web)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(route?.params?.category || "Tous");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("name");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [exactMatch, setExactMatch] = useState(false);
  const [selectedSpecs, setSelectedSpecs] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState("Toutes");
  const [categories, setCategories] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    fetchCategoriesAndSpecs();
  }, [initialArticles]);

  // Calcul des prix min/max comme dans la version web
  const priceExtreme = useMemo(() => {
    if (initialArticles.length === 0) return { min: 0, max: 1000 };
    const prices = initialArticles.map(a => a.price || 0);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [initialArticles]);

  // Calcul des durées disponibles comme dans la version web
  const availableDurations = useMemo(() => {
    const durations = [...new Set(initialArticles.map(article => article.subscriptionDuration))].filter(Boolean);
    return ["Toutes", "Aucune (produit unique)", ...durations.sort()];
  }, [initialArticles]);

  // Mise à jour automatique de la fourchette de prix
  useEffect(() => {
    if (priceRange[0] === 0 && priceRange[1] === 10000) {
      setPriceRange([priceExtreme.min, priceExtreme.max]);
    }
  }, [priceExtreme]);

  // Filtrage et tri des articles (logique exacte de la version web)
  const filteredArticles = useMemo(() => {
    let filtered = initialArticles.filter(article => {
            // Filtre de recherche textuelle
      let matchesSearch = true;
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        const title = article.title || '';
        const description = article.description || '';
        const category = article.category || '';
        const categoryName = article.categoryObj?.name || '';
        
        if (exactMatch) {
          matchesSearch = title.toLowerCase() === searchLower ||
                          description.toLowerCase() === searchLower ||
                          category.toLowerCase() === searchLower ||
                          categoryName.toLowerCase() === searchLower;
        } else {
          matchesSearch = title.toLowerCase().includes(searchLower) ||
                          description.toLowerCase().includes(searchLower) ||
                          category.toLowerCase().includes(searchLower) ||
                          categoryName.toLowerCase().includes(searchLower);
        }
      }
      
      // Filtre par catégorie
      const matchesCategory = selectedCategory === "Tous" || 
                              article.categoryObj?.name === selectedCategory || 
                              article.category === selectedCategory;
      
      // Filtre par prix
      const matchesPrice = (article.price || 0) >= priceRange[0] && (article.price || 0) <= priceRange[1];
      
      // Filtre par stock
      const matchesStock = !inStockOnly || (article.stock || 0) > 0;

      // Filtre par durée d'abonnement
      const matchesDuration = selectedDuration === "Toutes" || 
                              (selectedDuration === "Aucune (produit unique)" && !article.subscriptionDuration) ||
                              article.subscriptionDuration === selectedDuration;

      // Filtre par spécifications
      let matchesSpecs = true;
      if (selectedSpecs.length > 0 && article.specifications) {
        const articleSpecIds = article.specifications.map(spec => 
          spec.technicalSpecificationId || spec.technicalSpecification?.id
        ).filter(Boolean);
        matchesSpecs = selectedSpecs.every(specId => articleSpecIds.includes(specId));
      }
      
      return matchesSearch && matchesCategory && matchesPrice && matchesStock && matchesDuration && matchesSpecs;
    });

    // Tri des articles (logique exacte de la version web)
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "availability":
        filtered.sort((a, b) => {
          const aInStock = (a.stock || 0) > 0;
          const bInStock = (b.stock || 0) > 0;
          if (aInStock && !bInStock) return -1;
          if (!aInStock && bInStock) return 1;
          return (b.stock || 0) - (a.stock || 0);
        });
        break;
      case "duration":
        filtered.sort((a, b) => {
          const durationOrder = ["1 mois", "3 mois", "6 mois", "1 an", "2 ans", "3 ans", "Vie"];
          const aIndex = a.subscriptionDuration ? durationOrder.indexOf(a.subscriptionDuration) : -1;
          const bIndex = b.subscriptionDuration ? durationOrder.indexOf(b.subscriptionDuration) : -1;
          
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return -1;
          if (bIndex === -1) return 1;
          
          return aIndex - bIndex;
        });
        break;
      case "name":
      default:
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
    }

    return filtered;
  }, [initialArticles, searchTerm, selectedCategory, priceRange, sortBy, inStockOnly, exactMatch, selectedSpecs, selectedDuration]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await articleService.getArticles(1, 50); // Charger plus d'articles comme sur le web
      setInitialArticles(response.articles || []);
    } catch (error) {
      console.error('Error loading articles:', error);
      Alert.alert('Erreur', 'Impossible de charger les produits');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesAndSpecs = async () => {
    try {
      // Récupérer les spécifications
      const specsResponse = await specificationService.getSpecifications();
      setSpecifications(specsResponse || []);
    } catch (error) {
      console.error('Error loading specifications:', error);
    }

    // Extraire les catégories des articles comme sur le web
    if (initialArticles.length > 0) {
      const cats = [...new Set(initialArticles.map(article => 
        article.categoryObj?.name || article.category
      ).filter(Boolean))];
      setCategories(["Tous", ...cats.sort()]);
    } else {
      setCategories(["Tous"]);
    }
  };

    // Fonctions utilitaires comme dans la version web
  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("Tous");
    setPriceRange([priceExtreme.min, priceExtreme.max]);
    setSortBy("name");
    setInStockOnly(false);
    setExactMatch(false);
    setSelectedSpecs([]);
    setSelectedDuration("Toutes");
  };

  const hasActiveFilters = () => {
    return searchTerm.trim() !== "" || 
           selectedCategory !== "Tous" || 
           priceRange[0] !== priceExtreme.min || 
           priceRange[1] !== priceExtreme.max ||
           inStockOnly ||
           exactMatch ||
           selectedSpecs.length > 0 ||
           selectedDuration !== "Toutes";
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchArticles();
    setRefreshing(false);
  };



    const renderProduct = ({ item }) => (
      <TouchableOpacity
        key={item.id}
        style={styles.productCard}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
        activeOpacity={0.9}
      >
      {/* Image du produit avec badges overlay */}
      <View style={styles.productImageContainer}>
        {item.image ? (
          <Image 
            source={{ uri: item.image }} 
            style={styles.productImage}
            defaultSource={require('../../assets/adaptive-icon.png')}
          />
        ) : (
          <View style={styles.productImagePlaceholder}>
            <Ionicons name="image-outline" size={40} color={theme.neutralContent} />
          </View>
        )}
        
        {/* Badges en overlay comme sur le web */}
        <View style={styles.badgeOverlay}>
          <View style={styles.leftBadges}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {item.categoryObj?.name || item.category}
              </Text>
            </View>
            {item.subscriptionDuration && (
              <View style={styles.durationBadge}>
                <Text style={styles.durationBadgeText}>
                  {item.subscriptionDuration}
                </Text>
              </View>
            )}
          </View>
          
          <View style={[styles.stockBadge, { 
            backgroundColor: (item.stock || 0) > 0 ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)'
          }]}>
            <Text style={styles.stockBadgeText}>
              {(item.stock || 0) > 0 ? 'En stock' : 'Épuisé'}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Contenu de la carte */}
      <View style={styles.productContent}>
        <Text style={styles.productTitle} numberOfLines={1}>
          {item.title || 'Titre non disponible'}
        </Text>
        
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description || 'Description non disponible'}
        </Text>
        
        {/* Informations du produit */}
        <View style={styles.productInfo}>
          {/* Stock info */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Disponibilité</Text>
            <Text style={[styles.infoValue, { 
              color: (item.stock || 0) > 0 ? theme.success : theme.error 
            }]}>
              {(item.stock || 0) > 0 
                ? `${item.stock || 0} en stock` 
                : 'Épuisé'
              }
            </Text>
          </View>
          
          {/* Durée si présente */}
          {item.subscriptionDuration && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Durée</Text>
              <Text style={[styles.infoValue, { color: theme.info }]}>
                {item.subscriptionDuration}
              </Text>
            </View>
          )}
          
          {/* Prix et action */}
          <View style={styles.priceAndAction}>
                        <Text style={styles.productPrice}>
              {item.price ? `${item.price.toFixed(2)} €` : 'Prix non disponible'}
            </Text>
            
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>Voir</Text>
        </TouchableOpacity>
          </View>
        </View>
      </View>
      </TouchableOpacity>
    );



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
          {/* Recherche */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Recherche</Text>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={16} color={theme.neutralContent} style={styles.searchInputIcon} />
              <TextInput
                style={styles.searchInputField}
                placeholder="Rechercher..."
                placeholderTextColor={theme.neutralContent}
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
            </View>
          </View>

          {/* Catégorie */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Catégorie</Text>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Sélectionner une catégorie</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[styles.categoryChip, selectedCategory === category && styles.categoryChipActive]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text style={[styles.categoryChipText, selectedCategory === category && styles.categoryChipTextActive]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Durée d'abonnement */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Durée d'abonnement</Text>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Sélectionner une durée</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                {availableDurations.map((duration) => (
                  <TouchableOpacity
                    key={duration}
                    style={[styles.categoryChip, selectedDuration === duration && styles.categoryChipActive]}
                    onPress={() => setSelectedDuration(duration)}
                  >
                    <Text style={[styles.categoryChipText, selectedDuration === duration && styles.categoryChipTextActive]}>
                      {duration}
      </Text>
    </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Prix */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Prix (€)</Text>
            <View style={styles.priceInputsContainer}>
              <View style={styles.priceInputGroup}>
                <Text style={styles.priceInputLabel}>Min</Text>
                <TextInput
                  style={styles.priceInput}
                  value={priceRange[0].toString()}
                  onChangeText={(text) => setPriceRange([parseInt(text) || 0, priceRange[1]])}
                  keyboardType="numeric"
                  placeholder={priceExtreme.min.toString()}
                />
              </View>
              <View style={styles.priceInputGroup}>
                <Text style={styles.priceInputLabel}>Max</Text>
                <TextInput
                  style={styles.priceInput}
                  value={priceRange[1].toString()}
                  onChangeText={(text) => setPriceRange([priceRange[0], parseInt(text) || priceExtreme.max])}
                  keyboardType="numeric"
                  placeholder={priceExtreme.max.toString()}
                />
              </View>
            </View>
            <Text style={styles.priceRangeHint}>
              {priceExtreme.min}€ - {priceExtreme.max}€
            </Text>
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

          {/* Spécifications techniques */}
          {specifications.length > 0 && (
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Spécifications techniques</Text>
              <View style={styles.specificationsContainer}>
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
            </View>
          )}
        </ScrollView>

        <View style={styles.filtersFooter}>
          {hasActiveFilters() && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetFilters}
            >
              <Text style={styles.resetButtonText}>Réinitialiser les filtres</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => setShowFilters(false)}
          >
            <Text style={styles.applyButtonText}>Appliquer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base100,
    },
    header: {
      paddingHorizontal: 16,
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
      marginBottom: 8,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.baseContent,
    },
    headerSubtitle: {
      fontSize: 16,
      color: theme.neutralContent,
      marginBottom: 16,
      lineHeight: 22,
    },
    viewAllCategoriesButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      alignSelf: 'flex-start',
      marginTop: 8,
    },
    viewAllCategoriesText: {
      color: theme.primary,
      fontSize: 14,
      marginLeft: 4,
    },
    cartButton: {
      backgroundColor: theme.base200,
      borderRadius: 12,
      padding: 8,
    },
    mainContent: {
      flex: 1,
    },
    filtersBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme.base200,
      borderBottomWidth: 1,
      borderBottomColor: theme.neutral,
    },
    resultsBar: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.base100,
      borderBottomWidth: 1,
      borderBottomColor: theme.neutral,
    },
    filtersButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary + '20',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      alignSelf: 'flex-start',
      marginBottom: 16,
    },
    filtersButtonText: {
      color: theme.primary,
      fontWeight: '600',
      marginLeft: 8,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.base200,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.neutral,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.baseContent,
    },
    categoriesSection: {
      marginBottom: 16,
    },
    categoriesSectionTitle: {
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
    resultsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    resultsText: {
      fontSize: 14,
      color: theme.neutralContent,
      fontWeight: '600',
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
      borderRadius: 8,
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
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    productCard: {
      backgroundColor: theme.base200,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.neutral,
      overflow: 'hidden',
    },
    productImageContainer: {
      position: 'relative',
    },
    productImage: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
    },
    productImagePlaceholder: {
      width: '100%',
      height: 200,
      backgroundColor: theme.base300,
      justifyContent: 'center',
      alignItems: 'center',
    },
    badgeOverlay: {
      position: 'absolute',
      top: 16,
      left: 16,
      right: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    leftBadges: {
      flexDirection: 'column',
      gap: 8,
    },
    productContent: {
      padding: 16,
    },
    productHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    categoryBadge: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
    },
    categoryBadgeText: {
      fontSize: 12,
      color: 'white',
      fontWeight: '600',
    },
    durationBadge: {
      backgroundColor: 'rgba(6, 182, 212, 0.9)',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
    },
    durationBadgeText: {
      fontSize: 12,
      color: 'white',
      fontWeight: '600',
    },
    stockBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
    },
    stockBadgeText: {
      fontSize: 12,
      color: 'white',
      fontWeight: '600',
    },
    stockContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
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
    productTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 8,
      lineHeight: 24,
    },
    productDescription: {
      fontSize: 14,
      color: theme.neutralContent,
      lineHeight: 20,
      marginBottom: 16,
    },
    productInfo: {
      marginTop: 12,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    infoLabel: {
      fontSize: 14,
      color: theme.neutralContent,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: '600',
    },
    priceAndAction: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.neutral + '40',
    },
    specificationsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 12,
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
    availabilityContainer: {
      marginBottom: 12,
    },
    availabilityLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.baseContent,
      marginBottom: 4,
    },
    availabilityValue: {
      fontSize: 14,
      color: theme.neutralContent,
    },
    productPrice: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: 16,
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
    footerLoader: {
      paddingVertical: 20,
      alignItems: 'center',
    },
    // Modal Styles
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
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.base200,
      borderRadius: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: theme.neutral,
    },
    searchInputIcon: {
      marginRight: 8,
    },
    searchInputField: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.baseContent,
    },
    pickerContainer: {
      marginTop: 8,
    },
    pickerLabel: {
      fontSize: 14,
      color: theme.neutralContent,
      marginBottom: 8,
    },
    categoriesScroll: {
      flexDirection: 'row',
    },
    categoryChip: {
      backgroundColor: theme.base200,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 1,
      borderColor: theme.neutral,
    },
    categoryChipActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    categoryChipText: {
      color: theme.baseContent,
      fontWeight: '500',
      fontSize: 14,
    },
    categoryChipTextActive: {
      color: theme.primaryContent,
    },
    priceInputsContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 8,
    },
    priceInputGroup: {
      flex: 1,
    },
    priceInputLabel: {
      fontSize: 14,
      color: theme.neutralContent,
      marginBottom: 4,
    },
    priceInput: {
      backgroundColor: theme.base200,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 16,
      color: theme.baseContent,
      borderWidth: 1,
      borderColor: theme.neutral,
    },
    priceRangeHint: {
      fontSize: 12,
      color: theme.neutralContent,
      textAlign: 'center',
    },
    priceRangeContainer: {
      padding: 16,
      backgroundColor: theme.base200,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.neutral,
    },
    priceRangeText: {
      fontSize: 16,
      color: theme.baseContent,
      textAlign: 'center',
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
    specificationsContainer: {
      maxHeight: 200,
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

  if (loading && initialArticles.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Nos produits récents</Text>
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
          <Text style={styles.headerTitle}>
            {selectedCategory !== "Tous" ? (
              `Catégorie : ${selectedCategory}`
            ) : (
              "Notre Boutique"
            )}
          </Text>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="cart-outline" size={24} color={theme.baseContent} />
          </TouchableOpacity>
        </View>

        <Text style={styles.headerSubtitle}>
          {selectedCategory !== "Tous" 
            ? `Explorez tous les produits de la catégorie ${selectedCategory}.`
            : "Découvrez notre sélection de produits premium, soigneusement choisis pour vous offrir la meilleure expérience."
          }
        </Text>

        {selectedCategory !== "Tous" && (
          <TouchableOpacity
            style={styles.viewAllCategoriesButton}
            onPress={() => handleCategoryChange("Tous")}
          >
            <Ionicons name="close" size={16} color={theme.primary} />
            <Text style={styles.viewAllCategoriesText}>Voir toutes les catégories</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Layout avec sidebar et contenu (adapté pour mobile) */}
      <View style={styles.mainContent}>
        
        {/* Barre de filtres */}
        <View style={styles.filtersBar}>
          <TouchableOpacity 
            style={styles.filtersButton}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="options-outline" size={20} color={theme.primary} />
            <Text style={styles.filtersButtonText}>Filtres</Text>
          </TouchableOpacity>

          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Trier par :</Text>
            <TouchableOpacity 
              style={styles.sortButton}
              onPress={() => {
                // Cycle à travers les options de tri
                const sortOptions = ["name", "price-low", "price-high", "availability", "duration"];
                const currentIndex = sortOptions.indexOf(sortBy);
                const nextIndex = (currentIndex + 1) % sortOptions.length;
                setSortBy(sortOptions[nextIndex]);
              }}
            >
              <Text style={styles.sortButtonText}>
                {sortBy === 'name' ? 'Nom A-Z' : 
                 sortBy === 'price-low' ? 'Prix croissant' : 
                 sortBy === 'price-high' ? 'Prix décroissant' :
                 sortBy === 'availability' ? 'Disponibilité' : 'Durée d\'abonnement'}
              </Text>
              <Ionicons name="chevron-down" size={16} color={theme.baseContent} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Barre de résultats */}
        <View style={styles.resultsBar}>
          <Text style={styles.resultsText}>
            {filteredArticles.length} produit{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
            {searchTerm && ` pour "${searchTerm}"`}
          </Text>
        </View>

        {/* Grille des produits */}
        {filteredArticles.length > 0 ? (
          <FlatList
            data={filteredArticles}
            renderItem={renderProduct}
            keyExtractor={item => item.id.toString()}
            numColumns={1}
            contentContainerStyle={styles.productsContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="cube-outline" size={64} color={theme.neutralContent} />
            </View>
            <Text style={styles.emptyTitle}>Aucun produit trouvé</Text>
            <Text style={styles.emptyDescription}>
              Aucun produit ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={resetFilters}
            >
              <Text style={styles.emptyButtonText}>Réinitialiser les filtres</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {renderFiltersModal()}
    </View>
  );
};

export default ProductsScreen; 