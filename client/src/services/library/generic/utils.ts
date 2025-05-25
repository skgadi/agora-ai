export function getHumanReadableLangTag(langTag: string, displayLocale: string = 'en'): string {
  const [languageCode, regionCode] = langTag.split('-');

  const languageNames = new Intl.DisplayNames([displayLocale], { type: 'language' });
  const regionNames = new Intl.DisplayNames([displayLocale], { type: 'region' });

  const language = languageNames.of(languageCode || '') || languageCode || langTag;
  const region = regionCode ? regionNames.of(regionCode) : null;

  return region ? `${language} (${region})` : language;
}

export function getHumanReadableLangTagInSameLang(langTag: string): string {
  return getHumanReadableLangTag(langTag, langTag);
}
