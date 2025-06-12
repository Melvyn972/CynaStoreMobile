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

const LegalMentionsScreen = ({ navigation }) => {
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
      marginBottom: 4,
    },
    bulletPoint: {
      fontSize: 12,
      color: theme.neutralContent,
      lineHeight: 18,
      marginBottom: 4,
      marginLeft: 16,
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
    editorCardFull: {
      width: '100%',
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
    contactInfo: {
      backgroundColor: mode === 'dark' ? theme.base300 + '40' : theme.base200 + '60',
      borderRadius: theme.borderRadius.xl,
      padding: 16,
      marginBottom: 16,
    },
    contactTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.baseContent,
      marginBottom: 8,
    },
    contactText: {
      fontSize: 12,
      color: theme.neutralContent,
      lineHeight: 18,
      marginBottom: 4,
    },
    emailLink: {
      color: theme.primary,
      fontWeight: '500',
    },
    websiteLink: {
      color: theme.primary,
      fontWeight: '500',
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
    infoBoxBlue: {
      backgroundColor: theme.info + '20',
      borderWidth: 1,
      borderColor: theme.info + '30',
      borderRadius: theme.borderRadius.xl,
      padding: 12,
      marginBottom: 16,
    },
    infoTextBlue: {
      fontSize: 12,
      color: theme.info,
      fontWeight: '500',
    },
    contactGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    contactCard: {
      backgroundColor: mode === 'dark' ? theme.base200 + '80' : theme.base100 + 'CC',
      borderRadius: theme.borderRadius.xl,
      padding: 16,
      width: '48%',
    },
    contactCardFull: {
      width: '100%',
    },
    finalMessage: {
      textAlign: 'center',
      marginTop: 32,
      paddingTop: 24,
      borderTopWidth: 1,
      borderTopColor: mode === 'dark' ? theme.neutral : theme.base300,
    },
    finalText: {
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
          <Text style={styles.title}>Mentions Légales</Text>
          <Text style={styles.subtitle}>Informations légales obligatoires</Text>
        </View>

        {/* Section 1 - Identification de l'éditeur */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>1</Text>
            </View>
            <Text style={styles.sectionTitle}>Identification de l'éditeur</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>🏢 Structure juridique</Text>
              <Text style={styles.infoBoxText}>
                La plateforme Cyna est éditée conjointement par trois personnes physiques agissant en copropriété :
              </Text>
            </View>

            <View style={styles.editorsGrid}>
              <View style={styles.editorCard}>
                <Text style={styles.editorName}>Melvyn Thierry-Bellefond</Text>
                <Text style={styles.editorRole}>Personne physique</Text>
                <Text style={styles.editorDescription}>Responsable technique et design</Text>
                <Text style={styles.editorDescription}>Co-éditeur - Part : 1/3</Text>
              </View>
              <View style={styles.editorCard}>
                <Text style={styles.editorName}>Thomas Lindeker</Text>
                <Text style={styles.editorRole}>Personne physique</Text>
                <Text style={styles.editorDescription}>Responsable infrastructure</Text>
                <Text style={styles.editorDescription}>Co-éditeur - Part : 1/3</Text>
              </View>
              <View style={[styles.editorCard, styles.editorCardFull]}>
                <Text style={styles.editorName}>Nijel Sarmiento</Text>
                <Text style={styles.editorRole}>Personne physique</Text>
                <Text style={styles.editorDescription}>DPO et support client</Text>
                <Text style={styles.editorDescription}>Co-éditeur - Part : 1/3</Text>
              </View>
            </View>

            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>📧 Contact éditeur</Text>
              <Text style={styles.contactText}>
                Email : <Text style={styles.emailLink}>supportcyna@gmail.com</Text>
              </Text>
              <Text style={styles.contactText}>
                Site web : <Text style={styles.websiteLink}>https://cyna.fr</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Section 2 - Hébergement et infrastructure */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionNumber, { backgroundColor: theme.success }]}>
              <Text style={styles.sectionNumberText}>2</Text>
            </View>
            <Text style={styles.sectionTitle}>Hébergement et infrastructure</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <View style={styles.successBox}>
              <Text style={styles.infoBoxTitle}>☁️ Hébergeur principal</Text>
              <Text style={styles.successText}>Amazon Web Services Europe</Text>
              <Text style={styles.successText}>AWS Europe (Ireland) Limited</Text>
              <Text style={styles.successText}>One Burlington Plaza, Burlington Road</Text>
              <Text style={styles.successText}>Dublin 4, D04 E4X0, Irlande</Text>
              <Text style={styles.successText}>Site web : aws.amazon.com</Text>
            </View>

            <View style={styles.infoBoxBlue}>
              <Text style={styles.infoBoxTitle}>🌐 Services techniques</Text>
              <Text style={styles.bulletPoint}>• CDN : Cloudflare Inc. (États-Unis) - Conformité GDPR</Text>
              <Text style={styles.bulletPoint}>• DNS : Cloudflare (Données hébergées en Europe)</Text>
              <Text style={styles.bulletPoint}>• Monitoring : Infrastructure européenne exclusivement</Text>
              <Text style={styles.bulletPoint}>• Base de données : AWS RDS Europe (Dublin)</Text>
            </View>
          </View>
        </View>

        {/* Section 3 - Directeur de publication et modération */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionNumber, { backgroundColor: theme.secondary }]}>
              <Text style={styles.sectionNumberText}>3</Text>
            </View>
            <Text style={styles.sectionTitle}>Directeur de publication et modération</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>📝 Direction de la publication</Text>
              <Text style={styles.infoBoxText}>
                La direction de la publication est assurée collégialement par les trois co-éditeurs :
              </Text>
              <Text style={styles.bulletPoint}>• Melvyn Thierry-Bellefond - Contenu technique et design</Text>
              <Text style={styles.bulletPoint}>• Thomas Lindeker - Documentation infrastructure</Text>
              <Text style={styles.bulletPoint}>• Nijel Sarmiento - Contenu juridique et support</Text>
            </View>

            <View style={styles.warningBox}>
              <Text style={styles.infoBoxTitle}>🛡️ Modération des contenus</Text>
              <Text style={styles.warningText}>
                La plateforme Cyna étant à usage professionnel B2B, les contenus utilisateurs sont principalement constitués de données techniques de cybersécurité. Une modération automatique et manuelle est mise en place pour garantir la qualité et la conformité des contenus.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 4 - Propriété intellectuelle */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionNumber, { backgroundColor: theme.error }]}>
              <Text style={styles.sectionNumberText}>4</Text>
            </View>
            <Text style={styles.sectionTitle}>Propriété intellectuelle et droits d'auteur</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <View style={styles.errorBox}>
              <Text style={styles.infoBoxTitle}>© Droits réservés</Text>
              <Text style={styles.errorText}>
                L'ensemble de la plateforme Cyna est protégé par le droit d'auteur français et international :
              </Text>
              <Text style={styles.bulletPoint}>• Code source : © 2024 Melvyn Thierry-Bellefond, Thomas Lindeker, Nijel Sarmiento</Text>
              <Text style={styles.bulletPoint}>• Design et interface : © 2024 Melvyn Thierry-Bellefond</Text>
              <Text style={styles.bulletPoint}>• Documentation : © 2024 Nijel Sarmiento</Text>
              <Text style={styles.bulletPoint}>• Architecture : © 2024 Thomas Lindeker</Text>
            </View>

            <View style={styles.warningBox}>
              <Text style={styles.infoBoxTitle}>🔒 Licences et autorisations</Text>
              <Text style={styles.warningText}>
                Toute utilisation, reproduction, représentation, modification ou exploitation de tout ou partie de la plateforme sans autorisation écrite des titulaires des droits est strictement interdite et constitue une contrefaçon sanctionnée par les articles L. 335-2 et suivants du Code de la propriété intellectuelle.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 5 - Données personnelles et RGPD */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionNumber, { backgroundColor: theme.info }]}>
              <Text style={styles.sectionNumberText}>5</Text>
            </View>
            <Text style={styles.sectionTitle}>Données personnelles et RGPD</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <View style={styles.infoBoxBlue}>
              <Text style={styles.infoBoxTitle}>🛡️ Responsables de traitement</Text>
              <Text style={styles.infoTextBlue}>
                Les trois co-éditeurs sont conjointement responsables du traitement des données personnelles :
              </Text>
              <Text style={styles.infoTextBlue}>
                Délégué à la Protection des Données (DPO) : Nijel Sarmiento
              </Text>
              <Text style={styles.infoTextBlue}>
                Contact DPO : supportcyna@gmail.com (objet : "RGPD - [votre demande]")
              </Text>
            </View>

            <View style={styles.infoBoxBlue}>
              <Text style={styles.infoBoxTitle}>📋 Documentation RGPD</Text>
              <Text style={styles.infoTextBlue}>
                Pour toutes informations sur le traitement de vos données personnelles, consultez notre Politique de confidentialité qui détaille vos droits, nos obligations et les mesures de sécurité mises en place.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 6 - Cookies et traceurs */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionNumber, { backgroundColor: theme.accent }]}>
              <Text style={styles.sectionNumberText}>6</Text>
            </View>
            <Text style={styles.sectionTitle}>Cookies et traceurs</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>🍪 Utilisation des cookies</Text>
              <Text style={styles.infoBoxText}>
                Conformément à l'article 82 de la loi Informatique et Libertés et aux directives CNIL, nous utilisons des cookies pour :
              </Text>
              <Text style={styles.bulletPoint}>• Assurer le fonctionnement technique de la plateforme</Text>
              <Text style={styles.bulletPoint}>• Améliorer l'expérience utilisateur (avec votre consentement)</Text>
              <Text style={styles.bulletPoint}>• Mesurer l'audience de manière anonymisée (avec votre consentement)</Text>
              <Text style={styles.bulletPoint}>• Garantir la sécurité des connexions</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxText}>
                ⚙️ Gestion : Vous pouvez à tout moment modifier vos préférences de cookies via votre espace client ou les paramètres de votre navigateur.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 7 - Droit applicable et juridictions */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionNumber, { backgroundColor: theme.warning }]}>
              <Text style={styles.sectionNumberText}>7</Text>
            </View>
            <Text style={styles.sectionTitle}>Droit applicable et juridictions</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <View style={styles.warningBox}>
              <Text style={styles.infoBoxTitle}>⚖️ Droit français</Text>
              <Text style={styles.warningText}>
                Les présentes mentions légales sont régies par le droit français. En cas de litige, et après tentative de résolution amiable, les tribunaux français seront seuls compétents.
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>🏛️ Autorités compétentes</Text>
              <Text style={styles.bulletPoint}>• CNIL : Protection des données personnelles</Text>
              <Text style={styles.bulletPoint}>• INPI : Propriété intellectuelle</Text>
              <Text style={styles.bulletPoint}>• ARCOM : Communication audiovisuelle</Text>
              <Text style={styles.bulletPoint}>• Médiateur de la consommation : Litiges commerciaux</Text>
            </View>
          </View>
        </View>

        {/* Section 8 - Contact et signalement */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionNumber, { backgroundColor: theme.neutral }]}>
              <Text style={styles.sectionNumberText}>8</Text>
            </View>
            <Text style={styles.sectionTitle}>Contact et signalement</Text>
          </View>
          
          <View style={styles.sectionContent}>
            <View style={styles.contactGrid}>
              <View style={styles.contactCard}>
                <Text style={styles.contactTitle}>📞 Contact général</Text>
                <Text style={styles.contactText}>
                  Email : <Text style={styles.emailLink}>supportcyna@gmail.com</Text>
                </Text>
                <Text style={styles.contactText}>Réponse : 48h ouvrées maximum</Text>
                <Text style={styles.contactText}>Langue : Français, Anglais</Text>
              </View>
              
              <View style={styles.contactCard}>
                <Text style={styles.contactTitle}>🚨 Signalement</Text>
                <Text style={styles.contactText}>Contenu illicite : Objet "SIGNALEMENT"</Text>
                <Text style={styles.contactText}>Violation droits : Objet "VIOLATION PI"</Text>
                <Text style={styles.contactText}>Incident sécurité : Objet "INCIDENT"</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Message final */}
        <View style={styles.finalMessage}>
          <Text style={styles.finalText}>
            Mentions légales mises à jour le 11 juin 2025 • Conformes au droit français en vigueur
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LegalMentionsScreen; 