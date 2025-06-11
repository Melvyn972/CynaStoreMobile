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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { articleService } from '../services/articleService';

const ArticlesScreen = ({ navigation }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async (isRefresh = false) => {
    if (loading) return;

    try {
      setLoading(true);
      const currentPage = isRefresh ? 1 : page;
      
      let response;
      if (searchQuery.trim()) {
        response = await articleService.searchArticles(searchQuery, currentPage);
      } else {
        response = await articleService.getArticles(currentPage);
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
    await loadArticles(true);
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
      onPress={() => navigation.navigate('ArticleDetail', { articleId: item.id })}
    >
      <View style={styles.articleHeader}>
        <Text style={styles.articleTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.articleDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.articlePreview} numberOfLines={3}>
        {item.content}
      </Text>
      <View style={styles.articleFooter}>
        <Text style={styles.articleAuthor}>By {item.author?.name}</Text>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingFooter}>
        <Text>Loading more articles...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search articles..."
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
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  listContainer: {
    padding: 15,
  },
  articleCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  articleTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  articleDate: {
    fontSize: 12,
    color: '#666',
  },
  articlePreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleAuthor: {
    fontSize: 12,
    color: '#007AFF',
  },
  loadingFooter: {
    padding: 20,
    alignItems: 'center',
  },
});

export default ArticlesScreen; 