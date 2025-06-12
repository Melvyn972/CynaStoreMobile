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
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { articleService } from '../services';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const stats = [
  { value: '10k+', label: 'Utilisateurs actifs' },
  { value: '99.9%', label: 'Temps de fonctionnement' },
  { value: '24/7', label: 'Support technique' },
];

const productImage = 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80';

const floatingDots = [
  { top: '25%', left: '25%', size: 16, color: '#a78bfa', delay: 0 },
  { top: '33%', right: '33%', size: 12, color: '#6366f1', delay: 1000 },
  { bottom: '33%', left: '33%', size: 14, color: '#c4b5fd', delay: 3000 },
  { bottom: '25%', right: '25%', size: 12, color: '#818cf8', delay: 2000 },
  { bottom: '16%', left: '20%', size: 10, color: '#a78bfa', delay: 4000 },
  { bottom: '20%', right: '20%', size: 10, color: '#6366f1', delay: 5000 },
];

// Hero section data
const heroStats = [
  { value: '10k+', label: 'Utilisateurs actifs' },
  { value: '99.9%', label: 'Temps de fonctionnement' },
  { value: '24/7', label: 'Support technique' },
];

// Problem section data
const problemStats = [
  {
    number: '01',
    title: "Surface d'attaque vulnérable",
    description: "Les entreprises disposent en moyenne de 254 applications critiques, créant une surface d'attaque extensive que les équipes de sécurité peinent à surveiller efficacement.",
  },
  {
    number: '02',
    title: 'Temps de détection prolongé',
    description: "Le temps moyen de détection d'une violation est de 287 jours, permettant aux attaquants d'accéder aux systèmes critiques et de dérober des données sensibles.",
  },
  {
    number: '03',
    title: "Impact catastrophique pour l'entreprise",
    description: "Le coût moyen d'une violation de données atteint 4,35 millions de dollars, sans compter les dommages à la réputation et la perte de confiance des clients.",
  },
];

const problemExtraStats = [
  { icon: 'shield-checkmark', color: '#a78bfa', value: '500+', label: 'Entreprises protégées' },
  { icon: 'medal-outline', color: '#6366f1', value: '99.8%', label: 'Taux de détection' },
  { icon: 'flash-outline', color: '#a78bfa', value: '15 min', label: 'Temps de réponse moyen' },
];

// Features section data
const features = [
  {
    title: "Détection & Réponse aux Menaces",
    description: "Détection avancée des menaces alimentée par l'IA qui identifie les comportements malveillants en temps réel. Notre système de réponse automatisé neutralise les menaces avant qu'elles n'impactent vos opérations.",
    icon: 'shield-checkmark',
  },
  {
    title: "Automatisation de la Conformité",
    description: "Restez conforme avec RGPD, HIPAA, SOC 2 et autres cadres réglementaires. Notre plateforme automatise la documentation, les pistes d'audit et les contrôles de sécurité requis pour la certification.",
    icon: 'document-text-outline',
  },
  {
    title: "Centre d'Opérations de Sécurité",
    description: "Surveillance 24/7 par des experts en sécurité qui analysent les menaces, valident les alertes et coordonnent la réponse aux incidents. Notre équipe SOC étend vos capacités de sécurité sans les frais d'une équipe interne.",
    icon: 'eye-outline',
  },
  {
    title: "Gestion des Vulnérabilités",
    description: "Analyse continue et priorisation des vulnérabilités basées sur le niveau de risque. Notre plateforme fournit des instructions claires de remédiation et suit le processus de résolution de la détection à l'achèvement.",
    icon: 'search-outline',
  },
];

