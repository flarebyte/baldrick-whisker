import {
  dasherize,
  firstLower,
  firstUpper,
  getFileType,
  lowerCamelCase,
  toTitle,
  upperCamelCase,
} from '../src/text-utils';

describe('text-utils', () => {
  describe('firstUpper', () => {
    it('should support empty string', () => {
      expect(firstUpper('')).toStrictEqual('');
    });
    it('should convert first char to uppercase', () => {
      expect(firstUpper('lower')).toStrictEqual('Lower');
      expect(firstUpper('Upper')).toStrictEqual('Upper');
    });
  });
  describe('firstLower', () => {
    it('should support empty string', () => {
      expect(firstLower('')).toStrictEqual('');
    });
    it('should convert first char to uppercase', () => {
      expect(firstLower('lower')).toStrictEqual('lower');
      expect(firstLower('Upper')).toStrictEqual('upper');
    });
  });
  describe('upperCamelCase', () => {
    it('should support empty string', () => {
      expect(upperCamelCase('')).toStrictEqual('');
    });
    it('should convert to upper camel case', () => {
      expect(upperCamelCase('lower word')).toStrictEqual('LowerWord');
      expect(upperCamelCase('Upper word')).toStrictEqual('UpperWord');
      expect(upperCamelCase('lowerWord')).toStrictEqual('LowerWord');
    });
  });
  describe('lowerCamelCase', () => {
    it('should support empty string', () => {
      expect(lowerCamelCase('')).toStrictEqual('');
    });
    it('should convert to lower camel case', () => {
      expect(lowerCamelCase('lower word')).toStrictEqual('lowerWord');
      expect(lowerCamelCase('Upper word')).toStrictEqual('upperWord');
      expect(lowerCamelCase('lowerWord')).toStrictEqual('lowerWord');
    });
  });
  describe('toTitle', () => {
    it('should support empty string', () => {
      expect(toTitle('')).toStrictEqual('');
    });
    it('should convert to title', () => {
      expect(toTitle('lower word')).toStrictEqual('Lower word');
      expect(toTitle('Upper word')).toStrictEqual('Upper word');
      expect(toTitle('lowerWord')).toStrictEqual('Lower word');
    });
  });
  describe('dasherize', () => {
    it('should support empty string', () => {
      expect(dasherize('')).toStrictEqual('');
    });
    it('should convert to words with dash', () => {
      expect(dasherize('lower word')).toStrictEqual('lower-word');
      expect(dasherize('Upper word')).toStrictEqual('upper-word');
      expect(dasherize('lowerWord')).toStrictEqual('lower-word');
    });
  });
  describe('getFileType', () => {
    it('should support empty string', () => {
      const extensions = ['json', 'yaml', 'elm', 'md', 'hbs', 'handlebars'];
      const actual = extensions.map((ext) =>
        getFileType(`/a/b/filename.${ext}`)
      );
      expect(actual).toHaveLength(extensions.length);
      expect(actual).toStrictEqual([
        'json',
        'yaml',
        'elm',
        'markdown',
        'handlebars',
        'handlebars',
      ]);
    });
  });
});
