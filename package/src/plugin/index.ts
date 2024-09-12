import createNextIntlPlugin from 'next-intl/plugin';

import { mergeMessages } from '../merge';

module.exports = function createNextIntlSplitPlugin(
  dictionariesPath: string,
  i18nPath?: string
) {
  if (process.env.NODE_ENV === 'production') {
    mergeMessages(dictionariesPath);
  }

  return createNextIntlPlugin(i18nPath);
};
