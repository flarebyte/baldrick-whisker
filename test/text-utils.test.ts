import { firstLower, firstUpper } from '../src/text-utils';

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
});
