import { getLocale, getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { locales } from '@/i18n/locales';

export default async function Home() {
  const currentLocale = await getLocale();
  const translate = await getTranslations({
    locale: currentLocale,
    namespace: 'home.hero',
  });

  return (
    <main className='flex flex-col gap-4 items-center justify-center h-screen w-full'>
      <h1 className='text-5xl font-extrabold'>{translate('title')}</h1>
      <div className='flex gap-2'>
        {locales.map((locale) => (
          <Link
            key={locale}
            href='/'
            locale={locale}
            className={`border-2 border-rose-600 px-4 py-1 rounded-lg hover:bg-rose-200 text-lg ${
              locale === currentLocale ? 'text-white' : ''
            } ${locale === currentLocale ? 'bg-rose-300' : ''}`}
          >
            {translate(`buttons.${locale}`)}
          </Link>
        ))}
      </div>
    </main>
  );
}