// FAQ section data
const faqList = [
  {
    question: "Comment CynaStore protège-t-il contre les menaces zero-day?",
    answer: "Notre moteur de détection de menaces alimenté par l'IA analyse en permanence les modèles de comportement sur votre réseau et vos terminaux pour identifier les activités anormales, même provenant de menaces inconnues. Contrairement aux solutions basées sur les signatures, nous ne nous appuyons pas uniquement sur des indicateurs de menaces connus, ce qui nous permet de détecter et de répondre aux attaques zero-day sophistiquées avant qu'elles ne causent des dommages.",
  },
  {
    question: "CynaStore est-il conforme aux réglementations de l'industrie?",
    answer: "Absolument. CynaStore est conçu avec la conformité comme principe fondamental, prenant en charge le RGPD, HIPAA, SOC 2, ISO 27001 et d'autres cadres réglementaires majeurs. Notre plateforme vous aide non seulement à atteindre la conformité, mais maintient également la documentation et les preuves requises pour les audits, réduisant votre charge de conformité jusqu'à 70%.",
  },
  {
    question: "Combien de temps faut-il pour implémenter CynaStore?",
    answer: "La plupart des organisations sont pleinement opérationnelles avec CynaStore en 5 à 7 jours ouvrables. Notre processus d'intégration rationalisé comprend des spécialistes dédiés à la mise en œuvre qui gèrent la configuration technique pendant que votre équipe reçoit une formation complète. Contrairement aux solutions de sécurité traditionnelles qui peuvent prendre des mois à déployer, l'architecture native cloud de CynaStore permet une intégration rapide avec votre infrastructure existante.",
  },
  {
    question: "Qu'est-ce qui différencie CynaStore des fournisseurs de sécurité traditionnels?",
    answer: "CynaStore offre une sécurité de niveau entreprise via un modèle SaaS qui élimine la complexité et les frais généraux des solutions traditionnelles. Nous combinons une technologie avancée avec l'expertise humaine grâce à notre Centre d'Opérations de Sécurité 24/7, fournissant une protection complète sans vous obliger à constituer une équipe de sécurité interne. Notre plateforme évolue continuellement grâce à l'apprentissage par IA, garantissant que vous êtes protégé contre les menaces émergentes.",
  },
];

