# 📱 CynaStore Mobile

Application mobile React Native moderne pour la plateforme e-commerce CynaStore, offrant une expérience utilisateur fluide et intuitive.

## 🚀 Fonctionnalités Principales

### 🔐 Authentification Sécurisée
- Connexion et inscription utilisateur
- Authentification par tokens JWT
- Gestion automatique de la session
- Récupération de mot de passe

### 🛍️ Expérience d'Achat Complète
- **Catalogue de produits** : Navigation intuitive avec filtres et recherche
- **Panier intelligent** : Gestion des quantités et sauvegarde automatique
- **Processus de commande** : Checkout sécurisé avec validation
- **Suivi des commandes** : Historique détaillé des achats

### 👤 Gestion de Profil
- Profil utilisateur personnalisable
- Historique des commandes
- Paramètres de confidentialité RGPD
- Préférences de notification

### 🏢 Informations Entreprises
- Annuaire des entreprises partenaires
- Détails et coordonnées
- Articles et actualités

## 🛠️ Technologies Utilisées

- **React Native** avec Expo
- **React Navigation** pour la navigation
- **Axios** pour les appels API
- **AsyncStorage** pour le stockage local
- **React Context** pour la gestion d'état
- **Expo Router** pour la navigation moderne

## 📋 Prérequis

- **Node.js** (version 18 ou supérieure)
- **npm** ou **yarn**
- **Expo CLI** : `npm install -g @expo/cli`
- **Git**

### 📱 Pour le développement mobile
- **iOS** : Xcode et simulateur iOS (macOS uniquement)
- **Android** : Android Studio et émulateur Android
- **Appareil physique** : Application Expo Go

## ⚡ Installation Rapide

1. **Cloner le dépôt**
   ```bash
   git clone [URL_DU_REPO]
   cd CynaStoreMobile
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configuration de l'environnement**
   ```bash
   # Copier le fichier d'exemple
   cp .env.example .env
   
   # Éditer les variables d'environnement
   API_URL=http://localhost:3000/api
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Lancer l'application**
   ```bash
   npm start
   # ou
   yarn start
   ```

## 🎯 Commandes de Développement

### Lancement par Plateforme
```bash
# iOS (macOS uniquement)
npm run ios

# Android
npm run android

# Web
npm run web

# Toutes les plateformes
npm start
```

### Build de Production
```bash
# Build pour iOS
npm run build:ios

# Build pour Android
npm run build:android

# Build pour EAS
eas build --platform all
```

## 📁 Architecture du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── AuthModal.js    # Modal d'authentification
│   ├── BackgroundEffects.js
│   └── ThemeToggle.js  # Basculement de thème
├── config/             # Configuration
│   ├── api.js         # Configuration API
│   └── constants.js   # Constantes globales
├── context/           # Contextes React
│   ├── AuthContext.js # Gestion authentification
│   └── ThemeContext.js # Gestion thème
├── navigation/        # Navigation
│   └── AppNavigator.js
├── screens/          # Écrans de l'application
│   ├── auth/         # Écrans d'authentification
│   ├── shop/         # Écrans boutique
│   ├── profile/      # Écrans profil
│   └── ...
├── services/         # Services API
│   ├── authService.js
│   ├── cartService.js
│   ├── userService.js
│   └── ...
└── utils/           # Utilitaires
    ├── auth.js
    ├── clipboardService.js
    └── useDeepLinking.js
```

## 🔌 Intégration API

L'application se connecte à l'API CynaStore via les endpoints suivants :

| Service | Endpoint | Description |
|---------|----------|-------------|
| **Authentification** | `/api/auth/*` | Connexion, inscription, tokens |
| **Articles** | `/api/articles/*` | Catalogue et détails produits |
| **Panier** | `/api/cart/*` | Gestion panier et commandes |
| **Utilisateur** | `/api/user/*` | Profil et paramètres |
| **Entreprises** | `/api/companies/*` | Annuaire entreprises |

## ⚙️ Configuration

### Variables d'Environnement

Créer un fichier `.env` à la racine :

```env
# API Configuration
API_URL=http://localhost:3000/api
NEXTAUTH_URL=http://localhost:3000

# Configuration Expo
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### Configuration Réseau

Pour tester sur appareil physique, utiliser l'IP locale :
```env
API_URL=http://192.168.1.100:3000/api
```

## 🐛 Dépannage

### Problèmes Courants

| Problème | Solution |
|----------|----------|
| **Erreur Metro** | `npm start -- --clear` |
| **Simulateur iOS bloqué** | Redémarrer Xcode |
| **Émulateur Android lent** | Augmenter la RAM dans AVD |
| **Connexion API échoue** | Vérifier l'URL et le réseau |

### Commandes de Nettoyage
```bash
# Vider le cache Metro
npx expo start --clear

# Réinstaller les dépendances
rm -rf node_modules && npm install

# Réinitialiser Expo
npx expo install --fix
```

## 📱 Fonctionnalités Avancées

### 🔄 Deep Linking
- Navigation directe vers produits
- Partage de liens d'articles
- Intégration avec les réseaux sociaux

### 🎨 Thème Dynamique
- Mode clair/sombre automatique
- Personnalisation des couleurs
- Adaptation au système

### 📊 Analytics
- Suivi des interactions utilisateur
- Métriques de performance
- Rapports d'utilisation

## 🌐 Démo web publique

Le mode démo sert de vitrine portfolio. Il ne contacte pas l’API de production ni Stripe. Toutes les lectures et écritures restent en mémoire, puis dans `localStorage` (clé `cyna_demo_state_v1`) sur le web.

Activer le drapeau au moment du build :

```bash
EXPO_PUBLIC_DEMO=1 npx expo export --platform web
```

Sans ce drapeau, l’application continue d’utiliser l’API configurée par `API_URL` (production par défaut). Le fichier `vercel.json` fixe déjà la commande de build et le dossier de sortie.

### Projet Vercel `cynastore-mobile-demo`

| Réglage | Valeur |
| --- | --- |
| Nom du projet | `cynastore-mobile-demo` |
| Framework | Other |
| Racine | `.` |
| Commande d’installation | `npm install` |
| Commande de build | `EXPO_NO_TELEMETRY=1 EXPO_PUBLIC_DEMO=1 npx expo export --platform web` |
| Dossier de sortie | `dist` |
| Variable d’environnement | `EXPO_PUBLIC_DEMO` = `1` |

La variable est aussi injectée par la commande de build, donc le site statique reste en démo même si le tableau de bord Vercel n’a pas encore la variable. La définir quand même évite qu’une commande de build modifiée retombe sur la production.

## 🤝 Contribution

1. **Forker** le projet
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commiter** les changements (`git commit -m 'Add AmazingFeature'`)
4. **Pousser** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### Standards de Code
- Utiliser ESLint et Prettier
- Suivre les conventions React Native
- Ajouter des tests pour les nouvelles fonctionnalités
- Documenter les changements importants

## 📄 Licence

Ce projet est sous licence **MIT**.

---

**Développé avec ❤️ par l'équipe CynaStore**
