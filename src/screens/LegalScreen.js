import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackgroundEffects from '../components/BackgroundEffects';

const LegalScreen = ({ navigation }) => {
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
        <Text style={styles.title}>Mentions Légales</Text>
        <Text style={styles.subtitle}>Informations légales obligatoires</Text>
        {/* Identification */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Identification de l'éditeur</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionSubtitle}>🏢 Structure juridique</Text>
            <Text style={styles.sectionDesc}>La plateforme Cyna est éditée conjointement par trois personnes physiques agissant en copropriété :</Text>
            <View style={styles.teamRow}>
              <View style={styles.teamCol}><Text style={styles.teamName}>Melvyn Thierry-Bellefond</Text><Text style={styles.teamDesc}>Personne physique<br/>Responsable technique et design<br/>Co-éditeur - Part : 1/3</Text></View>
              <View style={styles.teamCol}><Text style={styles.teamName}>Thomas Lindeker</Text><Text style={styles.teamDesc}>Personne physique<br/>Responsable infrastructure<br/>Co-éditeur - Part : 1/3</Text></View>
              <View style={styles.teamCol}><Text style={styles.teamName}>Nijel Sarmiento</Text><Text style={styles.teamDesc}>Personne physique<br/>DPO et support client<br/>Co-éditeur - Part : 1/3</Text></View>
            </View>
            <Text style={styles.sectionSubtitle}>📧 Contact éditeur</Text>
            <Text style={styles.sectionDesc}>Email : <Text style={styles.link}>supportcyna@gmail.com</Text><br/>Site web : <Text style={styles.link}>https://cyna.fr</Text></Text>
          </View>
        </View>
        {/* Hosting */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Hébergement et infrastructure</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionSubtitle}>☁️ Hébergeur principal</Text>
            <Text style={styles.sectionDesc}><Text style={styles.bold}>Amazon Web Services Europe</Text><br/>AWS Europe (Ireland) Limited<br/>One Burlington Plaza, Burlington Road<br/>Dublin 4, D04 E4X0, Irlande<br/>Site web : <Text style={styles.link}>aws.amazon.com</Text></Text>
            <Text style={styles.sectionSubtitle}>🌐 Services techniques</Text>
            <Text style={styles.sectionDesc}>• <Text style={styles.bold}>CDN :</Text> Cloudflare Inc. (États-Unis) - Conformité GDPR<br/>• <Text style={styles.bold}>DNS :</Text> Cloudflare (Données hébergées en Europe)<br/>• <Text style={styles.bold}>Monitoring :</Text> Infrastructure européenne exclusivement<br/>• <Text style={styles.bold}>Base de données :</Text> AWS RDS Europe (Dublin)</Text>
          </View>
        </View>
        {/* Publication */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Directeur de publication et modération</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionSubtitle}>📝 Direction de la publication</Text>
            <Text style={styles.sectionDesc}>La direction de la publication est assurée collégialement par les trois co-éditeurs :</Text>
            <Text style={styles.sectionDesc}>• <Text style={styles.bold}>Melvyn Thierry-Bellefond</Text> - Contenu technique et design<br/>• <Text style={styles.bold}>Thomas Lindeker</Text> - Documentation infrastructure<br/>• <Text style={styles.bold}>Nijel Sarmiento</Text> - Contenu juridique et support</Text>
            <Text style={styles.sectionSubtitle}>🛡️ Modération des contenus</Text>
            <Text style={styles.sectionDesc}>La plateforme Cyna étant à usage professionnel B2B, les contenus utilisateurs sont principalement constitués de données techniques de cybersécurité. Une modération automatique et manuelle est mise en place pour garantir la qualité et la conformité des contenus.</Text>
          </View>
        </View>
        {/* IP */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Propriété intellectuelle et droits d'auteur</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionSubtitle}>© Droits réservés</Text>
            <Text style={styles.sectionDesc}>L'ensemble de la plateforme Cyna est protégé par le droit d'auteur français et international :</Text>
            <Text style={styles.sectionDesc}>• Code source : © 2024 Melvyn Thierry-Bellefond, Thomas Lindeker, Nijel Sarmiento<br/>• Design et interface : © 2024 Melvyn Thierry-Bellefond<br/>• Documentation : © 2024 Nijel Sarmiento<br/>• Architecture : © 2024 Thomas Lindeker</Text>
            <Text style={styles.sectionSubtitle}>🔒 Licences et autorisations</Text>
            <Text style={styles.sectionDesc}>Toute utilisation, reproduction, représentation, modification ou exploitation de tout ou partie de la plateforme sans autorisation écrite des titulaires des droits est strictement interdite et constitue une contrefaçon sanctionnée par les articles L. 335-2 et suivants du Code de la propriété intellectuelle.</Text>
          </View>
        </View>
        {/* GDPR */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Données personnelles et RGPD</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDesc}>Pour plus d'informations sur la protection de vos données personnelles, veuillez consulter notre <Text style={styles.link} onPress={() => navigation.navigate('PrivacyPolicy')}>Politique de Confidentialité</Text>.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backText: { color: '#7c3aed', fontWeight: 'bold', marginLeft: 6, fontSize: 15 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#23234b', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#6b7280', marginBottom: 24, textAlign: 'center' },
  card: { backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 24, padding: 20, marginBottom: 24, shadowColor: '#a78bfa', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#23234b', marginBottom: 12 },
  sectionContent: { marginLeft: 12 },
  sectionSubtitle: { fontWeight: 'bold', color: '#23234b', marginBottom: 4 },
  sectionDesc: { color: '#6b7280', marginBottom: 8 },
  teamRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  teamCol: { flex: 1, marginHorizontal: 4 },
  teamName: { fontWeight: 'bold', color: '#7c3aed', marginBottom: 2 },
  teamDesc: { color: '#6b7280', fontSize: 13 },
  link: { color: '#7c3aed', textDecorationLine: 'underline' },
  bold: { fontWeight: 'bold' },
});

export default LegalScreen; 