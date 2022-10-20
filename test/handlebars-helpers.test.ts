//TODO: Migrate to zest spec
import { ifSatisfyHelper } from '../src/handlebars-helpers.js';

interface TestToSatisfy {
  flags: string;
  value: unknown;
  expected: string;
}

const createIfSatisfyHelper = (
  flags: string,
  value: unknown,
  expected: string
): TestToSatisfy => ({ flags, value, expected });

describe('handlebars-helper', () => {
  test.each([
    createIfSatisfyHelper('equals', 'blue', 'blue'),
    createIfSatisfyHelper('not equals', 'red', 'blue'),
    createIfSatisfyHelper('equals', 'blue', 'red OR blue OR green'),
    createIfSatisfyHelper('contains', 'deep-blue', 'blue'),
    createIfSatisfyHelper('ends-with', 'deep-blue', 'blue'),
    createIfSatisfyHelper('starts-with', 'blue-light', 'blue'),
    createIfSatisfyHelper('equals ignore-case', 'BLUE', 'blue'),
    createIfSatisfyHelper('equals ignore-space', 'code base', 'codebase'),
    createIfSatisfyHelper('equals ignore-punctuation', 'code;base', 'codebase'),
    createIfSatisfyHelper(
      'equals ignore-case ignore-punctuation',
      'code;base',
      'Codebase'
    ),
    createIfSatisfyHelper('equals', ['green', 'blue'], 'blue'),
    createIfSatisfyHelper('equals', ['green', 'blue'], 'red OR blue OR green'),
    createIfSatisfyHelper('starts-with', ['blue-light', 'green-light'], 'blue'),
    createIfSatisfyHelper('ends-with', ['deep-green', 'deep-blue'], 'blue'),
    createIfSatisfyHelper(
      'ends-with ignore-case',
      ['deep-green', 'deep-blue'],
      'BLUE'
    ),
    createIfSatisfyHelper(
      'ends-with ignore-case',
      ['deep-green', 'deep-blue'],
      'BLUE OR red'
    ),
    createIfSatisfyHelper(
      'not ends-with ignore-case',
      ['deep-green', 'deep-blue'],
      'yellow OR violet'
    ),
    createIfSatisfyHelper('equals', 12, '12'),
    createIfSatisfyHelper('not equals', 12, '15'),
  ])('should satisfy the conditions %s', (given) => {
    const actual = ifSatisfyHelper(given.flags, given.value, given.expected);
    expect(actual).toBeTruthy();
  });
  test.each([
    createIfSatisfyHelper('equals', 'orange', 'blue'),
    createIfSatisfyHelper('equals', 'Blue', 'blue'),
    createIfSatisfyHelper('equals', 'orange', 'red OR blue OR green'),
    createIfSatisfyHelper('ends-with', 'deep-blue', 'bluetooth'),
    createIfSatisfyHelper('starts-with', 'blue-light', 'bluetooth'),
    createIfSatisfyHelper('contains', 'deep-orange', 'blue'),
    createIfSatisfyHelper('ends-with', ['deep-green', 'deep-blue'], 'BLUE'),
    createIfSatisfyHelper('equals', 12, '13'),
  ])('should not satisfy the conditions %s', (given) => {
    const actual = ifSatisfyHelper(given.flags, given.value, given.expected);
    expect(actual).toBeFalsy();
  });
});
