export function formatUrl (str: string): string {
  if (!str) return '';

  const regex = /^https?:\/\//;
  return regex.test(str)
    ? str
    : 'https://' + str;
}
