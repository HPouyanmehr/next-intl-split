# About

A loader for [next-intl](https://next-intl-docs.vercel.app/) to split translation files properly inside a [Next.js](https://nextjs.org/) app. Using `next-intl-split` you can separate your translations for maintaining purposes while the package automatically merges the content into a single translation object.

## Table of Contents

- <a href="#installation">Installation</a>
- <a href="#pros">What about `next-intl` built-in split approach?</a>
- <a href="#how_to_use">How to use the package?</a>

## <a id="installation"></a> Installation

Run the following command to install the package:

```bash
npm i next-intl-split
```

**Note**: You need to have the `next.js` and `next-intl` installed to make the `next-intl-split` work as expected.

## <a id="pros"></a>What about `next-intl` built-in split approach?

The approach provided by [`next-intl`](https://next-intl-docs.vercel.app/docs/usage/configuration#messages-split-files) itself can be convincing but as it puts everything together, you may end up with duplicated names or very long key names for your translation strings. So in some cases, this can be its cons:

- Long prefixes for a name to avoid conflicts like `homeHeroMainButtonTitle`
- You may not be able to use the `namespace` approach properly.

On the other hand `next-intl-split` is a tiny package (just a few utilities to help you) that lets you have a cleaner way of managing your translations and not worry about naming conflicts.

- No need to worry about the prefixes as they will automatically be prefixed by the parent's folder name. You split your files and you can have something like this `home.hero.button.main`
- Have the `namespace` approach. Using the namespace the above name could be like `button.main`
- Split translations freely, without worrying about hardcoding the file names in the `getRequestConfig` utility.
- Smaller `JSON` files.
- Cleaner `JSON` files.

## <a id="how_to_use"></a> How to use the package?

If you're going to deploy to a serverless deployment environment like Vercel, you need to do some extra stuff that is mentioned.

- Edit the `next.config.js` to use the plugin from `next-intl-split` rather that `next-intl`
- Edit the `getRequestConfig` file to conditionally load translations based on production or development environments.
- Build once before deployment

With that in mind, after installing the package:

### Step One

In your desired path, create your dictionaries (or whatever you name that). **It is important to name the translation files `index.json`**

Example view of translation files:

```js
// /src/i18n
└── dictionaries
    // English
    ├── en
    |   ├── shared
    |   |   └── header
    |   |       └── index.json
    |   ├── home
    |   |   ├── hero
    |   |   |   └── index.json
    |   |   └── featured
    |   |       └── index.json
    |   └── about
    |       └── hero
    |           └── index.json
    // Spanish
    ├── es
    |   ├── shared
    |   |   └── header
    |   |       └── index.json
    |   ├── home
    |   |   ├── hero
    |   |   |   └── index.json
    |   |   └── featured
    |   |       └── index.json
    |   └── about
    |       └── hero
    |           └── index.json
    // Persian
    └── fa
        ├── shared
        |   └── header
        |       └── index.json
        ├── home
        |   ├── hero
        |   |   └── index.json
        |   └── featured
        |       └── index.json
        └── about
            └── hero
                └── index.json
```

### Step Two

#### App Router

##### Next Config (Only for serverless deployment environments)

Use `next-intl-split` plugin instead of the `next-intl` one. Make sure the config file format is `js` and not `mjs`.

```js
const createNextIntlSplitPlugin = require('next-intl-split/plugin');

const withNextIntlSplitPlugin = createNextIntlSplitPlugin(
  './src/core/i18n/dictionaries', // REQUIRED relative path to dictionaries folder starting from src folder.
  './src/core/i18n/request.ts' // OPTIONAL Relative path if you've changed the next-intl request module path.
);

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withNextIntlSplitPlugin(nextConfig);
```

This plugin will merge the messages into a single file at the build time.

##### Request Config (Non serverless environment)

In the `getRequestConfig` function, wrap the `messages` object with `loadI18nTranslations` utility.

- With i18n routing

```ts
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { loadI18nTranslations } from 'next-intl-split/loader';

// Can be imported from a shared config
const locales = ['en', 'es', 'fa'];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  // The provided route should starts from the src folder with the Relative approach.
  const messages = loadI18nTranslations('./src/i18n/dictionaries/', locale);

  return {
    messages,
  };
});
```

- Without i18n routing

```ts
import { getRequestConfig } from 'next-intl/server';
import { loadI18nTranslations } from 'next-intl-split/loader';

export default getRequestConfig(async () => {
  const locale = 'en';

  // The provided route should starts from the src folder with the Relative approach.
  const messages = loadI18nTranslations('./src/i18n/dictionaries/', locale);

  return {
    locale,
    messages,
  };
});
```

##### Request Config (Serverless environment like VERCEL)

In the `getRequestConfig` function:

- With i18n routing

```ts
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { loadI18nTranslations } from 'next-intl-split/loader';

// Can be imported from a shared config
const locales = ['en', 'es', 'fa'];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  // The relative path to the dictionaries folder
  let messages = (await import(`./dictionaries/${locale}.json`)).default;

  if (process.env.NODE_ENV === 'development') {
    // The provided route should starts from the src folder with the Relative approach.
    messages = loadI18nTranslations('./src/i18n/dictionaries', locale);
  }

  return {
    messages,
  };
});
```

- Without i18n routing

```ts
import { getRequestConfig } from 'next-intl/server';
import { loadI18nTranslations } from 'next-intl-split/loader';

export default getRequestConfig(async () => {
  const locale = 'en';

  // The relative path to the dictionaries folder
  let messages = (await import(`./dictionaries/${locale}.json`)).default;

  if (process.env.NODE_ENV === 'development') {
    // The provided route should starts from the src folder with the Relative approach.
    messages = loadI18nTranslations('./src/i18n/dictionaries', locale);
  }

  return {
    locale,
    messages,
  };
});
```

#### Pages Router

In the `getStaticProps` function, wrap the `messages` object with `loadI18nTranslations` utility.

```ts
// ...
export async function getStaticProps(context) {
  // The provided route should starts from the src folder with the Relative approach.
  const messages = loadI18nTranslations(
    './src/i18n/dictionaries/',
    context.locale
  );

  return {
    props: {
      messages,
    },
  };
}
```
