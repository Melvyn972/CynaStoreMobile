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

const TermsScreen = ({ navigation }) => {
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
    editorsBox: {
      backgroundColor: mode === 'dark' ? theme.base200 + '80' : theme.base100 + 'CC',
      borderRadius: theme.borderRadius['2xl'],
      padding: 24,
      marginBottom: 32,
      borderWidth: 1,
      borderColor: mode === 'dark' ? theme.neutral : theme.base300,
    },
    editorsTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.baseContent,
      marginBottom: 16,
    },
    editorsDescription: {
      fontSize: 14,
      color: theme.baseContent,
      marginBottom: 16,
      lineHeight: 20,
    },
    editorsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    editorCard: {
      backgroundColor: mode === 'dark' ? theme.base300 + '40' : theme.base200 + '60',
      borderRadius: theme.borderRadius.xl,
      padding: 16,
      marginBottom: 12,
      width: '48%',
    },
    editorName: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.primary,
      marginBottom: 4,
    },
    editorRole: {
      fontSize: 12,
      color: theme.neutralContent,
      marginBottom: 2,
    },
    editorDescription: {
      fontSize: 10,
      color: theme.neutralContent,
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
      color: theme.baseContent,
      marginBottom: 12,
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
    checkItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    checkIcon: {
      fontSize: 12,
      color: theme.success,
      marginRight: 8,
      marginTop: 2,
    },
    checkText: {
      fontSize: 12,
      color: theme.neutralContent,
      flex: 1,
      lineHeight: 18,
    },
    prohibitedItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    prohibitedIcon: {
      fontSize: 12,
      color: theme.error,
      marginRight: 8,
      marginTop: 2,
    },
    prohibitedText: {
      fontSize: 12,
      color: theme.neutralContent,
      flex: 1,
      lineHeight: 18,
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
    successBox: {
      backgroundColor: theme.success + '20',
      borderWidth: 1,
      borderColor: theme.success + '30',
      borderRadius: theme.borderRadius.xl,
      padding: 12,
      marginBottom: 16,
    },
    successText: {
      fontSize: 12,
      color: theme.success,
      fontWeight: '500',
    },
    errorBox: {
      backgroundColor: theme.error + '20',
      borderWidth: 1,
      borderColor: theme.error + '30',
      borderRadius: theme.borderRadius.xl,
      padding: 12,
      marginBottom: 16,
    },
    errorText: {
      fontSize: 12,
      color: theme.error,
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
          <Text style={styles.title}>Conditions Générales d'Utilisation</Text>
          <Text style={styles.subtitle}>Dernière mise à jour : 11 juin 2025</Text>
        </View>

        {/* Éditeurs et responsables */}
        <View style={styles.editorsBox}>
          <Text style={styles.editorsTitle}>Éditeurs et responsables</Text>
          <Text style={styles.editorsDescription}>
            La plateforme Cyna est éditée et exploitée conjointement par trois personnes physiques agissant en copropriété :
          </Text>
          <View style={styles.editorsGrid}>
            <View style={styles.editorCard}>
              <Text style={styles.editorName}>Melvyn Thierry-Bellefond</Text>
              <Text style={styles.editorRole}>Frontend & Design</Text>
              <Text style={styles.editorDescription}>Responsable technique</Text>
            </View>
            <View style={styles.editorCard}>
              <Text style={styles.editorName}>Thomas Lindeker</Text>
              <Text style={styles.editorRole}>Backend & Base de données</Text>
              <Text style={styles.editorDescription}>Responsable infrastructure</Text>
            </View>
            <View style={[styles.editorCard, { width: '100%' }]}>
              <Text style={styles.editorName}>Nijel Sarmiento</Text>
              <Text style={styles.editorRole}>Documentation & Support RGPD</Text>
              <Text style={styles.editorDescription}>Délégué à la protection des données</Text>
            </View>
          </View>
        </View>

        {/* Introduction */}
        <View style={styles.content}>
          <Text style={styles.paragraph}>
            Les présentes Conditions Générales d'Utilisation ("CGU") définissent les modalités d'accès et d'utilisation de la plateforme de cybersécurité Cyna accessible à l'adresse https://cyna.fr ("la Plateforme") ainsi que des services de cybersécurité associés ("les Services").
          </Text>
          
          <View style={styles.infoBox}>
            <Text style={styles.successText}>
              ⚖️ Acceptation : L'accès et l'utilisation de la Plateforme impliquent l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
            </Text>
          </View>
        </View>

        {/* Section 1 - Objet et présentation des services */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>1</Text>
            </View>
            <Text style={styles.sectionTitle}>Objet et présentation des services</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <Text style={styles.paragraph}>
              Cyna est une plateforme de cybersécurité spécialisée pour les PME (Petites et Moyennes Entreprises) et MSP (Managed Service Providers). Nous proposons une approche intégrée de la sécurité informatique combinant expertise technique, outils automatisés et accompagnement personnalisé.
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>🛡️ Services de cybersécurité</Text>
              <Text style={styles.bulletPoint}>• Audits de sécurité automatisés</Text>
              <Text style={styles.bulletPoint}>• Surveillance continue des menaces</Text>
              <Text style={styles.bulletPoint}>• Détection et réponse aux incidents</Text>
              <Text style={styles.bulletPoint}>• Mise en conformité réglementaire</Text>
              <Text style={styles.bulletPoint}>• Formation et sensibilisation</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>💎 Notre engagement qualité</Text>
              <Text style={styles.bulletPoint}>• Expertise technique certifiée</Text>
              <Text style={styles.bulletPoint}>• Proximité et réactivité</Text>
              <Text style={styles.bulletPoint}>• Solutions sur mesure</Text>
              <Text style={styles.bulletPoint}>• Support client premium</Text>
              <Text style={styles.bulletPoint}>• Innovation continue</Text>
            </View>

            <View style={styles.successBox}>
              <Text style={styles.successText}>
                🎯 Mission : Démocratiser l'accès à une cybersécurité de niveau entreprise pour les PME et faciliter le travail des MSP avec des outils professionnels et intuitifs.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 2 - Conditions d'accès et d'inscription */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionNumber, { backgroundColor: theme.success }]}>
              <Text style={styles.sectionNumberText}>2</Text>
            </View>
            <Text style={styles.sectionTitle}>Conditions d'accès et d'inscription</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <View style={styles.successBox}>
              <Text style={styles.successText}>
                🏢 Services B2B exclusivement : Nos services s'adressent exclusivement aux entreprises, professionnels indépendants et MSP. L'inscription par des particuliers à titre personnel est interdite.
              </Text>
            </View>

            <Text style={styles.subsectionTitle}>Conditions requises pour l'inscription :</Text>
            
            <View style={styles.checkItem}>
              <Text style={styles.checkIcon}>✓</Text>
              <Text style={styles.checkText}>Être majeur (18 ans minimum) et avoir la capacité juridique</Text>
            </View>
            <View style={styles.checkItem}>
              <Text style={styles.checkIcon}>✓</Text>
              <Text style={styles.checkText}>Disposer d'une adresse email professionnelle valide</Text>
            </View>
            <View style={styles.checkItem}>
              <Text style={styles.checkIcon}>✓</Text>
              <Text style={styles.checkText}>Agir pour le compte d'une entreprise ou d'une organisation</Text>
            </View>
            <View style={styles.checkItem}>
              <Text style={styles.checkIcon}>✓</Text>
              <Text style={styles.checkText}>Fournir des informations exactes et à jour</Text>
            </View>
            <View style={styles.checkItem}>
              <Text style={styles.checkIcon}>✓</Text>
              <Text style={styles.checkText}>Accepter les présentes CGU et la Politique de confidentialité</Text>
            </View>

            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ Responsabilité : Vous êtes responsable de la confidentialité de vos identifiants de connexion. Tout accès à votre compte est présumé effectué par vous-même.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 3 - Propriété intellectuelle */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionNumber, { backgroundColor: theme.secondary }]}>
              <Text style={styles.sectionNumberText}>3</Text>
            </View>
            <Text style={styles.sectionTitle}>Propriété intellectuelle et droits d'auteur</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>© Droits des copropriétaires</Text>
              <Text style={styles.infoBoxText}>
                La plateforme Cyna, son code source, son design et tous ses éléments sont protégés par le droit d'auteur et sont la propriété conjointe de :
              </Text>
              <Text style={styles.bulletPoint}>• Melvyn Thierry-Bellefond (développement frontend et design)</Text>
              <Text style={styles.bulletPoint}>• Thomas Lindeker (développement backend et infrastructure)</Text>
              <Text style={styles.bulletPoint}>• Nijel Sarmiento (documentation et processus)</Text>
            </View>

            <Text style={styles.subsectionTitle}>Éléments protégés :</Text>
            <View style={styles.prohibitedItem}>
              <Text style={styles.prohibitedIcon}>⊗</Text>
              <Text style={styles.prohibitedText}>Code source et algorithmes</Text>
            </View>
            <View style={styles.prohibitedItem}>
              <Text style={styles.prohibitedIcon}>⊗</Text>
              <Text style={styles.prohibitedText}>Interface utilisateur et design</Text>
            </View>
            <View style={styles.prohibitedItem}>
              <Text style={styles.prohibitedIcon}>⊗</Text>
              <Text style={styles.prohibitedText}>Logos, marques et identité visuelle</Text>
            </View>
            <View style={styles.prohibitedItem}>
              <Text style={styles.prohibitedIcon}>⊗</Text>
              <Text style={styles.prohibitedText}>Documentation technique</Text>
            </View>
            <View style={styles.prohibitedItem}>
              <Text style={styles.prohibitedIcon}>⊗</Text>
              <Text style={styles.prohibitedText}>Méthodologies et processus</Text>
            </View>
            <View style={styles.prohibitedItem}>
              <Text style={styles.prohibitedIcon}>⊗</Text>
              <Text style={styles.prohibitedText}>Bases de données et contenus</Text>
            </View>

            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                🚫 Utilisations interdites : Toute reproduction, distribution, modification, transmission, republication, exploitation commerciale ou création d'œuvres dérivées sans autorisation écrite préalable est strictement interdite et constitue une contrefaçon passible de sanctions pénales.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 4 - Utilisation des services */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionNumber, { backgroundColor: theme.warning }]}>
              <Text style={styles.sectionNumberText}>4</Text>
            </View>
            <Text style={styles.sectionTitle}>Utilisation des services et obligations de l'utilisateur</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <View style={styles.successBox}>
              <Text style={styles.infoBoxTitle}>✅ Utilisation autorisée</Text>
              <Text style={styles.bulletPoint}>• Utilisation conforme aux finalités de cybersécurité</Text>
              <Text style={styles.bulletPoint}>• Respect des conditions techniques d'utilisation</Text>
              <Text style={styles.bulletPoint}>• Utilisation dans le cadre professionnel uniquement</Text>
              <Text style={styles.bulletPoint}>• Respect de la confidentialité des données tierces</Text>
            </View>

            <View style={styles.errorBox}>
              <Text style={styles.infoBoxTitle}>🚫 Utilisations interdites</Text>
              <Text style={styles.bulletPoint}>• Tentatives de piratage ou d'intrusion</Text>
              <Text style={styles.bulletPoint}>• Diffusion de malwares ou contenus malveillants</Text>
              <Text style={styles.bulletPoint}>• Utilisation pour des activités illégales</Text>
              <Text style={styles.bulletPoint}>• Partage d'accès avec des tiers non autorisés</Text>
              <Text style={styles.bulletPoint}>• Surcharge intentionnelle de l'infrastructure</Text>
              <Text style={styles.bulletPoint}>• Rétro-ingénierie ou tentatives de contournement</Text>
            </View>

            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ Sanctions : Toute violation de ces conditions peut entraîner la suspension immédiate de votre accès et des poursuites judiciaires.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 5 - Protection des données */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionNumber, { backgroundColor: theme.info }]}>
              <Text style={styles.sectionNumberText}>5</Text>
            </View>
            <Text style={styles.sectionTitle}>Protection des données et vie privée</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <Text style={styles.paragraph}>
              Le traitement de vos données personnelles est essentiel au fonctionnement de nos services de cybersécurité. Nous collectons et traitons vos données dans le strict respect du RGPD et des dernières directives CNIL 2024.
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>📊 Données collectées</Text>
              <Text style={styles.bulletPoint}>• Informations d'identification professionnelle</Text>
              <Text style={styles.bulletPoint}>• Données de connexion et d'utilisation</Text>
              <Text style={styles.bulletPoint}>• Métadonnées de sécurité (anonymisées)</Text>
              <Text style={styles.bulletPoint}>• Préférences et paramètres utilisateur</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>🛡️ Vos droits</Text>
              <Text style={styles.bulletPoint}>• Accès et rectification de vos données</Text>
              <Text style={styles.bulletPoint}>• Effacement et portabilité</Text>
              <Text style={styles.bulletPoint}>• Opposition et limitation du traitement</Text>
              <Text style={styles.bulletPoint}>• Gestion des consentements</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxText}>
                📋 Documentation complète : Consultez notre Politique de confidentialité pour plus de détails sur le traitement de vos données, vos droits et nos mesures de sécurité.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 6 - Responsabilité et garanties */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionNumber, { backgroundColor: theme.accent }]}>
              <Text style={styles.sectionNumberText}>6</Text>
            </View>
            <Text style={styles.sectionTitle}>Responsabilité et garanties</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>🎯 Notre engagement</Text>
              <Text style={styles.infoBoxText}>
                Nous nous engageons à fournir des services de cybersécurité conformes aux meilleures pratiques du secteur et aux standards industriels. Nous mettons en œuvre tous les moyens raisonnables pour assurer la disponibilité et la sécurité de la plateforme.
              </Text>
            </View>

            <View style={styles.warningBox}>
              <Text style={styles.infoBoxTitle}>⚠️ Limites de responsabilité</Text>
              <Text style={styles.bulletPoint}>• Les services sont fournis "en l'état" sans garantie de résultat absolu</Text>
              <Text style={styles.bulletPoint}>• Nous ne pouvons garantir une sécurité à 100% (aucune solution n'est infaillible)</Text>
              <Text style={styles.bulletPoint}>• Notre responsabilité est limitée aux dommages directs et prévisibles</Text>
              <Text style={styles.bulletPoint}>• Exclusion de responsabilité pour les dommages indirects ou immatériels</Text>
            </View>

            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                🛡️ Votre responsabilité : Vous restez responsable de la sécurité globale de votre système d'information, de la formation de vos équipes et de l'application des recommandations que nous formulons. Nos services constituent un accompagnement et non une garantie absolue.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 7 - Droit applicable */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionNumber, { backgroundColor: theme.error }]}>
              <Text style={styles.sectionNumberText}>7</Text>
            </View>
            <Text style={styles.sectionTitle}>Droit applicable et juridiction</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>⚖️ Droit français</Text>
              <Text style={styles.infoBoxText}>
                Les présentes CGU sont régies par le droit français. Elles sont rédigées en langue française. En cas de traduction, seule la version française fait foi.
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>🏛️ Résolution des litiges</Text>
              <Text style={styles.infoBoxText}>1. Résolution amiable : Nous privilégions le dialogue pour résoudre tout différend.</Text>
              <Text style={styles.infoBoxText}>2. Médiation : En cas d'échec, recours possible à la médiation professionnelle.</Text>
              <Text style={styles.infoBoxText}>3. Juridiction : À défaut d'accord, les tribunaux français sont seuls compétents.</Text>
            </View>
          </View>
        </View>

        {/* Contact */}
        <View style={styles.contactBox}>
          <Text style={styles.contactTitle}>📞 Nous contacter</Text>
          <Text style={styles.contactText}>
            Support technique : <Text style={styles.emailLink}>supportcyna@gmail.com</Text>
          </Text>
          <Text style={styles.contactText}>Questions juridiques : Objet "Juridique - [votre question]"</Text>
          <Text style={styles.contactText}>Délai de réponse : 48h ouvrées maximum</Text>
        </View>

        {/* Message final */}
        <View style={styles.finalMessage}>
          <Text style={styles.finalTitle}>
            🛡️ Merci de faire confiance à Cyna pour votre cybersécurité
          </Text>
          <Text style={styles.finalSubtitle}>
            Ces conditions sont effectives depuis le 11 juin 2025 • Version 2.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsScreen; 