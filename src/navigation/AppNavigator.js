import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens (we'll create these next)
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsScreen from '../screens/TermsScreen';
import LegalScreen from '../screens/LegalScreen';
import CompaniesScreen from '../screens/CompaniesScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="About" component={AboutScreen} options={{ title: 'À propos' }} />
      <Stack.Screen name="Contact" component={ContactScreen} options={{ title: 'Contact' }} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ title: 'Politique de confidentialité' }} />
      <Stack.Screen name="Terms" component={TermsScreen} options={{ title: "Conditions d'utilisation" }} />
      <Stack.Screen name="Legal" component={LegalScreen} options={{ title: 'Mentions légales' }} />
      <Stack.Screen name="Companies" component={CompaniesScreen} options={{ title: 'Mes entreprises' }} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Accueil') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Boutique') {
              iconName = focused ? 'grid' : 'grid-outline';
            } else if (route.name === 'Panier') {
              iconName = focused ? 'cart' : 'cart-outline';
            } else if (route.name === 'Profil') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={focused ? 28 : 24} color={color} />;
          },
          tabBarActiveTintColor: '#7c3aed',
          tabBarInactiveTintColor: '#a78bfa',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            height: 68,
            shadowColor: '#a78bfa',
            shadowOpacity: 0.10,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: -2 },
            elevation: 10,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            borderTopWidth: 0,
          },
          tabBarLabelStyle: {
            fontWeight: 'bold',
            fontSize: 13,
            marginBottom: 6,
          },
          tabBarItemStyle: {
            marginTop: 6,
          },
        })}
      >
        <Tab.Screen name="Accueil" component={HomeStack} options={{ headerShown: false }} />
        <Tab.Screen name="Boutique" component={ProductsScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Panier" component={CartScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Profil" component={ProfileStack} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 