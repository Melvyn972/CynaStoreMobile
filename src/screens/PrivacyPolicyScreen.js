import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackgroundEffects from '../components/BackgroundEffects';

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8ff' }}>
      <BackgroundEffects />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#7c3aed" />
          <Text style={styles.backText}>Retour à l'accueil</Text>
        </TouchableOpacity>
        {/* Header */}
        <Text style={styles.title}>Politique de Confidentialité</Text>
        <Text style={styles.paragraph}>Dernière mise à jour : 11 juin 2025</Text>
        {/* Responsables de traitement */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Responsables de traitement</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDesc}>Cyna est détenue et exploitée conjointement par trois personnes physiques en qualité de responsables de traitement au sens de l'article 4.7 du RGPD : Melvyn Thierry-Bellefond, Thomas Lindeker, Nijel Sarmiento.</Text>
          </View>
        </View>
        {/* Données collectées et bases légales */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Données collectées et bases légales</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionSubtitle}>1.1 Données d'identification et de contact</Text>
            <Text style={styles.sectionDesc}><Text style={styles.bold}>Données collectées :</Text><br/>• Nom et prénom<br/>• Adresse e-mail professionnelle<br/>• Numéro de téléphone (optionnel)<br/>• Fonction et nom de l'entreprise</Text>
            <Text style={styles.sectionDesc}><Text style={styles.bold}>Base légale :</Text> Exécution du contrat (art. 6.1.b RGPD) et intérêts légitimes (art. 6.1.f RGPD)</Text>
            <Text style={styles.sectionSubtitle}>1.2 Données de connexion et d'utilisation</Text>
            <Text style={styles.sectionDesc}>• Adresse IP (anonymisée après 13 mois)<br/>• Logs de connexion et d'activité<br/>• Données de navigation (pages visitées, durée)<br/>• Informations techniques (navigateur, OS, appareil)<br/>• Cookies d'authentification et de préférence</Text>
            <Text style={styles.sectionDesc}><Text style={styles.bold}>Base légale :</Text> Intérêts légitimes pour la sécurité et l'amélioration des services</Text>
            <Text style={styles.sectionSubtitle}>1.3 Données de cybersécurité</Text>
            <Text style={styles.sectionDesc}>• Configuration de sécurité de votre infrastructure<br/>• Rapports de vulnérabilités (anonymisés)<br/>• Métadonnées des audits de sécurité<br/>• Incidents de sécurité détectés</Text>
            <Text style={styles.sectionDesc}><Text style={styles.bold}>Base légale :</Text> Exécution du contrat et consentement explicite pour les données sensibles</Text>
            <Text style={styles.sectionSubtitle}>1.4 Données de paiement</Text>
            <Text style={styles.sectionDesc}>Les données de paiement sont traitées exclusivement par nos prestataires certifiés PCI-DSS :<br/>• Stripe (certification PCI Level 1)<br/>• PayPal (certifié PCI-DSS)</Text>
            <Text style={styles.sectionDesc}><Text style={styles.bold}>Important :</Text> Aucune donnée bancaire n'est stockée sur nos serveurs</Text>
          </View>
        </View>
        {/* Finalités et durées de conservation */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Finalités et durées de conservation</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDesc}>🔐 Prestation de services de cybersécurité<br/>Exécution des audits, surveillance, réponse aux incidents | <Text style={styles.bold}>Durée :</Text> Durée du contrat + 3 ans</Text>
            <Text style={styles.sectionDesc}>📊 Amélioration et optimisation<br/>Analytics anonymisées, développement produit | <Text style={styles.bold}>Durée :</Text> 25 mois maximum</Text>
            <Text style={styles.sectionDesc}>💬 Support et communication<br/>Support technique, notifications sécuritaires | <Text style={styles.bold}>Durée :</Text> 3 ans après dernière interaction</Text>
            <Text style={styles.sectionDesc}>⚖️ Obligations légales<br/>Conformité réglementaire, obligations comptables | <Text style={styles.bold}>Durée :</Text> 10 ans (Code de commerce)</Text>
            <Text style={styles.sectionDesc}>🛡️ Sécurité et lutte contre la fraude<br/>Détection d'intrusions, prévention des cyberattaques | <Text style={styles.bold}>Durée :</Text> 13 mois pour les IP, 6 ans pour les incidents</Text>
            <Text style={styles.sectionDesc}><Text style={styles.bold}>⚠️ Suppression automatique :</Text> Vos données sont automatiquement supprimées à l'expiration des durées mentionnées, sauf obligation légale contraire.</Text>
          </View>
        </View>
        {/* Vos droits */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Vos droits</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDesc}>Conformément au RGPD, vous disposez des droits suivants :<br/>• Droit d'accès et de rectification<br/>• Droit à l'effacement<br/>• Droit à la limitation du traitement<br/>• Droit à la portabilité des données<br/>• Droit d'opposition</Text>
          </View>
        </View>
        {/* Partage des données et sous-traitants */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Partage des données et sous-traitants</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDesc}>Nous ne vendons ni ne louons vos données. Partage uniquement avec prestataires de paiement, hébergeur, autorités légales, tous RGPD-compliant.</Text>
          </View>
        </View>
        {/* Mesures de sécurité */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mesures de sécurité</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDesc}>Chiffrement, MFA, audits, sauvegardes, formation RGPD, contrôle d'accès, notification en cas de violation.</Text>
          </View>
        </View>
        {/* Cookies et technologies similaires */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Cookies et technologies similaires</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDesc}>Cookies essentiels, analytiques, marketing, gestion via votre espace client ou navigateur.</Text>
          </View>
        </View>
        {/* Contact */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDesc}>Pour toute question relative à vos données personnelles, veuillez nous contacter à :<br/><Text style={styles.link}>supportcyna@gmail.com</Text></Text>
          </View>
        </View>
        <Text style={styles.link}>Cette politique est effective depuis le 11 juin 2025.</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backText: { color: '#7c3aed', fontWeight: 'bold', marginLeft: 6, fontSize: 15 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#23234b', marginBottom: 8, textAlign: 'center' },
  paragraph: { fontSize: 16, color: '#6b7280', marginBottom: 24, textAlign: 'center' },
  card: { backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 24, padding: 20, marginBottom: 24, shadowColor: '#a78bfa', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#23234b', marginBottom: 12 },
  sectionContent: { marginLeft: 12 },
  sectionSubtitle: { fontWeight: 'bold', color: '#23234b', marginBottom: 4 },
  sectionDesc: { color: '#6b7280', marginBottom: 8 },
  link: { color: '#7c3aed', textDecorationLine: 'underline' },
  bold: { fontWeight: 'bold' },
});

export default PrivacyPolicyScreen; 