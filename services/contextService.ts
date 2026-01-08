
/**
 * ============================================================================
 * FILE: services/contextService.ts
 * PURPOSE: Context Intelligence Service.
 * RESPONSIBILITY: Detects user locale context (Language, Country, Region)
 * deterministically and securely without external network calls.
 * ============================================================================
 */

import { SupportedLanguage, SupportedCountry, SupportedRegion } from '../types';

export const detectLanguage = (): SupportedLanguage => {
  const browserLangs = navigator.languages || [navigator.language || 'en'];
  const supported: SupportedLanguage[] = ['pt', 'en', 'es', 'fr'];
  
  for (const l of browserLangs) {
    if (!l) continue;
    const code = l.split('-')[0].toLowerCase() as SupportedLanguage;
    if (supported.includes(code)) return code;
  }
  return 'en'; // Default fallback
};

export const detectCountryAndRegion = (): { country: SupportedCountry; region: SupportedRegion } => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const locale = navigator.language;

  // 1. Detection by Timezone (High Precision for PT)
  if (timezone === 'Europe/Lisbon') return { country: 'PT', region: 'PT-CONTINENTAL' };
  if (timezone === 'Atlantic/Azores') return { country: 'PT', region: 'PT-AZORES' };
  if (timezone === 'Atlantic/Madeira') return { country: 'PT', region: 'PT-MADEIRA' };

  // 2. Detection by Locale
  if (locale.includes('-PT')) return { country: 'PT', region: 'PT-CONTINENTAL' };
  if (locale.includes('-ES') || locale.toLowerCase() === 'es') return { country: 'ES', region: 'GENERIC' };
  if (locale.includes('-FR') || locale.toLowerCase() === 'fr') return { country: 'FR', region: 'GENERIC' };
  if (locale.includes('-GB')) return { country: 'GB', region: 'GENERIC' };
  if (locale.includes('-US')) return { country: 'US', region: 'GENERIC' };

  // 3. Fallback based on Language
  if (locale.startsWith('pt')) return { country: 'PT', region: 'PT-CONTINENTAL' };
  if (locale.startsWith('es')) return { country: 'ES', region: 'GENERIC' };
  if (locale.startsWith('fr')) return { country: 'FR', region: 'GENERIC' };
  
  // 4. Default
  return { country: 'US', region: 'GENERIC' };
};
