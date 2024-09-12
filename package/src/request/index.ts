import { loadMessages } from '../load';

const fixPath = (pathStr: string) =>
  pathStr.endsWith('/') ? pathStr : pathStr + '/';

export const getSplittedRequestConfig = async (
  dictionariesPath: string,
  locale: string
) => {
  let localeMessage = {};

  if (process.env.NODE_ENV === 'production') {
    localeMessage = (await import(`${fixPath(dictionariesPath)}${locale}.json`))
      .default;
  }

  if (process.env.NODE_ENV === 'development') {
    const messages = loadMessages(dictionariesPath);

    localeMessage = Object.entries(messages).filter(
      (localeMessage) => localeMessage[0] === locale
    )[0][1];
  }

  return { messages: localeMessage };
};
