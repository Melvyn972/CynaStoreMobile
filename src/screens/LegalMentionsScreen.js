import { ScrollView, View, Text, StyleSheet } from 'react-native';

export default function LegalMentionsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{padding: 24}}>
      <Text style={styles.title}>Mentions Légales</Text>
      <Text style={styles.sectionTitle}>Identification de l'éditeur</Text>
      <Text style={styles.paragraph}>La plateforme Cyna est éditée conjointement par Melvyn Thierry-Bellefond, Thomas Lindeker, Nijel Sarmiento. Contact : supportcyna@gmail.com, https://cyna.fr</Text>
      <Text style={styles.sectionTitle}>Hébergement et infrastructure</Text>
      <Text style={styles.paragraph}>Hébergeur principal : Amazon Web Services Europe (Ireland). Services techniques : Cloudflare, AWS RDS Europe.</Text>
      <Text style={styles.sectionTitle}>Directeur de publication et modération</Text>
      <Text style={styles.paragraph}>Direction assurée par les trois co-éditeurs. Modération automatique et manuelle pour la conformité des contenus.</Text>
      <Text style={styles.sectionTitle}>Propriété intellectuelle et droits d'auteur</Text>
      <Text style={styles.paragraph}>Plateforme protégée par le droit d'auteur. Toute reproduction ou exploitation sans autorisation est interdite.</Text>
      <Text style={styles.sectionTitle}>Données personnelles et RGPD</Text>
      <Text style={styles.paragraph}>Responsables de traitement : les trois co-éditeurs. DPO : Nijel Sarmiento. Contact : supportcyna@gmail.com</Text>
      <Text style={styles.sectionTitle}>Cookies et traceurs</Text>
      <Text style={styles.paragraph}>Cookies utilisés pour le fonctionnement, l'expérience utilisateur, la sécurité et la mesure d'audience.</Text>
      <Text style={styles.sectionTitle}>Droit applicable et juridictions</Text>
      <Text style={styles.paragraph}>Mentions légales régies par le droit français. Tribunaux français compétents en cas de litige.</Text>
      <Text style={styles.sectionTitle}>Contact et signalement</Text>
      <Text style={styles.paragraph}>Contact général : supportcyna@gmail.com. Signalement : objet "SIGNALEMENT" ou "VIOLATION PI" ou "INCIDENT". Dernière mise à jour : 11 juin 2025.</Text>
    </ScrollView>
  );
} 