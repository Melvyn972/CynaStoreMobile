import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackgroundEffects from '../components/BackgroundEffects';

const SectionCard = ({ color, icon, title, children }) => (
  <View style={[styles.card, { borderColor: color, backgroundColor: color + '10' }]}>  
    <View style={styles.cardHeader}>
      <Ionicons name={icon} size={22} color={color} style={styles.cardIcon} />
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
    </View>
    {children}
  </View>
);

const Bullet = ({ color, children }) => (
  <View style={styles.bulletRow}>
    <Ionicons name="ellipse" size={10} color={color} style={{ marginTop: 3 }} />
    <Text style={styles.bulletText}>{children}</Text>
  </View>
);

const AlertBox = ({ color, icon, children }) => (
  <View style={[styles.alertBox, { borderColor: color + '99', backgroundColor: color + '15' }]}>  
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
      <Ionicons name={icon} size={18} color={color} style={{ marginRight: 6 }} />
      <Text style={[styles.alertTitle, { color }]}>{children[0]}</Text>
    </View>
    <Text style={styles.alertDesc}>{children[1]}</Text>
  </View>
);

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8ff' }}>
      <BackgroundEffects />
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#7c3aed" />
          <Text style={styles.backText}>Retour à l'accueil</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Politique de Confidentialité</Text>
        <Text style={styles.paragraph}>Dernière mise à jour : 11 juin 2025</Text>

        <SectionCard color="#0ea5e9" icon="people" title="Responsables de traitement">
          <Text style={styles.sectionDesc}>Cyna est détenue et exploitée conjointement par trois personnes physiques en qualité de responsables de traitement au sens de l'article 4.7 du RGPD :</Text>
          <View style={styles.editorsRow}>
            <View style={styles.editorCard}><Text style={styles.editorName}>Melvyn Thierry-Bellefond</Text><Text style={styles.editorRole}>Frontend & Design</Text></View>
            <View style={styles.editorCard}><Text style={styles.editorName}>Thomas Lindeker</Text><Text style={styles.editorRole}>Backend & Base de données</Text></View>
            <View style={styles.editorCard}><Text style={styles.editorName}>Nijel Sarmiento</Text><Text style={styles.editorRole}>Documentation & Support RGPD</Text></View>
          </View>
        </SectionCard>

        <SectionCard color="#a78bfa" icon="document-text" title="Introduction">
          <Text style={styles.sectionDesc}>Cette Politique de Confidentialité décrit comment nous collectons, utilisons, stockons et protégeons vos données personnelles dans le cadre de l'utilisation de notre plateforme de cybersécurité accessible à l'adresse https://cyna.fr ("la Plateforme") et de nos services SaaS de cybersécurité pour PME et MSP.</Text>
          <Text style={styles.sectionDesc}>Cette politique est conforme au Règlement Général sur la Protection des Données (RGPD) et aux dernières directives de la CNIL 2024.</Text>
        </SectionCard>

        <SectionCard color="#0ea5e9" icon="lock-closed" title="1. Données collectées et bases légales">
          <Text style={styles.sectionSubtitle}>1.1 Données d'identification et de contact</Text>
          <View style={styles.bulletGroup}>
            <Bullet color="#0ea5e9">Nom et prénom</Bullet>
            <Bullet color="#0ea5e9">Adresse e-mail professionnelle</Bullet>
            <Bullet color="#0ea5e9">Numéro de téléphone (optionnel)</Bullet>
            <Bullet color="#0ea5e9">Fonction et nom de l'entreprise</Bullet>
          </View>
          <Text style={styles.sectionDesc}>Base légale : Exécution du contrat (art. 6.1.b RGPD) et intérêts légitimes (art. 6.1.f RGPD)</Text>
          <Text style={styles.sectionSubtitle}>1.2 Données de connexion et d'utilisation</Text>
          <View style={styles.bulletGroup}>
            <Bullet color="#0ea5e9">Adresse IP (anonymisée après 13 mois)</Bullet>
            <Bullet color="#0ea5e9">Logs de connexion et d'activité</Bullet>
            <Bullet color="#0ea5e9">Données de navigation (pages visitées, durée)</Bullet>
            <Bullet color="#0ea5e9">Informations techniques (navigateur, OS, appareil)</Bullet>
            <Bullet color="#0ea5e9">Cookies d'authentification et de préférence</Bullet>
          </View>
          <Text style={styles.sectionDesc}>Base légale : Intérêts légitimes pour la sécurité et l'amélioration des services</Text>
          <Text style={styles.sectionSubtitle}>1.3 Données de cybersécurité</Text>
          <View style={styles.bulletGroup}>
            <Bullet color="#0ea5e9">Configuration de sécurité de votre infrastructure</Bullet>
            <Bullet color="#0ea5e9">Rapports de vulnérabilités (anonymisés)</Bullet>
            <Bullet color="#0ea5e9">Métadonnées des audits de sécurité</Bullet>
            <Bullet color="#0ea5e9">Incidents de sécurité détectés</Bullet>
          </View>
          <Text style={styles.sectionDesc}>Base légale : Exécution du contrat et consentement explicite pour les données sensibles</Text>
          <Text style={styles.sectionSubtitle}>1.4 Données de paiement</Text>
          <View style={styles.bulletGroup}>
            <Bullet color="#0ea5e9">Stripe (certification PCI Level 1)</Bullet>
            <Bullet color="#0ea5e9">PayPal (certifié PCI-DSS)</Bullet>
          </View>
          <AlertBox color="#ef4444" icon="alert">
            {['Important', 'Aucune donnée bancaire n\'est stockée sur nos serveurs']}
          </AlertBox>
        </SectionCard>

        <SectionCard color="#22c55e" icon="timer" title="2. Finalités et durées de conservation">
          <Bullet color="#22c55e">🔐 Prestation de services de cybersécurité : Exécution des audits, surveillance, réponse aux incidents | Durée : Durée du contrat + 3 ans</Bullet>
          <Bullet color="#22c55e">📊 Amélioration et optimisation : Analytics anonymisées, développement produit | Durée : 25 mois maximum</Bullet>
          <Bullet color="#22c55e">💬 Support et communication : Support technique, notifications sécuritaires | Durée : 3 ans après dernière interaction</Bullet>
          <Bullet color="#22c55e">⚖️ Obligations légales : Conformité réglementaire, obligations comptables | Durée : 10 ans (Code de commerce)</Bullet>
          <Bullet color="#22c55e">🛡️ Sécurité et lutte contre la fraude : Détection d'intrusions, prévention des cyberattaques | Durée : 13 mois pour les IP, 6 ans pour les incidents</Bullet>
          <AlertBox color="#fbbf24" icon="alert-circle-outline">
            {['Suppression automatique', 'Vos données sont automatiquement supprimées à l\'expiration des durées mentionnées, sauf obligation légale contraire.']}
          </AlertBox>
        </SectionCard>

        <SectionCard color="#a78bfa" icon="shield-checkmark" title="3. Vos droits RGPD">
          <Bullet color="#a78bfa">Droit d'accès (Art. 15) : Obtenir une copie de vos données et informations sur leur traitement</Bullet>
          <Bullet color="#a78bfa">Droit de rectification (Art. 16) : Corriger des données inexactes ou incomplètes</Bullet>
          <Bullet color="#a78bfa">Droit d'effacement (Art. 17) : Suppression de vos données (sous conditions)</Bullet>
          <Bullet color="#a78bfa">Droit de limitation (Art. 18) : Limiter le traitement dans certains cas</Bullet>
          <Bullet color="#a78bfa">Droit de portabilité (Art. 20) : Récupérer vos données dans un format structuré</Bullet>
          <Bullet color="#a78bfa">Droit d'opposition (Art. 21) : S'opposer au traitement pour des raisons légitimes</Bullet>
          <AlertBox color="#0ea5e9" icon="mail">
            {['Exercer vos droits', 'Contactez notre DPO (Nijel Sarmiento) via : supportcyna@gmail.com (objet : "Exercice droits RGPD") | Délai de réponse : 1 mois maximum | Justificatif d\'identité requis pour la sécurité']}
          </AlertBox>
        </SectionCard>

        <SectionCard color="#0ea5e9" icon="share-social" title="4. Partage des données et sous-traitants">
          <Bullet color="#0ea5e9">Nous ne vendons, n'échangeons ni ne louons jamais vos données personnelles à des tiers à des fins commerciales.</Bullet>
          <Bullet color="#0ea5e9">Partage strictement nécessaire avec : Stripe, PayPal (certifiés PCI-DSS), AWS Europe (GDPR compliant), autorités compétentes (réquisition judiciaire ou obligation légale)</Bullet>
          <AlertBox color="#22c55e" icon="shield-checkmark-outline">
            {['Garanties', 'Tous nos sous-traitants sont liés par des contrats RGPD (art. 28) garantissant le même niveau de protection de vos données.']}
          </AlertBox>
        </SectionCard>

        <SectionCard color="#f59e42" icon="construct" title="5. Mesures de sécurité">
          <Text style={styles.sectionSubtitle}>Sécurité technique :</Text>
          <Bullet color="#f59e42">Chiffrement AES-256 au repos et en transit</Bullet>
          <Bullet color="#f59e42">Authentification multi-facteurs obligatoire</Bullet>
          <Bullet color="#f59e42">APIs conformes OWASP Top 10</Bullet>
          <Bullet color="#f59e42">Audits de sécurité trimestriels</Bullet>
          <Bullet color="#f59e42">Sauvegarde chiffrée quotidienne</Bullet>
          <Text style={styles.sectionSubtitle}>Sécurité organisationnelle :</Text>
          <Bullet color="#f59e42">Formation RGPD annuelle du personnel</Bullet>
          <Bullet color="#f59e42">Politique de mots de passe renforcée</Bullet>
          <Bullet color="#f59e42">Contrôles d'accès basés sur les rôles</Bullet>
          <Bullet color="#f59e42">Traçabilité complète des actions</Bullet>
          <Bullet color="#f59e42">Plan de réponse aux incidents</Bullet>
        </SectionCard>

        <SectionCard color="#ef4444" icon="business" title="6. Services réservés aux professionnels">
          <Bullet color="#ef4444">Nos services de cybersécurité s'adressent exclusivement aux entreprises et professionnels. Nous ne collectons pas sciemment de données auprès de personnes de moins de 16 ans.</Bullet>
          <AlertBox color="#ef4444" icon="alert">
            {['Suppression mineur', 'Si vous êtes parent ou tuteur légal et que vous pensez qu\'un mineur nous a transmis des données personnelles, contactez-nous immédiatement à supportcyna@gmail.com pour suppression immédiate.']}
          </AlertBox>
        </SectionCard>

        <SectionCard color="#0ea5e9" icon="cloud-upload" title="7. Garanties pour les transferts">
          <Bullet color="#0ea5e9">Pays disposant d'une décision d'adéquation de la Commission européenne</Bullet>
          <Bullet color="#0ea5e9">Clauses contractuelles types (CCT) approuvées par la Commission</Bullet>
          <Bullet color="#0ea5e9">Mécanismes de certification appropriés</Bullet>
        </SectionCard>

        <SectionCard color="#fbbf24" icon="cookie" title="8. Cookies et technologies similaires">
          <Bullet color="#fbbf24">Cookies essentiels : Authentification, sécurité, navigation</Bullet>
          <Bullet color="#0ea5e9">Cookies analytiques : Mesure d'audience (avec votre consentement)</Bullet>
          <Bullet color="#a78bfa">Cookies marketing : Personnalisation (avec votre consentement)</Bullet>
          <AlertBox color="#fbbf24" icon="settings">
            {['Gestion des cookies', 'Accédez à vos préférences depuis votre tableau de bord ou via le lien en bas de page. Vous pouvez modifier vos choix à tout moment.']}
          </AlertBox>
        </SectionCard>

        <SectionCard color="#23234b" icon="mail" title="9. Contact">
          <Bullet color="#23234b">Pour toute question relative à vos données personnelles, veuillez nous contacter à : supportcyna@gmail.com</Bullet>
          <Bullet color="#23234b">Délai de réponse : 1 mois maximum (RGPD)</Bullet>
          <Bullet color="#23234b">Objet email : "RGPD - [votre demande]"</Bullet>
        </SectionCard>

        <SectionCard color="#ef4444" icon="alert-circle" title="10. Droit de réclamation">
          <Bullet color="#ef4444">Si vous estimez que le traitement de vos données personnelles constitue une violation du RGPD, vous avez le droit d'introduire une réclamation auprès de l'autorité de contrôle compétente :</Bullet>
          <Bullet color="#ef4444">CNIL (Commission Nationale de l'Informatique et des Libertés)\n3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07\nTél : 01 53 73 22 22 | Web : www.cnil.fr</Bullet>
        </SectionCard>

        <Text style={styles.link}>Cette politique est effective depuis le 11 juin 2025 et remplace toutes les versions précédentes.</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 18, paddingTop: 60, paddingBottom: 40 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backText: { color: '#7c3aed', fontWeight: 'bold', marginLeft: 6, fontSize: 15 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#7c3aed', marginBottom: 8, textAlign: 'center' },
  paragraph: { fontSize: 15, color: '#6b7280', marginBottom: 24, textAlign: 'center' },
  card: {
    borderWidth: 2,
    borderRadius: 18,
    marginBottom: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontWeight: 'bold',
    color: '#23234b',
    marginBottom: 4,
    marginTop: 8,
  },
  sectionDesc: {
    fontSize: 15,
    color: '#23234b',
    marginBottom: 8,
  },
  editorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  editorCard: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    marginHorizontal: 4,
    padding: 8,
    alignItems: 'center',
  },
  editorName: {
    fontWeight: 'bold',
    color: '#7c3aed',
    marginBottom: 2,
    fontSize: 14,
  },
  editorRole: {
    color: '#6b7280',
    fontSize: 12,
  },
  bulletGroup: {
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  bulletText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#23234b',
  },
  alertBox: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  alertTitle: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  alertDesc: {
    fontSize: 14,
    color: '#23234b',
  },
  link: { color: '#7c3aed', textDecorationLine: 'underline', marginTop: 10, textAlign: 'center' },
});

export default PrivacyPolicyScreen; 