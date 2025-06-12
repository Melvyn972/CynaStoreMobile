import React from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';

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
  const { isDarkMode } = useTheme();
  const bounceAnim = React.useRef(new Animated.Value(0)).current;
  const [featureIndex, setFeatureIndex] = React.useState(0);
  const [faqIndex, setFaqIndex] = React.useState(0);

  React.useEffect(() => {
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

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#121212' : '#f8f8ff' }}>
      {/* Layered Gradients */}
      <LinearGradient
        colors={isDarkMode ? ['#1a1a2e', '#23234b', '#3a1859'] : ['#f8f8ff', '#fff', '#e9d5ff']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {/* Floating blurred circles */}
      <View style={[styles.floating, styles.floating1]} />
      <View style={[styles.floating, styles.floating2]} />
      <View style={[styles.floating, styles.floating3]} />
      {/* Animated floating dots */}
      {floatingDots.map((dot, i) => (
        <Animated.View
          key={i}
          style={[
            styles.floatingDot,
            {
              ...dot,
              backgroundColor: dot.color,
              width: dot.size,
              height: dot.size,
              borderRadius: dot.size / 2,
              opacity: 0.25,
              position: 'absolute',
              zIndex: 1,
              transform: [{
                translateY: bounceAnim.interpolate({
                  inputRange: [-10, 0],
                  outputRange: [-dot.size / 2, 0],
                })
              }],
            },
          ]}
        />
      ))}

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Header with logo and app name */}
        <View style={[styles.headerContainer, { marginTop: 16, marginBottom: 8 }]}> 
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
            onError={() => {}}
          />
          <Text style={styles.headerAppName}>Cyna</Text>
        </View>
        {/* Badge */}
        <View style={styles.badgeContainer}>
          <LinearGradient
            colors={['rgba(255,255,255,0.7)', 'rgba(167,139,250,0.18)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>✨ Découvrez une nouvelle façon de créer</Text>
        </View>

        {/* Title with gradient text */}
        <Text style={styles.title}>
          Élevez votre vision{"\n"}
          {Platform.OS === 'web' ? (
            <Text style={[styles.gradientText, { color: '#7c3aed' }]}>en réalité digitale</Text>
          ) : (
            <MaskedView
              maskElement={<Text style={[styles.gradientText, { backgroundColor: 'transparent' }]}>en réalité digitale</Text>}
            >
              <LinearGradient
                colors={["#a78bfa", "#7c3aed", "#6366f1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 40 }}
              >
                <Text style={[styles.gradientText, { opacity: 0 }]}>en réalité digitale</Text>
              </LinearGradient>
            </MaskedView>
          )}
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Transformez votre startup rapidement et efficacement avec des outils innovants, des solutions modernes et une expérience utilisateur exceptionnelle.
        </Text>

        {/* CTA Buttons */}
        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={styles.ctaButtonPrimary}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#a78bfa", "#7c3aed", "#6366f1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', zIndex: 1 }}>
              <Ionicons name="rocket-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.ctaButtonText}>Commencer maintenant</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ctaButtonSecondary}
            onPress={() => navigation.navigate('Products')}
            activeOpacity={0.85}
          >
            <Ionicons name="eye-outline" size={20} color={isDarkMode ? '#fff' : '#23234b'} style={{ marginRight: 8 }} />
            <Text style={[styles.ctaButtonText, { color: isDarkMode ? '#fff' : '#23234b' }]}>Découvrir</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards with glassmorphism */}
        <View style={styles.statsRow}>
          {stats.map((stat, idx) => (
            <LinearGradient
              key={stat.label}
              colors={['rgba(255,255,255,0.85)', 'rgba(167,139,250,0.12)']}
              style={styles.statCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <LinearGradient
                colors={["#a78bfa", "#6366f1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statValueBg}
              >
                <Text style={styles.statValue}>{stat.value}</Text>
              </LinearGradient>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </LinearGradient>
          ))}
        </View>

        {/* Product Image with overlay and floating icons */}
        <View style={styles.productImageContainer}>
          <Image
            source={{ uri: productImage }}
            style={styles.productImage}
            resizeMode="cover"
            blurRadius={Platform.OS === 'android' ? 1 : 0}
          />
          <LinearGradient
            colors={["rgba(91,33,182,0.4)", "rgba(255,255,255,0)"]}
            style={styles.productImageOverlay}
          />
          {/* Floating icons */}
          <View style={[styles.floatingIcon, styles.iconTopLeft]}>
            <Ionicons name="checkmark-done-circle" size={28} color="#a78bfa" />
          </View>
          <View style={[styles.floatingIcon, styles.iconTopRight]}>
            <Ionicons name="rocket" size={28} color="#6366f1" />
          </View>
          <View style={[styles.floatingIcon, styles.iconBottomLeft]}>
            <Ionicons name="bulb" size={28} color="#a78bfa" />
          </View>
          <View style={[styles.floatingIcon, styles.iconBottomRight]}>
            <Ionicons name="shield-checkmark" size={28} color="#6366f1" />
          </View>
        </View>

        {/* Scroll indicator with bounce animation */}
        <View style={styles.scrollIndicatorContainer}>
          <Text style={styles.scrollIndicatorText}>👇 Défiler vers le bas</Text>
          <Animated.View style={[styles.scrollIndicatorCircle, { transform: [{ translateY: bounceAnim }] }]}> 
            <Ionicons name="arrow-down" size={24} color={isDarkMode ? '#a78bfa' : '#6366f1'} style={{ marginTop: 2 }} />
          </Animated.View>
        </View>

        {/* Problem Section */}
        <View style={[styles.section, { backgroundColor: isDarkMode ? '#18192a' : '#f8f8ff' }]}> 
          <View style={styles.badgeContainer2}>
            <Text style={styles.badgeText2}>Le défi</Text>
          </View>
          <Text style={styles.problemTitle}>
            83% des entreprises font face à des <Text style={styles.gradientText2}>pertes financières</Text> dues à une sécurité inadéquate
          </Text>
          <Text style={styles.problemSubtitle}>
            Menaces persistantes avancées, réglementations de conformité, architecture de sécurité fragmentée — le paysage actuel de la cybersécurité présente une complexité sans précédent.
          </Text>
          <View style={styles.problemCardsColumn}>
            {problemStats.map((item, idx) => (
              <View key={item.number} style={styles.problemCard}>
                <View style={styles.problemCardNumberBox}>
                  <Text style={styles.problemCardNumber}>{item.number}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.problemCardTitle}>{item.title}</Text>
                  <Text style={styles.problemCardDesc}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.problemExtraStatsRow}>
            {problemExtraStats.map((item, idx) => (
              <View key={item.label} style={styles.problemExtraStatCard}>
                <View style={[styles.problemExtraStatIconBox, { backgroundColor: item.color + '22' }]}> 
                  <Ionicons name={item.icon} size={28} color={item.color} />
                </View>
                <View>
                  <Text style={styles.problemExtraStatValue}>{item.value}</Text>
                  <Text style={styles.problemExtraStatLabel}>{item.label}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Features Section */}
        <View style={[styles.section, { backgroundColor: isDarkMode ? '#18192a' : '#fff' }]}> 
          <View style={styles.badgeContainer2}>
            <Text style={styles.badgeText2}>Fonctionnalités</Text>
          </View>
          <Text style={styles.problemTitle}>
            Sécurité de niveau entreprise, <Text style={styles.gradientText2}>accessible à tous</Text>
          </Text>
          <Text style={styles.problemSubtitle}>
            Protégez votre entreprise avec des solutions puissantes, intuitives et abordables.
          </Text>
          <View style={styles.accordionContainer}>
            {features.map((item, idx) => (
              <View key={item.title} style={[styles.accordionItem, featureIndex === idx && styles.accordionItemActive]}>
                <TouchableOpacity style={styles.accordionHeader} onPress={() => setFeatureIndex(idx)}>
                  <Text style={[styles.accordionNumber, featureIndex === idx && styles.accordionNumberActive]}>{`0${idx + 1}`}</Text>
                  <Text style={[styles.accordionTitle, featureIndex === idx && styles.accordionTitleActive]}>{item.title}</Text>
                  <Ionicons name={featureIndex === idx ? 'remove' : 'add'} size={22} color={featureIndex === idx ? '#a78bfa' : '#6366f1'} />
                </TouchableOpacity>
                {featureIndex === idx && (
                  <Text style={styles.accordionDesc}>{item.description}</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={[styles.section, { backgroundColor: isDarkMode ? '#18192a' : '#f8f8ff' }]}> 
          <View style={styles.badgeContainer2}>
            <Text style={styles.badgeText2}>Questions Fréquentes</Text>
          </View>
          <Text style={styles.problemTitle}>
            Les réponses à vos <Text style={styles.gradientText2}>questions</Text>
          </Text>
          <Text style={styles.problemSubtitle}>
            Tout ce que vous devez savoir sur notre service de sécurité avancé et comment il peut protéger votre entreprise.
          </Text>
          <View style={styles.accordionContainer}>
            {faqList.map((item, idx) => (
              <View key={item.question} style={[styles.accordionItem, faqIndex === idx && styles.accordionItemActive]}>
                <TouchableOpacity style={styles.accordionHeader} onPress={() => setFaqIndex(idx)}>
                  <Text style={[styles.accordionTitle, faqIndex === idx && styles.accordionTitleActive]}>{item.question}</Text>
                  <Ionicons name={faqIndex === idx ? 'remove' : 'add'} size={22} color={faqIndex === idx ? '#a78bfa' : '#6366f1'} />
                </TouchableOpacity>
                {faqIndex === idx && (
                  <Text style={styles.accordionDesc}>{item.answer}</Text>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  floating: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.18,
    zIndex: 0,
  },
  floating1: {
    width: 220,
    height: 220,
    backgroundColor: '#a78bfa',
    top: -60,
    right: -60,
  },
  floating2: {
    width: 160,
    height: 160,
    backgroundColor: '#6366f1',
    bottom: -50,
    left: -50,
  },
  floating3: {
    width: 120,
    height: 120,
    backgroundColor: '#7c3aed',
    top: width * 0.4,
    left: width * 0.2,
  },
  floatingDot: {
    position: 'absolute',
    opacity: 0.25,
    zIndex: 1,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 24,
    marginTop: 32,
    marginBottom: 24,
    shadowColor: '#a78bfa',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
  },
  badgeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#a78bfa',
    marginRight: 10,
    zIndex: 2,
  },
  badgeText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#23234b',
    zIndex: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#23234b',
    marginBottom: 8,
    lineHeight: 40,
  },
  gradientText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#7c3aed',
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 24,
    paddingHorizontal: 16,
    lineHeight: 26,
  },
  ctaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  ctaButtonPrimary: {
    flex: 1,
    height: 52,
    borderRadius: 28,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    elevation: 2,
  },
  ctaButtonSecondary: {
    flex: 1,
    height: 52,
    borderRadius: 28,
    backgroundColor: 'rgba(167,139,250,0.08)',
    borderWidth: 1,
    borderColor: '#a78bfa',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    flexDirection: 'row',
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    alignItems: 'center',
    marginHorizontal: 6,
    paddingVertical: 18,
    elevation: 2,
    shadowColor: '#a78bfa',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 0,
  },
  statValueBg: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7c3aed',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 2,
  },
  productImageContainer: {
    width: width - 32,
    height: (width - 32) * 0.55,
    alignSelf: 'center',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    marginTop: 8,
    backgroundColor: '#fff',
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  productImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  floatingIcon: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#a78bfa',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  iconTopLeft: {
    top: 8,
    left: 8,
  },
  iconTopRight: {
    top: 8,
    right: 8,
  },
  iconBottomLeft: {
    bottom: 8,
    left: 8,
  },
  iconBottomRight: {
    bottom: 8,
    right: 8,
  },
  scrollIndicatorContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  scrollIndicatorText: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 8,
  },
  scrollIndicatorCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(167,139,250,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
  },
  badgeContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#a78bfa',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
  },
  badgeText2: {
    fontSize: 15,
    fontWeight: '500',
    color: '#23234b',
  },
  problemTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#23234b',
    marginBottom: 8,
  },
  gradientText2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  problemSubtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 24,
  },
  problemCardsColumn: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 24,
  },
  problemCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#fff',
    padding: 18,
    elevation: 2,
    shadowColor: '#a78bfa',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  problemCardNumberBox: {
    backgroundColor: '#a78bfa',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  problemCardNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  problemCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#23234b',
  },
  problemCardDesc: {
    fontSize: 15,
    color: '#6b7280',
  },
  problemExtraStatsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  problemExtraStatCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#fff',
    padding: 18,
    elevation: 2,
    shadowColor: '#a78bfa',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  problemExtraStatIconBox: {
    backgroundColor: '#a78bfa',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  problemExtraStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#23234b',
  },
  problemExtraStatLabel: {
    fontSize: 15,
    color: '#6b7280',
  },
  accordionContainer: {
    marginBottom: 24,
  },
  accordionItem: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#a78bfa',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  accordionItemActive: {
    backgroundColor: '#f8f8ff',
  },
  accordionNumber: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#23234b',
  },
  accordionNumberActive: {
    color: '#a78bfa',
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#23234b',
    marginBottom: 8,
  },
  accordionTitleActive: {
    color: '#a78bfa',
  },
  accordionDesc: {
    fontSize: 15,
    color: '#6b7280',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderBottomWidth: 1,
    borderBottomColor: '#a78bfa',
  },
  logo: {
    width: 40,
    height: 40,
  },
  headerAppName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#23234b',
    marginLeft: 16,
  },
});

export default HomeScreen; 