import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { articleService } from '../services/articleService';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFeaturedArticles();
  }, []);

  const loadFeaturedArticles = async () => {
    try {
      setLoading(true);
      const response = await articleService.getArticles(1, 5);
      setFeaturedArticles(response.articles || []);
    } catch (error) {
      console.error('Error loading featured articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeaturedArticles();
    setRefreshing(false);
  };

  const renderArticleItem = ({ item }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => navigation.navigate('ArticlesTab', {
        screen: 'ArticleDetail',
        params: { articleId: item.id }
      })}
    >
      <Text style={styles.articleTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.articlePreview} numberOfLines={3}>
        {item.content}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Welcome back, {user?.name || 'User'}!
        </Text>
        <Text style={styles.subtitle}>
          Discover amazing products at CynaStore
        </Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ArticlesTab')}
        >
          <Text style={styles.actionButtonText}>Browse Articles</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('CartTab')}
        >
          <Text style={styles.actionButtonText}>View Cart</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Articles</Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <FlatList
            data={featuredArticles}
            renderItem={renderArticleItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.articlesList}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  articlesList: {
    marginBottom: 20,
  },
  articleCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginRight: 15,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  articlePreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
});

export default HomeScreen; 