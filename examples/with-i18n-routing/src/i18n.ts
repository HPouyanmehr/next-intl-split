import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { loadI18nTranslations } from 'next-intl-split';

import { locales } from '@/i18n/locales';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  const messages = loadI18nTranslations('./src/messages/', locale);

  return {
    messages,
  };
});
