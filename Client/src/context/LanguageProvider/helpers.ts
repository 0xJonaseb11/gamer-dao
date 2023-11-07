import { languageList } from './languages';

export const getCurrentLangInfo = (code: string) => {
  return languageList.find(({ locale }) => locale === code) || languageList[0];
};
