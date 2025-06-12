import { ScrollView, View, Text, StyleSheet } from 'react-native';

export default function TosScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{padding: 24}}>
      <Text style={styles.title}>Conditions Générales d'Utilisation</Text>
      <Text style={styles.paragraph}>Dernière mise à jour : 11 juin 2025</Text>
      <Text style={styles.sectionTitle}>Éditeurs et responsables</Text>
      <Text style={styles.paragraph}>La plateforme Cyna est éditée et exploitée conjointement par Melvyn Thierry-Bellefond, Thomas Lindeker, Nijel Sarmiento.</Text>
      <Text style={styles.sectionTitle}>Objet et présentation des services</Text>
      <Text style={styles.paragraph}>Cyna est une plateforme de cybersécurité spécialisée pour les PME et MSP, offrant audits, surveillance, détection, conformité, formation, et support premium.</Text>
      <Text style={styles.sectionTitle}>Conditions d'accès et d'inscription</Text>
      <Text style={styles.paragraph}>Services B2B exclusivement, inscription réservée aux professionnels majeurs, email professionnel requis, acceptation des CGU et Politique de confidentialité.</Text>
      <Text style={styles.sectionTitle}>Propriété intellectuelle et droits d'auteur</Text>
      <Text style={styles.paragraph}>Plateforme, code source, design et documentation protégés par le droit d'auteur, propriété conjointe des trois éditeurs.</Text>
      <Text style={styles.sectionTitle}>Utilisation des services et obligations de l'utilisateur</Text>
      <Text style={styles.paragraph}>Utilisation conforme, respect de la confidentialité, interdiction de piratage, diffusion de malwares, rétro-ingénierie, etc.</Text>
      <Text style={styles.sectionTitle}>Protection des données et vie privée</Text>
      <Text style={styles.paragraph}>Traitement des données dans le respect du RGPD et des directives CNIL. Droits d'accès, rectification, effacement, opposition, portabilité.</Text>
      <Text style={styles.sectionTitle}>Cookies et technologies de suivi</Text>
      <Text style={styles.paragraph}>Cookies essentiels, analytiques, fonctionnels, gestion via espace client ou navigateur.</Text>
      <Text style={styles.sectionTitle}>Responsabilité et garanties</Text>
      <Text style={styles.paragraph}>Services fournis "en l'état", responsabilité limitée, engagement de sécurité, mais aucune garantie absolue.</Text>
      <Text style={styles.sectionTitle}>Droit applicable et juridiction</Text>
      <Text style={styles.paragraph}>CGU régies par le droit français, tribunaux français compétents. Version effective depuis le 11 juin 2025.</Text>
      <Text style={styles.sectionTitle}>Contact et support</Text>
      <Text style={styles.paragraph}>Support : supportcyna@gmail.com. Délai de réponse : 48h ouvrées maximum.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
}); 