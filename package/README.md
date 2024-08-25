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

After installation,

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
    // Persian
    └── en
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

In the `getRequestConfig` function, wrap the `messages` object with `loadI18nTranslations` utility.

- With i18n routing

```ts
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { loadI18nTranslations } from 'next-intl-split';

// Can be imported from a shared config
const locales = ['en', 'de'];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  const messages = loadI18nTranslations(locale);

  return {
    messages,
  };
});
```

- Without i18n routing

```ts
import { getRequestConfig } from 'next-intl/server';
import { loadI18nTranslations } from 'next-intl-split';

export default getRequestConfig(async () => {
  const locale = 'en';

  const messages = loadI18nTranslations(locale);

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
  const messages = loadI18nTranslations(context.locale);

  return {
    props: {
      messages,
    },
  };
}
```
