import fs from 'fs';
import path from 'path';

/**
 * Adds a nested property to an object based on an array of keys.
 * If the keys do not exist in the object, they will be created as empty objects.
 *
 * @param {Object} obj - The object to which the nested property will be added.
 * @param {string[]} keys - An array of keys representing the path to the nested property.
 * @returns {{ obj: Object, lastKey: Object }} - An object containing the original object and the last key reached.
 *
 * @example
 * const myObj = {};
 * const result = addNestedProperty(myObj, ['a', 'b', 'c']);
 * console.log(myObj); // { a: { b: { c: {} } } }
 * console.log(result.lastKey); // {}
 */
const addNestedProperty = (obj: { [key: string]: any }, keys: string[]) => {
  let current = obj;

  for (const key of keys) {
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }

  return { obj, lastKey: current };
};

/**
 * Loads internationalization (i18n) translations from JSON files located in a specified directory.
 *
 * This function reads all JSON files from the specified `dictionariesPath` for the given `locale`,
 * and merges their contents into a single translations object. The JSON files should be organized in a
 * directory structure that reflects the desired nested properties of the translations.
 *
 * @param {string} dictionariesPath - The relative path to the directory containing the translation JSON files.
 * @param {string} locale - The locale for which translations should be loaded (e.g., 'en', 'fr').
 * @returns {Object} An object containing the merged translations from all JSON files.
 *
 * @throws {Error} If there is an issue reading the directory or files, an error will be logged to the console.
 *
 * @example
 * const translations = loadI18nTranslations('./locales/', 'en');
 * console.log(translations);
 */
export const loadI18nTranslations = (
  dictionariesPath: string,
  locale: string
) => {
  const relativePath = dictionariesPath + locale;
  const absolutePath = path.join(process.cwd(), relativePath);

  let translations = {};

  try {
    const files = fs.readdirSync(absolutePath, { recursive: true });
    files.forEach((file) => {
      if (typeof file === 'string' && file.endsWith('.json')) {
        const fileParents = file
          .split('\\')
          .filter((parent) => parent !== 'index.json');
        const filePath = path.join(absolutePath, file);
        const fileTranslations = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Object {}
        translations = {
          ...translations,
        };

        const { lastKey } = addNestedProperty(translations, fileParents);

        Object.assign(lastKey, fileTranslations);
      }
    });
  } catch (error) {
    console.error(
      'The following error occured in loader in next-intl-split.',
      error
    );
  }

  return translations;
};
