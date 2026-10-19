import { Dimensions, Platform } from 'react-native';
import { IS_DEMO } from '../config/demo';

// Keep the public demo inside a phone column on a desktop portfolio page.
// Screens read Dimensions once at import time, so this module must be
// imported before the app tree.
const PHONE_MAX_WIDTH = 430;

if (IS_DEMO && Platform.OS === 'web' && typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.setAttribute('data-cyna-demo', 'frame');
  style.textContent = `
    html, body, #root {
      height: 100%;
      margin: 0;
    }
    body {
      background: #0b1020;
      overflow: hidden;
    }
    #root {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: ${PHONE_MAX_WIDTH}px;
      height: 100%;
      margin: 0 auto;
      background: #ffffff;
      position: relative;
      overflow: hidden;
    }
    @media (min-width: ${PHONE_MAX_WIDTH + 1}px) {
      #root {
        box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(0,0,0,0.35);
      }
    }
  `;
  document.head.appendChild(style);
  document.documentElement.lang = 'fr';
  document.title = 'CynaStore — Démo';

  const originalGet = Dimensions.get.bind(Dimensions);
  Dimensions.get = (dim) => {
    const result = originalGet(dim);
    if (dim === 'window' || dim === 'screen') {
      return {
        ...result,
        width: Math.min(result.width, PHONE_MAX_WIDTH),
      };
    }
    return result;
  };
}
