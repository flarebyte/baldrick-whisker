import { HelperOptions } from 'handlebars';

const isStringArray = (value: unknown): value is string[] => typeof value === 'object' &&
  value !== null &&
  Array.isArray(value) &&
  (value as any[]).length > 0 &&
  typeof (value as any[])[0] === 'string';
const isString = (value: unknown): value is string => typeof value === 'string';
type StringCompareStrategy = 'eq' | 'ignoreCase';
const stringCompare = (strategy: StringCompareStrategy) => (actual: string, expected: string): boolean => true;
const orOperator = ' OR ';

export const ifHasString = (
  value: unknown,
  expected: string,
  flags: string | undefined,
  options: HelperOptions
) => {
  const flagSet = flags
    ? new Set(flags.split(' ').map((s) => s.trim()))
    : new Set();
  const anyExpected: string[] = expected.includes(orOperator)
    ? expected.split(orOperator)
    : [expected];
  console.log(expected);
  if (isStringArray(value)) {
    const found = anyExpected.some((search) => value.includes(search));
    return found ? options.fn(this) : options.inverse(this);
  }
  if (isString(value)) {
    const found = anyExpected.some((search) => value.includes(search));
    return found ? options.fn(this) : options.inverse(this);
  }
  return options.inverse(this);
};
