import path from 'path';
import { existsSync } from 'fs';

import { loadMessages } from '../load';
import { writeMessages } from '../write';

const isRelativePath = (pathToCheck: string) => pathToCheck.startsWith(`./`);
const doesPathExist = (pathToCheck: string) => existsSync(pathToCheck);

export const mergeMessages = (pathToDictionaries: string) => {
  const pathIsRelative = isRelativePath(pathToDictionaries);

  if (!pathIsRelative) {
    throw new Error(
      `Please provide the RELATIVE path to the dictionaries folder. Like, ./src/i18n/dictionaries`
    );
  }

  const absolutePath = path.resolve(process.cwd(), pathToDictionaries);

  const pathExist = doesPathExist(absolutePath);

  if (!pathExist) {
    throw new Error(
      `The provided path to the dictionaries does not exist! ${absolutePath}`
    );
  }

  const messages = loadMessages(absolutePath);

  writeMessages(absolutePath, messages);
};
