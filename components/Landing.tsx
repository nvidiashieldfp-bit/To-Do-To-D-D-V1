
/**
 * ============================================================================
 * FILE: components/Landing.tsx
 * PURPOSE: Public landing page component.
 * RESPONSIBILITY: Presents the application value proposition and provides
 * a high-conversion gateway into the main task management interface.
 * ============================================================================
 */

import React from 'react';
import { motion } from 'framer-motion';
import { SupportedLanguage } from '../types';
import { t } from '../constants';

const LandingSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <motion.section 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="py-16 md:py-24 border-b border-gray-100 dark:border-white/5 last:border-0"
  >
    <h3 className="text-indigo-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-8 md:mb-12">
      {title}
    </h3>
    <div className="max-w-xl mx-auto md:mx-0">
      {children}
    </div>
  </motion.section>
);

export const Landing: React.FC<{ onOpenApp: () => void; language: SupportedLanguage }> = ({ onOpenApp, language }) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="selection:bg-indigo-500 selection:text-white flex-1 flex flex-col bg-comfort-light dark:bg-black transition-colors duration-500">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl"
        >
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-4 text-gray-900 dark:text-white">
            {t('landing_title', language)}
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 dark:text-gray-400 font-medium mb-12">
            {t('tagline', language)}
          </p>

          <div className="mb-16 md:mb-24">
            <h2 className="text-2xl md:text-3xl font-light text-gray-700 dark:text-gray-300 leading-relaxed max-w-lg mx-auto">
              {t('landing_subtitle', language)}
            </h2>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenApp}
            className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-semibold shadow-2xl shadow-indigo-500/20 transition-all text-lg"
          >
            {t('landing_open', language)}
          </motion.button>
        </motion.div>
      </section>

      <div className="max-w-4xl mx-auto px-6 w-full">
        <LandingSection title={t('landing_what_title', language)}>
          <div className="space-y-6 text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-light leading-relaxed">
            <p>{t('landing_what_p1', language)}</p>
            <ul className="space-y-2 text-gray-500">
              {t('landing_what_list', language).split(',').map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p className="text-gray-900 dark:text-white font-medium">
              {t('landing_what_p2', language)}
            </p>
          </div>
        </LandingSection>

        <LandingSection title={t('landing_how_title', language)}>
          <div className="space-y-12">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex gap-6">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 text-indigo-500 text-[10px] font-bold">
                  {step}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t(`landing_how_${step}_t`, language)}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-400 text-lg">
                    {t(`landing_how_${step}_d`, language)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </LandingSection>

        <LandingSection title={t('landing_why_title', language)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg font-light text-gray-700 dark:text-gray-400">
            {[1, 2, 3, 4].map(num => (
              <div key={num} className="p-8 rounded-3xl bg-gray-200/40 dark:bg-white/5 border border-gray-200/50 dark:border-transparent">
                <span className="text-indigo-500 block mb-4 icon-muted" style={{ opacity: 'var(--icon-opacity)' }}>●</span>
                {t(`landing_why_${num}`, language)}
              </div>
            ))}
          </div>
        </LandingSection>

        <LandingSection title={t('landing_privacy_title', language)}>
          <div className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-light leading-relaxed">
            <p className="mb-8">{t('landing_privacy_p1', language)}</p>
            <div className="flex flex-wrap gap-x-8 gap-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              {t('landing_privacy_list', language).split(',').map((p, i) => (
                <span key={i} className="flex items-center gap-2">
                   <span className="w-1 h-1 bg-gray-400 dark:bg-gray-600 rounded-full icon-muted" style={{ opacity: 'var(--icon-opacity)' }} /> {p}
                </span>
              ))}
            </div>
          </div>
        </LandingSection>

        <footer className="py-24 text-center border-t border-gray-200 dark:border-white/5">
          <div className="flex items-center justify-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-4">
            <span>TD {currentYear}</span>
            <span className="w-1 h-1 bg-indigo-500 rounded-full icon-muted" style={{ opacity: 'var(--icon-opacity)' }} />
            <span className="text-gray-900 dark:text-white">{t('landing_title', language)}</span>
          </div>
          <p className="text-xs text-gray-400 italic">
            {t('landing_footer', language)}
          </p>
        </footer>
      </div>
    </div>
  );
};
