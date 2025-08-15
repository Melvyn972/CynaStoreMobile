# Application Mobile CynaStore
Une application mobile React Native construite avec Expo qui se connecte à l'API web de CynaStore.

## Fonctionnalités
- **Authentification** : Connexion utilisateur, inscription et authentification sécurisée basée sur des tokens
- **Navigation d'Articles** : Visualiser et rechercher des articles depuis l'application web
- **Panier d'Achat** : Ajouter des articles au panier, gérer les quantités et procéder au checkout
- **Profil Utilisateur** : Gérer le compte utilisateur et les paramètres
- **Interface Moderne** : Design propre et responsive avec navigation native

## Prérequis
- Node.js (v16 ou supérieur)
- npm ou yarn
- Expo CLI : `npm install -g @expo/cli`
- Simulateur iOS (pour le développement iOS) ou Android Studio (pour le développement Android)

## Installation
1. Naviguer vers le répertoire de l'application mobile :
   ```bash
   cd CynaStoreMobile
   ```
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Configurer l'URL de l'API dans `.env` :
   ```
   API_URL=http://localhost:3000/api
   NEXTAUTH_URL=http://localhost:3000
   ```

## Lancement de l'Application
### Mode Développement
Démarrer le serveur de développement Expo :
```bash
npm start
```

### Commandes Spécifiques par Plateforme
Pour iOS :
```bash
npm run ios
```

Pour Android :
```bash
npm run android
```

Pour Web :
```bash
npm run web
```

## Structure du Projet
```
src/
├── config/          # Configuration de l'API
├── context/         # Fournisseurs de React Context
├── navigation/      # Configuration de la navigation
├── screens/         # Composants d'écran
├── services/        # Fonctions de service API
└── utils/          # Fonctions utilitaires
```

## Intégration API
L'application mobile se connecte aux endpoints de l'API de l'application web :
- **Authentification** : `/api/auth/*`
- **Articles** : `/api/articles/*`
- **Panier** : `/api/cart/*`
- **Utilisateur** : `/api/user/*`

## Composants Clés
### Authentification
- Écrans de connexion/inscription avec validation
- Stockage sécurisé de tokens utilisant AsyncStorage
- Actualisation automatique des tokens et déconnexion à l'expiration

### Navigation
- Navigation par onglets pour les écrans principaux
- Navigation en pile pour les vues détaillées
- Gestion du flux d'authentification

### Gestion des Données
- Client HTTP basé sur Axios avec intercepteurs
- React Context pour la gestion d'état globale
- Stockage asynchrone pour les données persistantes

## Configuration
### Variables d'Environnement
Créer un fichier `.env` dans le répertoire racine :
```env
API_URL=http://votre-url-api/api
NEXTAUTH_URL=http://votre-url-application-web
```

### Configuration URL API
Pour le développement, assurez-vous que votre application web fonctionne et est accessible. La configuration par défaut suppose :
- Application web fonctionnant sur `http://localhost:3000`
- API accessible à `http://localhost:3000/api`

## Build pour la Production
### Build pour iOS
```bash
npm run build:ios
```

### Build pour Android
```bash
npm run build:android
```

## Dépannage
### Problèmes Courants
1. **Problèmes du bundler Metro** : Vider le cache avec `npm start -- --clear`
2. **Problèmes du simulateur iOS** : Réinitialiser le simulateur ou redémarrer Xcode
3. **Problèmes Android** : S'assurer qu'Android Studio et l'émulateur sont correctement configurés
4. **Problèmes de connexion API** : Vérifier la configuration réseau et l'URL de l'API

### Configuration Réseau
Pour tester sur des appareils physiques, mettre à jour l'API_URL pour utiliser l'adresse IP de votre ordinateur au lieu de localhost :
```env
API_URL=http://192.168.1.100:3000/api
```

## Contribution
1. Forker le dépôt
2. Créer une branche de fonctionnalité
3. Apporter vos modifications
4. Tester minutieusement
5. Soumettre une pull request

## Licence
Ce projet est sous licence MIT.
