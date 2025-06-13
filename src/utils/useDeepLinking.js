import { useEffect } from 'react';
import * as Linking from 'expo-linking';

const useDeepLinking = (onAuthLink) => {
  useEffect(() => {
    const handleDeepLink = async (url) => {
      if (url) {
        const { hostname, path, queryParams } = Linking.parse(url);
        
        if (hostname === 'auth' && path === '/verify' && queryParams?.token) {
          try {
            await onAuthLink(queryParams.token);
          } catch (error) {
            console.error('Deep link auth error:', error);
          }
        }
      }
    };

    // Gérer l'URL initiale (app ouverte via deep link)
    const getInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }
    };

    // Gérer les URL reçues quand l'app est déjà ouverte
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    getInitialURL();

    return () => {
      subscription?.remove();
    };
  }, [onAuthLink]);
};

export default useDeepLinking; 