const HomeScreen = ({ navigation }) => {
  const { theme, mode } = useTheme();
  const { isAuthenticated } = useAuth();
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const [featureIndex, setFeatureIndex] = useState(0);
  const [faqIndex, setFaqIndex] = useState(0);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [bounceAnim]);

  useEffect(() => {
    loadFeaturedArticles();
  }, []);

  const loadFeaturedArticles = async () => {
    try {
      setLoadingArticles(true);
      const response = await articleService.getArticles(1, 6);
      setFeaturedArticles(response.articles || []);
    } catch (error) {
      console.error('Error loading featured articles:', error);
      // Ne pas afficher d'erreur, juste rester avec un tableau vide
    } finally {
      setLoadingArticles(false);
    }
  };

  const handleStartShopping = () => {
    navigation.navigate('Products');
  };

  const handleLearnMore = () => {
    scrollViewRef.current?.scrollTo({
      y: 600,
      animated: true,
    });
  };

  const handleArticlePress = (article) => {
    navigation.navigate('ArticleDetail', { articleId: article.id });
  };

  const renderFeaturedArticleCard = (article) => (
    <TouchableOpacity
      key={article.id}
      style={styles.featuredArticleCard}
      onPress={() => handleArticlePress(article)}
    >
      <Image 
        source={{ uri: article.image || 'https://picsum.photos/150/150' }} 
        style={styles.featuredArticleImage}
        defaultSource={{ uri: 'https://picsum.photos/150/150' }}
      />
      <View style={styles.featuredArticleContent}>
        <Text style={styles.featuredArticleTitle} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={styles.featuredArticleDescription} numberOfLines={3}>
          {article.description || article.content}
        </Text>
        <View style={styles.featuredArticleFooter}>
          <Text style={styles.featuredArticlePrice}>
            {article.price ? `${article.price.toFixed(2)} €` : 'Gratuit'}
          </Text>
          <View style={styles.featuredArticleRating}>
            <Ionicons name="star" size={14} color={theme.warning} />
            <Text style={styles.featuredArticleRatingText}>
              {article.rating || '4.5'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base100,
    },
    scrollContainer: {
      paddingBottom: 40,
    },
    // Hero Section
    heroSection: {
      paddingHorizontal: 24,
      paddingVertical: 60,
      alignItems: 'center',
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.primary + '20',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.primary + '30',
      marginBottom: 24,
    },
    badgeDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.primary,
      marginRight: 8,
    },
    badgeText: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: '500',
    },
    heroTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.baseContent,
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: 40,
    },
    heroGradientText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.primary,
    },
    heroDescription: {
      fontSize: 16,
      color: theme.neutralContent,
      textAlign: 'center',
      marginBottom: 32,
      lineHeight: 24,
    },
    heroButtons: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 40,
    },
    primaryButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: theme.borderRadius.xl,
      flexDirection: 'row',
      alignItems: 'center',
    },
    primaryButtonText: {
      color: theme.primaryContent,
      fontSize: 16,
      fontWeight: '600',
      marginRight: 8,
    },
    secondaryButton: {
      backgroundColor: theme.base200,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.neutral,
    },
    secondaryButtonText: {
      color: theme.baseContent,
      fontSize: 16,
      fontWeight: '600',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.primary,
    },
    statLabel: {
      fontSize: 12,
      color: theme.neutralContent,
      textAlign: 'center',
      marginTop: 4,
    },
    // Problem Section
    problemSection: {
      paddingHorizontal: 24,
      paddingVertical: 40,
      backgroundColor: theme.base200,
    },
    sectionTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.baseContent,
      textAlign: 'center',
      marginBottom: 16,
    },
    sectionDescription: {
      fontSize: 16,
      color: theme.neutralContent,
      textAlign: 'center',
      marginBottom: 32,
      lineHeight: 24,
    },
    problemCard: {
      backgroundColor: theme.base100,
      borderRadius: theme.borderRadius.xl,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.neutral,
    },
    problemNumber: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: 8,
    },
    problemTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 8,
    },
    problemDescription: {
      fontSize: 14,
      color: theme.neutralContent,
      lineHeight: 20,
    },
    problemStatsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 32,
    },
    problemStatItem: {
      alignItems: 'center',
      flex: 1,
    },
    problemStatIcon: {
      marginBottom: 8,
    },
    problemStatValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.baseContent,
    },
    problemStatLabel: {
      fontSize: 12,
      color: theme.neutralContent,
      textAlign: 'center',
      marginTop: 4,
    },
    // Features Section
    featuresSection: {
      paddingHorizontal: 24,
      paddingVertical: 40,
    },
    featureCard: {
      backgroundColor: theme.base200,
      borderRadius: theme.borderRadius.xl,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.neutral,
    },
    featureHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    featureIcon: {
      marginRight: 12,
    },
    featureTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.baseContent,
      flex: 1,
    },
    featureDescription: {
      fontSize: 14,
      color: theme.neutralContent,
      lineHeight: 20,
    },
    // FAQ Section
    faqSection: {
      paddingHorizontal: 24,
      paddingVertical: 40,
      backgroundColor: theme.base200,
    },
    faqCard: {
      backgroundColor: theme.base100,
      borderRadius: theme.borderRadius.xl,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.neutral,
      overflow: 'hidden',
    },
    faqHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
    },
    faqQuestion: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.baseContent,
      flex: 1,
      marginRight: 12,
    },
    faqAnswer: {
      padding: 20,
      paddingTop: 0,
      fontSize: 14,
      color: theme.neutralContent,
      lineHeight: 20,
    },
    // CTA Section
    ctaSection: {
      paddingHorizontal: 24,
      paddingVertical: 40,
      alignItems: 'center',
    },
    ctaTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.baseContent,
      textAlign: 'center',
      marginBottom: 16,
    },
    ctaDescription: {
      fontSize: 16,
      color: theme.neutralContent,
      textAlign: 'center',
      marginBottom: 32,
      lineHeight: 24,
    },
    ctaButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: theme.borderRadius.xl,
      flexDirection: 'row',
      alignItems: 'center',
    },
    ctaButtonText: {
      color: theme.primaryContent,
      fontSize: 18,
      fontWeight: '600',
      marginRight: 8,
    },
    featuredArticleCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderWidth: 1,
      borderColor: theme.neutral,
      borderRadius: theme.borderRadius.xl,
    },
    featuredArticleImage: {
      width: 100,
      height: 100,
      borderRadius: theme.borderRadius.xl,
      marginRight: 16,
    },
    featuredArticleContent: {
      flex: 1,
    },
    featuredArticleTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 8,
    },
    featuredArticleDescription: {
      fontSize: 14,
      color: theme.neutralContent,
      lineHeight: 20,
    },
    featuredArticleFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    featuredArticlePrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.primary,
    },
    featuredArticleRating: {
      flexDirection: 'row',
      alignItems: 'center',
    },
          featuredArticleRatingText: {
        fontSize: 14,
        color: theme.neutralContent,
        marginLeft: 8,
      },
      featuredArticlesSection: {
        paddingHorizontal: 24,
        paddingVertical: 40,
      },
      featuredArticlesTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.baseContent,
        marginBottom: 24,
        textAlign: 'center',
      },
    });

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>✨ Découvrez une nouvelle façon de créer</Text>
          </View>
          
          <Text style={styles.heroTitle}>
            Élevez votre vision{'\n'}
            <Text style={styles.heroGradientText}>en réalité digitale</Text>
          </Text>
          
          <Text style={styles.heroDescription}>
            Transformez vos idées en expériences numériques exceptionnelles avec notre plateforme de cybersécurité avancée.
          </Text>
          
          <View style={styles.heroButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleStartShopping}>
              <Text style={styles.primaryButtonText}>Commencer</Text>
              <Ionicons name="arrow-forward" size={16} color={theme.primaryContent} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={handleLearnMore}>
              <Text style={styles.secondaryButtonText}>En savoir plus</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsContainer}>
            {heroStats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Problem Section */}
        <View style={styles.problemSection}>
          <Text style={styles.sectionTitle}>Les défis de la cybersécurité moderne</Text>
          <Text style={styles.sectionDescription}>
            Les entreprises font face à des menaces de plus en plus sophistiquées qui nécessitent une approche proactive.
          </Text>
          
          {problemStats.map((problem, index) => (
            <View key={index} style={styles.problemCard}>
              <Text style={styles.problemNumber}>{problem.number}</Text>
              <Text style={styles.problemTitle}>{problem.title}</Text>
              <Text style={styles.problemDescription}>{problem.description}</Text>
            </View>
          ))}
          
          <View style={styles.problemStatsContainer}>
            {problemExtraStats.map((stat, index) => (
              <View key={index} style={styles.problemStatItem}>
                <Ionicons 
                  name={stat.icon} 
                  size={24} 
                  color={stat.color} 
                  style={styles.problemStatIcon}
                />
                <Text style={styles.problemStatValue}>{stat.value}</Text>
                <Text style={styles.problemStatLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Nos solutions de sécurité</Text>
          <Text style={styles.sectionDescription}>
            Une protection complète adaptée aux besoins de votre entreprise.
          </Text>
          
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <Ionicons 
                  name={feature.icon} 
                  size={24} 
                  color={theme.primary} 
                  style={styles.featureIcon}
                />
                <Text style={styles.featureTitle}>{feature.title}</Text>
              </View>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Questions fréquentes</Text>
          <Text style={styles.sectionDescription}>
            Trouvez les réponses aux questions les plus courantes sur notre plateforme.
          </Text>
          
          {faqList.map((faq, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.faqCard}
              onPress={() => setFaqIndex(faqIndex === index ? -1 : index)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons 
                  name={faqIndex === index ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={theme.primary} 
                />
              </View>
              {faqIndex === index && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Prêt à sécuriser votre entreprise ?</Text>
          <Text style={styles.ctaDescription}>
            Rejoignez des milliers d'entreprises qui font confiance à CynaStore pour leur cybersécurité.
          </Text>
          
          <TouchableOpacity style={styles.ctaButton} onPress={handleStartShopping}>
            <Text style={styles.ctaButtonText}>Commencer maintenant</Text>
            <Ionicons name="arrow-forward" size={18} color={theme.primaryContent} />
          </TouchableOpacity>
        </View>

        {/* Featured Articles Section */}
        <View style={styles.featuredArticlesSection}>
          <Text style={styles.featuredArticlesTitle}>Articles Récents</Text>
          {loadingArticles ? (
            <ActivityIndicator size="large" color={theme.primary} />
          ) : (
            featuredArticles.map(renderFeaturedArticleCard)
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen; 