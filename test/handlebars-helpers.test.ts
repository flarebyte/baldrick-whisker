import { ifHasString } from '../src/handlebars-helpers';

describe('handlebars-helper', () => {
  it('should provide', () => {
    const actual = ifHasString('stuff', 'blue', '', options);
    expect(actual).toBeDefined()
  });
});
