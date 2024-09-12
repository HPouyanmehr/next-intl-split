import { writeFileSync } from 'fs';
import path from 'path';

const extractLocalesAndMessages = (messages: { [key: string]: any }) =>
  Object.entries(messages);

export const writeMessages = (dictionariesPath: string, messages: {}) => {
  const localeMessagesMap = extractLocalesAndMessages(messages);

  for (let index = 0; index < localeMessagesMap.length; index++) {
    const locale = localeMessagesMap[index][0];
    const localeMessages = localeMessagesMap[index][1];

    try {
      const pathToWrite = path.resolve(dictionariesPath, `${locale}.json`);
      const content = JSON.stringify(localeMessages, null, 2);

      writeFileSync(pathToWrite, content);
      console.log('Successfully merged JSON content');
    } catch (error) {
      console.error(
        'The following error occured in writer in next-intl-split.',
        error
      );
    }
  }
};
