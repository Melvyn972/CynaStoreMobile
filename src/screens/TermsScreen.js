import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackgroundEffects from '../components/BackgroundEffects';

const SectionCard = ({ color, icon, title, children, borderColor, bgColor }) => (
  <View style={[styles.card, { borderColor: borderColor || color, backgroundColor: bgColor || color + '10' }]}>  
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

const TermsScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8ff' }}>
      <BackgroundEffects />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Bouton retour */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#7c3aed" />
          <Text style={styles.backText}>Retour à l'accueil</Text>
        </TouchableOpacity>
        {/* Header */}
        <Text style={styles.title}>Conditions Générales d'Utilisation</Text>
        <Text style={styles.paragraph}>Dernière mise à jour : 11 juin 2025</Text>

        <SectionCard color="#23234b" icon="people" title="Éditeurs et responsables" borderColor="#e5e7eb" bgColor="#f9fafb">
          <Text style={styles.sectionDesc}>La plateforme Cyna est éditée et exploitée conjointement par trois personnes physiques agissant en copropriété :</Text>
          <View style={styles.editorsRow}>
            <View style={styles.editorCard}><Text style={styles.editorName}>Melvyn Thierry-Bellefond</Text><Text style={styles.editorRole}>Frontend & Design</Text></View>
            <View style={styles.editorCard}><Text style={styles.editorName}>Thomas Lindeker</Text><Text style={styles.editorRole}>Backend & Base de données</Text></View>
            <View style={styles.editorCard}><Text style={styles.editorName}>Nijel Sarmiento</Text><Text style={styles.editorRole}>Documentation & Support RGPD</Text></View>
          </View>
        </SectionCard>

        <View style={{ marginBottom: 16 }}>
          <AlertBox color="#0ea5e9" icon="alert-circle-outline">
            {['Acceptation', 'L\'accès et l\'utilisation de la Plateforme impliquent l\'acceptation pleine et entière des présentes CGU. Si vous n\'acceptez pas ces conditions, veuillez ne pas utiliser nos services.']}
          </AlertBox>
        </View>

        <SectionCard color="#0ea5e9" icon="information-circle" title="Objet et présentation des services">
          <Text style={styles.sectionDesc}>Cyna est une plateforme de cybersécurité spécialisée pour les PME (Petites et Moyennes Entreprises) et MSP (Managed Service Providers). Nous proposons une approche intégrée de la sécurité informatique combinant expertise technique, outils automatisés et accompagnement personnalisé.</Text>
          <View style={styles.bulletGroup}>
            <Bullet color="#0ea5e9">Audits de sécurité automatisés</Bullet>
            <Bullet color="#0ea5e9">Surveillance continue des menaces</Bullet>
            <Bullet color="#0ea5e9">Détection et réponse aux incidents</Bullet>
            <Bullet color="#0ea5e9">Mise en conformité réglementaire</Bullet>
            <Bullet color="#0ea5e9">Formation et sensibilisation</Bullet>
          </View>
          <View style={styles.bulletGroup}>
            <Bullet color="#a21caf">Expertise technique certifiée</Bullet>
            <Bullet color="#a21caf">Proximité et réactivité</Bullet>
            <Bullet color="#a21caf">Solutions sur mesure</Bullet>
            <Bullet color="#a21caf">Support client premium</Bullet>
            <Bullet color="#a21caf">Innovation continue</Bullet>
          </View>
          <AlertBox color="#a21caf" icon="star">
            {['Mission', 'Démocratiser l\'accès à une cybersécurité de niveau entreprise pour les PME et faciliter le travail des MSP avec des outils professionnels et intuitifs.']}
          </AlertBox>
        </SectionCard>

        <SectionCard color="#22c55e" icon="lock-closed" title="Conditions d'accès et d'inscription">
          <AlertBox color="#22c55e" icon="business">
            {['Services B2B exclusivement', 'Nos services s\'adressent exclusivement aux entreprises, professionnels indépendants et MSP. Inscription par des particuliers à titre personnel est interdite.']}
          </AlertBox>
          <Text style={styles.sectionDesc}>Conditions requises pour l'inscription :</Text>
          <View style={styles.bulletGroup}>
            <Bullet color="#22c55e">Être majeur (18 ans minimum) et avoir la capacité juridique</Bullet>
            <Bullet color="#22c55e">Disposer d'une adresse email professionnelle valide</Bullet>
            <Bullet color="#22c55e">Agir pour le compte d'une entreprise ou d'une organisation</Bullet>
            <Bullet color="#22c55e">Fournir des informations exactes et à jour</Bullet>
            <Bullet color="#22c55e">Accepter les présentes CGU et la Politique de confidentialité</Bullet>
          </View>
          <AlertBox color="#f59e42" icon="warning">
            {['Responsabilité', 'Vous êtes responsable de la confidentialité de vos identifiants de connexion. Tout accès à votre compte est présumé effectué par vous-même.']}
          </AlertBox>
        </SectionCard>

        <SectionCard color="#a78bfa" icon="document-text" title="Propriété intellectuelle et droits d'auteur">
          <AlertBox color="#a78bfa" icon="people-circle">
            {['Droits des copropriétaires', 'La plateforme Cyna, son code source, son design et tous ses éléments sont protégés par le droit d\'auteur et sont la propriété conjointe de : Melvyn Thierry-Bellefond, Thomas Lindeker, Nijel Sarmiento.']}
          </AlertBox>
          <Text style={styles.sectionDesc}>Éléments protégés :</Text>
          <View style={styles.bulletGroup}>
            <Bullet color="#a78bfa">Code source et algorithmes</Bullet>
            <Bullet color="#a78bfa">Interface utilisateur et design</Bullet>
            <Bullet color="#a78bfa">Logos, marques et identité visuelle</Bullet>
            <Bullet color="#a78bfa">Documentation technique</Bullet>
            <Bullet color="#a78bfa">Méthodologies et processus</Bullet>
            <Bullet color="#a78bfa">Bases de données et contenus</Bullet>
          </View>
          <AlertBox color="#ef4444" icon="close-circle">
            {['Utilisations interdites', 'Toute reproduction, distribution, modification, transmission, republication, exploitation commerciale ou création d\'œuvres dérivées sans autorisation écrite préalable est strictement interdite et constitue une contrefaçon passible de sanctions pénales.']}
          </AlertBox>
        </SectionCard>

        <SectionCard color="#f59e42" icon="list-circle" title="Utilisation des services et obligations de l'utilisateur">
          <AlertBox color="#22c55e" icon="checkmark-circle">
            {['Utilisation autorisée', 'Utilisation conforme aux finalités de cybersécurité, respect des conditions techniques, utilisation dans le cadre professionnel uniquement, respect de la confidentialité des données tierces.']}
          </AlertBox>
          <AlertBox color="#ef4444" icon="close-circle">
            {['Utilisations interdites', 'Tentatives de piratage, diffusion de malwares, activités illégales, partage d\'accès non autorisé, surcharge, rétro-ingénierie, etc.']}
          </AlertBox>
          <AlertBox color="#f59e42" icon="warning">
            {['Sanctions', 'Toute violation de ces conditions peut entraîner la suspension immédiate de votre accès et des poursuites judiciaires.']}
          </AlertBox>
        </SectionCard>

        <SectionCard color="#0ea5e9" icon="shield-checkmark" title="Protection des données & vie privée">
          <Text style={styles.sectionDesc}>Le traitement de vos données personnelles est essentiel au fonctionnement de nos services de cybersécurité. Nous collectons et traitons vos données dans le strict respect du RGPD et des dernières directives CNIL 2024.</Text>
          <View style={styles.bulletGroup}>
            <Bullet color="#0ea5e9">Données collectées : identification, connexion, sécurité, préférences</Bullet>
            <Bullet color="#a78bfa">Vos droits : accès, rectification, effacement, portabilité, opposition, limitation</Bullet>
          </View>
          <AlertBox color="#0ea5e9" icon="document-text">
            {['Documentation complète', 'Consultez notre Politique de confidentialité pour plus de détails sur le traitement de vos données, vos droits et nos mesures de sécurité.']}
          </AlertBox>
        </SectionCard>

        <SectionCard color="#fbbf24" icon="cookie" title="Cookies et technologies de suivi">
          <Text style={styles.sectionDesc}>Nous utilisons des cookies et technologies similaires pour améliorer votre expérience, assurer la sécurité de la plateforme et analyser son utilisation dans le respect des directives CNIL.</Text>
          <View style={styles.bulletGroup}>
            <Bullet color="#22c55e">Cookies essentiels : Authentification, navigation, sécurité</Bullet>
            <Bullet color="#0ea5e9">Cookies analytiques : Mesure d'audience et optimisation</Bullet>
            <Bullet color="#a78bfa">Cookies fonctionnels : Personnalisation et préférences</Bullet>
          </View>
          <AlertBox color="#fbbf24" icon="settings">
            {['Gestion', 'Vous pouvez modifier vos préférences de cookies à tout moment via votre espace client ou les paramètres de votre navigateur.']}
          </AlertBox>
        </SectionCard>

        <SectionCard color="#23234b" icon="mail" title="Contact & support" borderColor="#e5e7eb" bgColor="#f9fafb">
          <Text style={styles.sectionDesc}>Support technique : supportcyna@gmail.com</Text>
          <Text style={styles.sectionDesc}>Questions juridiques : Objet : "Juridique - [votre question]"</Text>
          <Text style={styles.sectionDesc}>Délai de réponse : 48h ouvrées maximum</Text>
        </SectionCard>

        <Text style={styles.link}>Ces conditions sont effectives depuis le 11 juin 2025 • Version 2.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 18, paddingTop: 60, paddingBottom: 40 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backText: { color: '#7c3aed', fontWeight: 'bold', marginLeft: 6, fontSize: 15 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#23234b', marginBottom: 8, textAlign: 'center' },
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

export default TermsScreen; 