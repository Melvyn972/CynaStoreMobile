import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const PrivacyPolicyScreen = ({ navigation }) => {
  const { theme, mode } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base100,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingVertical: 40,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: mode === 'dark' ? theme.base200 + '80' : theme.base100 + 'CC',
      borderWidth: 1,
      borderColor: mode === 'dark' ? theme.neutral : theme.base300,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 32,
      alignSelf: 'flex-start',
    },
    backButtonText: {
      fontSize: 14,
      color: theme.baseContent,
      marginLeft: 8,
    },
    header: {
      alignItems: 'center',
      marginBottom: 32,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.baseContent,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.neutralContent,
      textAlign: 'center',
    },
    content: {
      marginBottom: 24,
    },
    sectionContainer: {
      marginBottom: 32,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionNumber: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    sectionNumberText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.primaryContent,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.baseContent,
      flex: 1,
    },
    sectionContent: {
      marginLeft: 36,
    },
    paragraph: {
      fontSize: 14,
      color: theme.baseContent,
      lineHeight: 20,
      marginBottom: 16,
    },
    subsectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.primary,
      marginBottom: 8,
      marginTop: 16,
    },
    infoBox: {
      backgroundColor: mode === 'dark' ? theme.base200 + '80' : theme.base200 + '40',
      borderWidth: 1,
      borderColor: theme.primary + '30',
      borderRadius: theme.borderRadius.xl,
      padding: 16,
      marginBottom: 16,
    },
    infoBoxTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.baseContent,
      marginBottom: 8,
    },
    infoBoxText: {
      fontSize: 12,
      color: theme.neutralContent,
      lineHeight: 18,
    },
    bulletPoint: {
      fontSize: 12,
      color: theme.neutralContent,
      lineHeight: 18,
      marginBottom: 4,
      marginLeft: 16,
    },
    legalBase: {
      fontSize: 11,
      color: theme.primary,
      fontWeight: '500',
      marginTop: 8,
    },
    rightCard: {
      backgroundColor: theme.success + '20',
      borderWidth: 1,
      borderColor: theme.success + '30',
      borderRadius: theme.borderRadius.xl,
      padding: 12,
      marginBottom: 12,
    },
    rightCardTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.success,
      marginBottom: 4,
    },
    rightCardText: {
      fontSize: 11,
      color: theme.success,
      lineHeight: 16,
    },
    warningBox: {
      backgroundColor: theme.warning + '20',
      borderWidth: 1,
      borderColor: theme.warning + '30',
      borderRadius: theme.borderRadius.xl,
      padding: 12,
      marginBottom: 16,
    },
    warningText: {
      fontSize: 12,
      color: theme.warning,
      fontWeight: '500',
    },
    contactBox: {
      backgroundColor: mode === 'dark' ? theme.base200 + '80' : theme.base100 + 'CC',
      borderRadius: theme.borderRadius.xl,
      padding: 16,
      marginTop: 24,
    },
    contactTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.baseContent,
      marginBottom: 12,
    },
    contactText: {
      fontSize: 12,
      color: theme.neutralContent,
      lineHeight: 18,
      marginBottom: 8,
    },
    emailLink: {
      color: theme.primary,
      fontWeight: '500',
    },
    finalMessage: {
      textAlign: 'center',
      marginTop: 32,
      paddingTop: 24,
      borderTopWidth: 1,
      borderTopColor: mode === 'dark' ? theme.neutral : theme.base300,
    },
    finalTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.primary,
      marginBottom: 8,
    },
    finalSubtitle: {
      fontSize: 12,
      color: theme.neutralContent,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Bouton retour */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Retour à l'accueil</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
        <Text style={styles.title}>Politique de Confidentialité</Text>
          <Text style={styles.subtitle}>Dernière mise à jour : 11 juin 2025</Text>
        </View>

        {/* Introduction */}
        <View style={styles.content}>
          <Text style={styles.paragraph}>
            Cette Politique de Confidentialité décrit comment nous collectons, utilisons, stockons et protégeons vos données personnelles dans le cadre de l'utilisation de notre plateforme de cybersécurité accessible à l'adresse https://cyna.fr ("la Plateforme") et de nos services SaaS de cybersécurité pour PME et MSP.
          </Text>
          <Text style={styles.paragraph}>
            Cette politique est conforme au Règlement Général sur la Protection des Données (RGPD) et aux dernières directives de la CNIL 2024.
          </Text>
        </View>

        {/* Section 1 - Données collectées */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>1</Text>
            </View>
            <Text style={styles.sectionTitle}>Données collectées et bases légales</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <Text style={styles.subsectionTitle}>1.1 Données d'identification et de contact</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>Données collectées :</Text>
              <Text style={styles.bulletPoint}>• Nom et prénom</Text>
              <Text style={styles.bulletPoint}>• Adresse e-mail professionnelle</Text>
              <Text style={styles.bulletPoint}>• Numéro de téléphone (optionnel)</Text>
              <Text style={styles.bulletPoint}>• Fonction et nom de l'entreprise</Text>
              <Text style={styles.legalBase}>
                Base légale : Exécution du contrat (art. 6.1.b RGPD) et intérêts légitimes (art. 6.1.f RGPD)
              </Text>
            </View>

            <Text style={styles.subsectionTitle}>1.2 Données de connexion et d'utilisation</Text>
            <View style={styles.infoBox}>
              <Text style={styles.bulletPoint}>• Adresse IP (anonymisée après 13 mois)</Text>
              <Text style={styles.bulletPoint}>• Logs de connexion et d'activité</Text>
              <Text style={styles.bulletPoint}>• Données de navigation (pages visitées, durée)</Text>
              <Text style={styles.bulletPoint}>• Informations techniques (navigateur, OS, appareil)</Text>
              <Text style={styles.bulletPoint}>• Cookies d'authentification et de préférence</Text>
              <Text style={styles.legalBase}>
                Base légale : Intérêts légitimes pour la sécurité et l'amélioration des services
              </Text>
            </View>

            <Text style={styles.subsectionTitle}>1.3 Données de cybersécurité</Text>
            <View style={styles.infoBox}>
              <Text style={styles.bulletPoint}>• Configuration de sécurité de votre infrastructure</Text>
              <Text style={styles.bulletPoint}>• Rapports de vulnérabilités (anonymisés)</Text>
              <Text style={styles.bulletPoint}>• Métadonnées des audits de sécurité</Text>
              <Text style={styles.bulletPoint}>• Incidents de sécurité détectés</Text>
              <Text style={styles.legalBase}>
                Base légale : Exécution du contrat et consentement explicite pour les données sensibles
              </Text>
            </View>
          </View>
        </View>

        {/* Section 2 - Finalités et durées */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionNumber, { backgroundColor: theme.success }]}>
              <Text style={styles.sectionNumberText}>2</Text>
            </View>
            <Text style={styles.sectionTitle}>Finalités et durées de conservation</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>🔐 Prestation de services de cybersécurité</Text>
              <Text style={styles.infoBoxText}>Exécution des audits, surveillance, réponse aux incidents | Durée : Durée du contrat + 3 ans</Text>
            </View>
            
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>📊 Amélioration et optimisation</Text>
              <Text style={styles.infoBoxText}>Analytics anonymisées, développement produit | Durée : 25 mois maximum</Text>
            </View>
            
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>💬 Support et communication</Text>
              <Text style={styles.infoBoxText}>Support technique, notifications sécuritaires | Durée : 3 ans après dernière interaction</Text>
            </View>

            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ Suppression automatique : Vos données sont automatiquement supprimées à l'expiration des durées mentionnées, sauf obligation légale contraire.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 3 - Vos droits RGPD */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionNumber, { backgroundColor: theme.secondary }]}>
              <Text style={styles.sectionNumberText}>3</Text>
            </View>
            <Text style={styles.sectionTitle}>Vos droits RGPD</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <Text style={styles.paragraph}>
              Conformément au RGPD, vous disposez des droits suivants que vous pouvez exercer à tout moment :
            </Text>

            <View style={styles.rightCard}>
              <Text style={styles.rightCardTitle}>🔍 Droit d'accès (Art. 15)</Text>
              <Text style={styles.rightCardText}>Obtenir une copie de vos données et informations sur leur traitement</Text>
            </View>

            <View style={styles.rightCard}>
              <Text style={styles.rightCardTitle}>✏️ Droit de rectification (Art. 16)</Text>
              <Text style={styles.rightCardText}>Corriger des données inexactes ou incomplètes</Text>
            </View>

            <View style={styles.rightCard}>
              <Text style={styles.rightCardTitle}>🗑️ Droit d'effacement (Art. 17)</Text>
              <Text style={styles.rightCardText}>Suppression de vos données (sous conditions)</Text>
            </View>

            <View style={styles.rightCard}>
              <Text style={styles.rightCardTitle}>📦 Droit de portabilité (Art. 20)</Text>
              <Text style={styles.rightCardText}>Récupérer vos données dans un format structuré</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>📞 Comment exercer vos droits ?</Text>
              <Text style={styles.infoBoxText}>
                Contactez notre DPO (Nijel Sarmiento) via :
              </Text>
              <Text style={styles.infoBoxText}>
                • Email : <Text style={styles.emailLink}>supportcyna@gmail.com</Text> (objet : "Exercice droits RGPD")
              </Text>
              <Text style={styles.infoBoxText}>• Délai de réponse : 1 mois maximum</Text>
              <Text style={styles.infoBoxText}>• Justificatif d'identité requis pour la sécurité</Text>
            </View>
          </View>
        </View>

        {/* Section 4 - Partage des données */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionNumber, { backgroundColor: theme.info }]}>
              <Text style={styles.sectionNumberText}>4</Text>
            </View>
            <Text style={styles.sectionTitle}>Partage des données et sous-traitants</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <View style={[styles.infoBox, { backgroundColor: theme.success + '20', borderColor: theme.success + '30' }]}>
              <Text style={[styles.infoBoxTitle, { color: theme.success }]}>🔒 Engagement de confidentialité</Text>
              <Text style={[styles.infoBoxText, { color: theme.success }]}>
                Nous ne vendons, n'échangeons ni ne louons jamais vos données personnelles à des tiers à des fins commerciales.
              </Text>
            </View>

            <Text style={styles.infoBoxTitle}>Partage strictement nécessaire avec :</Text>
            
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>🏦 Prestataires de paiement</Text>
              <Text style={styles.infoBoxText}>Stripe, PayPal (certifiés PCI-DSS) - Finalité : traitement sécurisé des paiements</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>☁️ Infrastructure cloud</Text>
              <Text style={styles.infoBoxText}>AWS Europe (GDPR compliant) - Finalité : hébergement sécurisé des données</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>⚖️ Autorités compétentes</Text>
              <Text style={styles.infoBoxText}>Uniquement sur réquisition judiciaire ou obligation légale</Text>
            </View>
          </View>
        </View>

        {/* Section 5 - Mesures de sécurité */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionNumber, { backgroundColor: theme.error }]}>
              <Text style={styles.sectionNumberText}>5</Text>
            </View>
            <Text style={styles.sectionTitle}>Mesures de sécurité (CNIL 2024)</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <Text style={styles.paragraph}>
              Conformément aux dernières directives CNIL 2024, nous mettons en œuvre les mesures techniques et organisationnelles suivantes :
            </Text>

            <View style={[styles.infoBox, { backgroundColor: theme.error + '20', borderColor: theme.error + '30' }]}>
              <Text style={[styles.infoBoxTitle, { color: theme.error }]}>🔐 Sécurité technique</Text>
              <Text style={styles.bulletPoint}>• Chiffrement AES-256 au repos et en transit</Text>
              <Text style={styles.bulletPoint}>• Authentification multi-facteurs obligatoire</Text>
              <Text style={styles.bulletPoint}>• APIs conformes OWASP Top 10</Text>
              <Text style={styles.bulletPoint}>• Audits de sécurité trimestriels</Text>
              <Text style={styles.bulletPoint}>• Sauvegarde chiffrée quotidienne</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>👥 Sécurité organisationnelle</Text>
              <Text style={styles.bulletPoint}>• Formation RGPD annuelle du personnel</Text>
              <Text style={styles.bulletPoint}>• Politique de mots de passe renforcée</Text>
              <Text style={styles.bulletPoint}>• Contrôles d'accès basés sur les rôles</Text>
              <Text style={styles.bulletPoint}>• Traçabilité complète des actions</Text>
              <Text style={styles.bulletPoint}>• Plan de réponse aux incidents</Text>
            </View>

            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                🚨 Notification des violations : En cas de violation de données susceptible d'engendrer un risque pour vos droits et libertés, nous vous notifierons dans les 72 heures suivant la découverte, conformément à l'article 34 du RGPD.
              </Text>
            </View>
          </View>
        </View>

        {/* Contact et réclamation */}
        <View style={styles.contactBox}>
          <Text style={styles.contactTitle}>📞 Nous contacter</Text>
          <Text style={styles.contactText}>
            Email : <Text style={styles.emailLink}>supportcyna@gmail.com</Text>
          </Text>
          <Text style={styles.contactText}>Délai de réponse : 1 mois maximum (RGPD)</Text>
          <Text style={styles.contactText}>Objet email : "RGPD - [votre demande]"</Text>
          
          <Text style={[styles.contactTitle, { marginTop: 16 }]}>⚖️ Droit de réclamation</Text>
          <Text style={styles.contactText}>
            Si vous estimez que le traitement de vos données personnelles constitue une violation du RGPD, vous avez le droit d'introduire une réclamation auprès de l'autorité de contrôle compétente :
          </Text>
          <Text style={styles.contactText}>
            CNIL (Commission Nationale de l'Informatique et des Libertés)
          </Text>
          <Text style={styles.contactText}>
            3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07
          </Text>
          <Text style={styles.contactText}>
            Tél : 01 53 73 22 22 | Web : www.cnil.fr
          </Text>
        </View>

        {/* Message final */}
        <View style={styles.finalMessage}>
          <Text style={styles.finalTitle}>
            🛡️ Merci de nous faire confiance pour protéger vos données
          </Text>
          <Text style={styles.finalSubtitle}>
            Cette politique est effective depuis le 11 juin 2025 et remplace toutes les versions précédentes.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen; 