import { FileId, FileType } from './model';

const capitalizeWord = (text: string): string =>
  text.length > 0 ? text[0]?.toUpperCase() + text.slice(1).toLowerCase() : '';
const wordToCamel = (text: string, index: number): string =>
  index === 0 ? text.toLowerCase() : capitalizeWord(text);

const splitBySpace = (text: string): string[] => text.split(' ');

export const splitOnCaseChange = (text: string): string[] =>
  text.replace(/([\da-z])([A-Z])/g, '$1 $2').split(' ');

const isNullOrUndefined = (value: unknown): value is null | undefined =>
  typeof value === 'undefined' || value === null;

export const firstUpper = (text: string | null | undefined) => {
  return isNullOrUndefined(text)
    ? ''
    : text.slice(0, 1).toUpperCase() + text.slice(1);
};

export const firstLower = (text: string | null | undefined) => {
  return isNullOrUndefined(text)
    ? ''
    : text.slice(0, 1).toLowerCase() + text.slice(1);
};

export const toTitle = (text: string | null | undefined): string =>
  isNullOrUndefined(text)
    ? ''
    : firstUpper(splitOnCaseChange(text).map(firstLower).join(' '));

export const upperCamelCase = (text: string | null | undefined): string => {
  const textOrEmpty = isNullOrUndefined(text) ? '' : text;
  const splitted = textOrEmpty.includes(' ')
    ? splitBySpace(textOrEmpty)
    : splitOnCaseChange(textOrEmpty);
  const newText = splitted.map(wordToCamel).join('');
  return newText.slice(0, 1).toUpperCase() + newText.slice(1);
};

export const lowerCamelCase = (text: string | null | undefined): string =>
  firstLower(upperCamelCase(text));

export const dasherize = (text: string | null | undefined): string => {
  const textOrEmpty = isNullOrUndefined(text) ? '' : text;
  const splitted = textOrEmpty.includes(' ')
    ? splitBySpace(textOrEmpty)
    : splitOnCaseChange(textOrEmpty);
  const newText = splitted.map((w) => w.toLowerCase()).join('-');
  return newText;
};
export const getFileType = (filename: string): FileType => {
  if (filename.trimEnd().endsWith('.elm')) {
    return 'elm';
  } else if (filename.trimEnd().endsWith('.json')) {
    return 'json';
  } else if (
    filename.trimEnd().endsWith('.yaml') ||
    filename.trimEnd().endsWith('.yml')
  ) {
    return 'yaml';
  } else if (
    filename.trimEnd().endsWith('.handlebars') ||
    filename.trimEnd().endsWith('.hbs')
  ) {
    return 'handlebars';
  } else if (filename.trimEnd().endsWith('.md')) {
    return 'markdown';
  } else if (filename.trimEnd().endsWith('.sh')) {
    return 'bash';
  } else if (filename.trimEnd().endsWith('.txt')) {
    return 'text';
  } else if (filename.trimEnd().endsWith('.csv')) {
    return 'csv';
  }
  return 'unknown';
};

export const getFileIdentifier = (filename: string): FileId => ({
  filename,
  fileType: getFileType(filename),
});

export const getFileIdentifiers = (filenames: string[]): FileId[] =>
  filenames.map(getFileIdentifier);

export const dropExtension = (filename: string): string =>
  filename.includes('.')
    ? filename.split('.').slice(0, -1).join('.')
    : filename;
