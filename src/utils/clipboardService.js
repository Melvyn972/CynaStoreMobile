import * as Clipboard from 'expo-clipboard';

/**
 * Vérifie si une chaîne ressemble à un token d'authentification
 * @param {string} content - Le contenu à vérifier
 * @returns {boolean} - True si le contenu ressemble à un token
 */
export const isValidTokenFormat = (content) => {
  // Pattern pour un token: au moins 20 caractères alphanumériques
  const tokenPattern = /^[a-zA-Z0-9]{20,}$/;
  return tokenPattern.test(content?.trim());
};

/**
 * Lit le contenu du presse-papiers et vérifie s'il s'agit d'un token valide
 * @returns {Promise<{hasToken: boolean, token: string|null}>}
 */
export const checkClipboardForToken = async () => {
  try {
    const clipboardContent = await Clipboard.getStringAsync();
    const trimmedContent = clipboardContent?.trim();
    
    if (isValidTokenFormat(trimmedContent)) {
      return {
        hasToken: true,
        token: trimmedContent
      };
    }
    
    return {
      hasToken: false,
      token: null
    };
  } catch (error) {
    console.error('Erreur lors de la lecture du presse-papiers:', error);
    return {
      hasToken: false,
      token: null
    };
  }
};

/**
 * Écrit un token dans le presse-papiers
 * @param {string} token - Le token à copier
 * @returns {Promise<boolean>} - True si la copie a réussi
 */
export const copyTokenToClipboard = async (token) => {
  try {
    await Clipboard.setStringAsync(token);
    return true;
  } catch (error) {
    console.error('Erreur lors de la copie dans le presse-papiers:', error);
    return false;
  }
};

/**
 * Hook personnalisé pour surveiller le presse-papiers
 * @param {Function} onTokenDetected - Callback appelé quand un token est détecté
 * @param {number} interval - Intervalle de vérification en ms (défaut: 2000)
 */
export const useClipboardTokenDetection = (onTokenDetected, interval = 2000) => {
  const { useEffect, useRef } = require('react');
  const lastTokenRef = useRef('');
  
  useEffect(() => {
    const checkForToken = async () => {
      const { hasToken, token } = await checkClipboardForToken();
      
      if (hasToken && token !== lastTokenRef.current) {
        lastTokenRef.current = token;
        onTokenDetected(token);
      }
    };
    
    // Vérification initiale
    checkForToken();
    
    // Vérification périodique
    const intervalId = setInterval(checkForToken, interval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [onTokenDetected, interval]);
}; 