import { FileId, FileType } from './model';

const capitalizeWord = (text: string): string =>
  text.length > 0 ? text[0]?.toUpperCase() + text.slice(1).toLowerCase() : '';
const wordToCamel = (text: string, index: number): string =>
  index === 0 ? text.toLowerCase() : capitalizeWord(text);
/**
 * Split a string by Space
 * @param text the text to split
 */
const splitBySpace = (text: string): string[] => text.split(' ');

/**
 * split some text when a character changes case ( uppercase <-> lowercase)
 * @example camelCase camel Case
 */
export const splitOnCaseChange = (text: string): string[] =>
  text.replace(/([\da-z])([A-Z])/g, '$1 $2').split(' ');

export const firstUpper = (text: string) => {
  return text.slice(0, 1).toUpperCase() + text.slice(1);
};

export const firstLower = (text: string) => {
  return text.slice(0, 1).toLowerCase() + text.slice(1);
};

export const toTitle = (text: string): string =>
  firstUpper(splitOnCaseChange(text).map(firstLower).join(' '));

export const upperCamelCase = (text: string): string => {
  const splitted = text.includes(' ')
    ? splitBySpace(text)
    : splitOnCaseChange(text);
  const newText = splitted.map(wordToCamel).join('');
  return newText.slice(0, 1).toUpperCase() + newText.slice(1);
};

export const lowerCamelCase = (text: string): string =>
  firstLower(upperCamelCase(text));

export const dasherize = (text: string): string => {
  const splitted = text.includes(' ')
    ? splitBySpace(text)
    : splitOnCaseChange(text);
  const newText = splitted.map((w) => w.toLowerCase()).join('-');
  return newText;
};
export const getFileType = (filename: string): FileType => {
  if (filename.trimEnd().endsWith('.elm')) {
    return 'elm';
  } else if (filename.trimEnd().endsWith('.json')) {
    return 'json';
  } else if (filename.trimEnd().endsWith('.yaml')) {
    return 'yaml';
  } else if (
    filename.trimEnd().endsWith('.handlebars') ||
    filename.trimEnd().endsWith('.hbs')
  ) {
    return 'handlebars';
  } else if (filename.trimEnd().endsWith('.md')) {
    return 'markdown';
  }
  return 'unknown';
};

export const getFileIdentifier = (filename: string): FileId => ({
  filename,
  fileType: getFileType(filename),
});

export const getFileIdentifiers = (filenames: string[]): FileId[] =>
  filenames.map(getFileIdentifier);


