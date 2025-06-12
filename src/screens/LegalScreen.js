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

const LegalScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8ff' }}>
      <BackgroundEffects />
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#7c3aed" />
          <Text style={styles.backText}>Retour à l'accueil</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mentions Légales</Text>
        <Text style={styles.paragraph}>Informations légales obligatoires</Text>

        <SectionCard color="#0ea5e9" icon="business" title="Identification de l'éditeur">
          <AlertBox color="#0ea5e9" icon="cube">
            {['Structure juridique', 'La plateforme Cyna est éditée et exploitée conjointement par trois personnes physiques agissant en copropriété :']}
          </AlertBox>
          <View style={styles.editorsRow}>
            <View style={styles.editorCard}><Text style={styles.editorName}>Melvyn Thierry-Bellefond</Text><Text style={styles.editorRole}>Responsable technique et design</Text></View>
            <View style={styles.editorCard}><Text style={styles.editorName}>Thomas Lindeker</Text><Text style={styles.editorRole}>Responsable infrastructure</Text></View>
            <View style={styles.editorCard}><Text style={styles.editorName}>Nijel Sarmiento</Text><Text style={styles.editorRole}>DPO et support client</Text></View>
          </View>
          <Bullet color="#0ea5e9">Email : supportcyna@gmail.com</Bullet>
          <Bullet color="#0ea5e9">Site web : https://cyna.fr</Bullet>
        </SectionCard>

        <SectionCard color="#22c55e" icon="cloud" title="Hébergement et infrastructure">
          <AlertBox color="#22c55e" icon="cloud-outline">
            {['Hébergeur principal', 'Amazon Web Services Europe (Ireland) Limited, One Burlington Plaza, Burlington Road, Dublin 4, D04 E4X0, Irlande. Site web : aws.amazon.com']}
          </AlertBox>
          <AlertBox color="#0ea5e9" icon="globe-outline">
            {['Services techniques', 'CDN : Cloudflare Inc. (États-Unis) - Conformité GDPR\nDNS : Cloudflare (Données hébergées en Europe)\nMonitoring : Infrastructure européenne exclusivement\nBase de données : AWS RDS Europe (Dublin)']}
          </AlertBox>
        </SectionCard>

        <SectionCard color="#a78bfa" icon="people-circle" title="Directeur de publication et modération">
          <AlertBox color="#a78bfa" icon="person-circle-outline">
            {['Direction de la publication', 'La direction de la publication est assurée collégialement par les trois co-éditeurs : Melvyn Thierry-Bellefond (technique/design), Thomas Lindeker (infrastructure), Nijel Sarmiento (juridique/support).']}
          </AlertBox>
          <AlertBox color="#fbbf24" icon="shield-checkmark-outline">
            {['Modération des contenus', 'La plateforme Cyna étant à usage professionnel B2B, les contenus utilisateurs sont principalement constitués de données techniques de cybersécurité. Une modération automatique et manuelle est mise en place pour garantir la qualité et la conformité des contenus.']}
          </AlertBox>
        </SectionCard>

        <SectionCard color="#ef4444" icon="document-text" title="Propriété intellectuelle et droits d'auteur">
          <AlertBox color="#ef4444" icon="shield-half-outline">
            {['Droits réservés', 'L\'ensemble de la plateforme Cyna est protégé par le droit d\'auteur français et international.']}
          </AlertBox>
          <View style={styles.bulletGroup}>
            <Bullet color="#ef4444">Code source : © 2024 Melvyn Thierry-Bellefond, Thomas Lindeker, Nijel Sarmiento</Bullet>
            <Bullet color="#ef4444">Design et interface : © 2024 Melvyn Thierry-Bellefond</Bullet>
            <Bullet color="#ef4444">Documentation : © 2024 Nijel Sarmiento</Bullet>
            <Bullet color="#ef4444">Architecture : © 2024 Thomas Lindeker</Bullet>
          </View>
          <AlertBox color="#fbbf24" icon="lock-closed-outline">
            {['Licences et autorisations', 'Toute utilisation, reproduction, représentation, modification ou exploitation de tout ou partie de la plateforme sans autorisation écrite des titulaires des droits est strictement interdite et constitue une contrefaçon sanctionnée par les articles L. 335-2 et suivants du Code de la propriété intellectuelle.']}
          </AlertBox>
        </SectionCard>

        <SectionCard color="#0ea5e9" icon="shield-checkmark" title="Données personnelles et RGPD">
          <AlertBox color="#0ea5e9" icon="person">
            {['Responsables de traitement', 'Les trois co-éditeurs sont conjointement responsables du traitement des données personnelles. DPO : Nijel Sarmiento. Contact : supportcyna@gmail.com (objet : "RGPD - [votre demande]")']}
          </AlertBox>
          <AlertBox color="#a78bfa" icon="document-text-outline">
            {['Documentation RGPD', 'Pour toutes informations sur le traitement de vos données personnelles, consultez notre Politique de confidentialité qui détaille vos droits, nos obligations et les mesures de sécurité mises en place.']}
          </AlertBox>
        </SectionCard>

        <SectionCard color="#22c55e" icon="cookie" title="Cookies et traceurs">
          <AlertBox color="#22c55e" icon="cookie-outline">
            {['Utilisation des cookies', 'Conformément à l\'article 82 de la loi Informatique et Libertés et aux directives CNIL, nous utilisons des cookies pour :\n• Assurer le fonctionnement technique de la plateforme\n• Améliorer l\'expérience utilisateur (avec votre consentement)\n• Mesurer l\'audience de manière anonymisée (avec votre consentement)\n• Garantir la sécurité des connexions']}
          </AlertBox>
          <AlertBox color="#0ea5e9" icon="settings-outline">
            {['Gestion', 'Vous pouvez à tout moment modifier vos préférences de cookies via votre espace client ou les paramètres de votre navigateur.']}
          </AlertBox>
        </SectionCard>

        <SectionCard color="#f59e42" icon="briefcase" title="Droit applicable et juridictions">
          <AlertBox color="#f59e42" icon="document-outline">
            {['Droit français', 'Les présentes mentions légales sont régies par le droit français. En cas de litige, et après tentative de résolution amiable, les tribunaux français seront seuls compétents.']}
          </AlertBox>
          <AlertBox color="#ef4444" icon="alert-circle-outline">
            {['Autorités compétentes', 'CNIL : Protection des données personnelles\nINPI : Propriété intellectuelle\nARCOM : Communication audiovisuelle\nMédiateur de la consommation : Litiges commerciaux']}
          </AlertBox>
        </SectionCard>

        <SectionCard color="#23234b" icon="mail" title="Contact et signalement">
          <Bullet color="#23234b">Contact général : supportcyna@gmail.com</Bullet>
          <Bullet color="#23234b">Réponse : 48h ouvrées maximum</Bullet>
          <Bullet color="#23234b">Langue : Français, Anglais</Bullet>
          <AlertBox color="#ef4444" icon="alert">
            {['Signalement', 'Contenu illicite : Objet "SIGNALEMENT"\nViolation droits : Objet "VIOLATION PI"\nIncident sécurité : Objet "INCIDENT"']}
          </AlertBox>
          <Text style={styles.link}>Mentions légales mises à jour le 11 juin 2025 • Conformes au droit français en vigueur</Text>
        </SectionCard>
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

export default LegalScreen; 