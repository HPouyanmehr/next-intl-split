import { existsSync, readdirSync, readFileSync } from 'fs';
import { AbstractIntlMessages } from 'next-intl';
import path from 'path';

import { writeMessages } from '../write';

const FILE_NAME = 'index.json';

const doesPathExist = (pathToCheck: string) => existsSync(pathToCheck);

const isAJSONFilePath = (filePath: string): boolean =>
  filePath.includes(FILE_NAME) && filePath.includes(path.sep);

const createNestedObject = (obj: { [key: string]: any }, keys: string[]) => {
  let current = obj;

  for (const key of keys) {
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }

  return { obj, lastKey: current };
};

export const loadI18nTranslations = (
  dictionariesPath: string,
  locale: string,
  enableTypeCheck?: boolean
) => {
  const allMessages = loadMessages(dictionariesPath);

  const localeMessages = Object.entries(allMessages).filter(
    (localeMessage) => localeMessage[0] === locale
  )[0][1];

  if (enableTypeCheck) {
    const absolutePath = path.resolve(process.cwd(), dictionariesPath);

    const pathExist = doesPathExist(absolutePath);

    if (pathExist) {
      writeMessages(absolutePath, allMessages, { muteLogs: true });
    }
  }

  return localeMessages as AbstractIntlMessages;
};

export const loadMessages = (dictionariesPath: string) => {
  let messages: { [key: string]: any } = {};

  try {
    const files = readdirSync(dictionariesPath, { recursive: true });

    for (let filePathIndex = 0; filePathIndex < files.length; filePathIndex++) {
      const file = files[filePathIndex];

      if (typeof file === 'string' && isAJSONFilePath(file)) {
        const fileParents = file
          .split(path.sep)
          .filter((parent) => parent !== FILE_NAME);

        const pathToFile = path.resolve(process.cwd(), dictionariesPath, file);
        const fileMessages = JSON.parse(readFileSync(pathToFile, 'utf-8'));

        messages = {
          ...messages,
        };

        const { lastKey } = createNestedObject(messages, fileParents);

        Object.assign(lastKey, fileMessages);
      }
    }
  } catch (error) {
    console.error(
      'The following error occured in loader in next-intl-split.',
      error
    );
  }

  return messages;
};
