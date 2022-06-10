import { HelperOptions } from 'handlebars';

const isStringArray = (value: unknown): value is string[] =>
  typeof value === 'object' &&
  value !== null &&
  Array.isArray(value) &&
  (value as any[]).length > 0 &&
  typeof (value as any[])[0] === 'string';

const isString = (value: unknown): value is string => typeof value === 'string';

const orOperator = ' OR ';
type StringCompareStrategy =
  | 'equals'
  | 'starts-with'
  | 'ends-with'
  | 'contains';

interface IfSatisfyFlags {
  isInverted: boolean;
  ignoreCase: boolean;
  ignoreSpace: boolean;
  ignorePunctuation: boolean;
  compareStrategy: StringCompareStrategy;
}
const withIgnoreCase = (flags: IfSatisfyFlags, text: string): string =>
  flags.ignoreCase ? text.toLowerCase() : text;

const withIgnoreSpace = (flags: IfSatisfyFlags, text: string): string =>
  flags.ignoreSpace ? text.replace(/\s+/g, '') : text;

const withIgnorePunctuation = (flags: IfSatisfyFlags, text: string): string =>
  flags.ignorePunctuation ? text.replace(/[^\d\sA-Za-z]/g, '') : text;

const withAllIgnore = (flags: IfSatisfyFlags, text: string): string =>
  withIgnorePunctuation(
    flags,
    withIgnoreSpace(flags, withIgnoreCase(flags, text))
  );

const stringCompare =
  (flags: IfSatisfyFlags) =>
  (actual: string, expected: string): boolean => {
    const actualString = withAllIgnore(flags, actual);
    const expectedString = withAllIgnore(flags, expected);
    switch (flags.compareStrategy) {
      case 'equals':
        return actualString === expectedString;
      case 'contains':
        return actualString.includes(expectedString);
      case 'starts-with':
        return actualString.startsWith(expectedString);
      case 'ends-with':
        return actualString.endsWith(expectedString);
    }
  };

const parseFlags = (value: string): IfSatisfyFlags => {
  const flags = new Set(value.split(' ').map((s) => s.trim()));
  const isInverted = flags.has('not');
  const ignoreCase = flags.has('ignore-case');
  const ignoreSpace = flags.has('ignore-space');
  const ignorePunctuation = flags.has('ignore-punctuation');
  let compareStrategy: StringCompareStrategy = 'equals';
  if (flags.has('starts-with')) {
    compareStrategy = 'starts-with';
  }
  if (flags.has('ends-with')) {
    compareStrategy = 'ends-with';
  }
  if (flags.has('contains')) {
    compareStrategy = 'contains';
  }

  return {
    isInverted,
    ignoreCase,
    ignoreSpace,
    ignorePunctuation,
    compareStrategy,
  };
};

const asAlternativeExpected = (expected: string): string[] =>
  expected.includes(orOperator) ? expected.split(orOperator) : [expected];

const ifSatisfyForString = (
  flags: IfSatisfyFlags,
  value: string,
  expected: string
): boolean => {
  const anyExpected = asAlternativeExpected(expected);
  const found = anyExpected.some((expectedOption: string) =>
    stringCompare(flags)(value, expectedOption)
  );
  return found;
};

export const ifSatisfyForStringList = (
  flags: IfSatisfyFlags,
  values: string[],
  expected: string
): boolean => {
  const anyExpected = asAlternativeExpected(expected);
  const compare = (expectedOption: string) => (value: string) =>
    stringCompare(flags)(value, expectedOption);

  const found = anyExpected.some((expectedOption) =>
    values.some(compare(expectedOption))
  );
  return found;
};

export const ifSatisfyHelper = (
  flags: string,
  value: unknown,
  expected: string
): boolean => {
  const currentFlags = parseFlags(flags);

  if (isStringArray(value)) {
    const result = ifSatisfyForStringList(currentFlags, value, expected);
    return currentFlags.isInverted ? !result : result;
  }
  if (isString(value)) {
    const result = ifSatisfyForString(currentFlags, value, expected);
    return currentFlags.isInverted ? !result : result;
  }
  return false;
};

export const ifSatisfy = (
  flags: string,
  value: unknown,
  expected: string,
  options: HelperOptions
) => {
  const result = ifSatisfyHelper(flags, value, expected);
  return result ? options.fn(this) : options.inverse(this);
};

const isAnyArray = (value: unknown): value is any[] =>
  typeof value === 'object' && value !== null && Array.isArray(value);

export const replaceAll =
  (search: string, replaceValue: string) =>
  (text: string): string =>
    text.split(search).join(replaceValue);

const newLine = ' newline';
const replaceAllNewLines = replaceAll(newLine, '');
const countNewLines = (text: string): number => text.split(newLine).length - 1;

export const listJoin = (
  separator: string,
  value: unknown,
  options: HelperOptions
) => {
  if (!isAnyArray(value)) {
    return options.inverse(this);
  }
  const items = value.map((item) => options.fn(item));
  const newLinesCount = countNewLines(separator);
  const realSeparator =
    newLinesCount > 0
      ? replaceAllNewLines(separator) + '\n'.repeat(newLinesCount)
      : separator;
  return items.join(realSeparator);
};
