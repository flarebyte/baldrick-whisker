/* eslint unicorn/no-useless-undefined: 0 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  dasherize,
  dropExtension,
  firstLower,
  firstUpper,
  getFileType,
  lowerCamelCase,
  toTitle,
  upperCamelCase,
} from '../src/text-utils.js';

//TODO: Migrate to node.test

describe('text-utils', () => {
  describe('firstUpper', () => {
    it('should support undefined', () => {
      assert.strictEqual(firstUpper(undefined), '');
    });
    it('should support empty string', () => {
      assert.strictEqual(firstUpper(''), '');
    });
    it('should convert first char to uppercase', () => {
      assert.strictEqual(firstUpper('lower'), 'Lower');
      assert.strictEqual(firstUpper('Upper'), 'Upper');
    });
  });
  describe('firstLower', () => {
    it('should support undefined', () => {
      assert.strictEqual(firstLower(undefined), '');
    });
    it('should support empty string', () => {
      assert.strictEqual(firstLower(''), '');
    });
    it('should convert first char to uppercase', () => {
      assert.strictEqual(firstLower('lower'), 'lower');
      assert.strictEqual(firstLower('Upper'), 'upper');
    });
  });
  describe('upperCamelCase', () => {
    it('should support undefined', () => {
      assert.strictEqual(upperCamelCase(undefined), '');
    });
    it('should support empty string', () => {
      assert.strictEqual(upperCamelCase(''), '');
    });
    it('should convert to upper camel case', () => {
      assert.strictEqual(upperCamelCase('lower word'), 'LowerWord');
      assert.strictEqual(upperCamelCase('Upper word'), 'UpperWord');
      assert.strictEqual(upperCamelCase('lowerWord'), 'LowerWord');
    });
  });
  describe('lowerCamelCase', () => {
    it('should support undefined', () => {
      assert.strictEqual(lowerCamelCase(undefined), '');
    });
    it('should support empty string', () => {
      assert.strictEqual(lowerCamelCase(''), '');
    });
    it('should convert to lower camel case', () => {
      assert.strictEqual(lowerCamelCase('lower word'), 'lowerWord');
      assert.strictEqual(lowerCamelCase('Upper word'), 'upperWord');
      assert.strictEqual(lowerCamelCase('lowerWord'), 'lowerWord');
    });
  });
  describe('toTitle', () => {
    it('should support undefined', () => {
      assert.strictEqual(toTitle(undefined), '');
    });
    it('should support empty string', () => {
      assert.strictEqual(toTitle(''), '');
    });
    it('should convert to title', () => {
      assert.strictEqual(toTitle('lower word'), 'Lower word');
      assert.strictEqual(toTitle('Upper word'), 'Upper word');
      assert.strictEqual(toTitle('lowerWord'), 'Lower word');
    });
  });
  describe('dasherize', () => {
    it('should support undefined', () => {
      assert.strictEqual(dasherize(undefined), '');
    });
    it('should support empty string', () => {
      assert.strictEqual(dasherize(''), '');
    });
    it('should convert to words with dash', () => {
      assert.strictEqual(dasherize('lower word'), 'lower-word');
      assert.strictEqual(dasherize('Upper word'), 'upper-word');
      assert.strictEqual(dasherize('lowerWord'), 'lower-word');
    });
  });
  describe('getFileType', () => {
    it('should support empty string', () => {
      const extensions = ['json', 'yaml', 'elm', 'md', 'hbs', 'handlebars'];
      const actual = extensions.map((ext) =>
        getFileType(`/a/b/filename.${ext}`),
      );
      assert.strictEqual(actual.length, extensions.length);
      assert.deepStrictEqual(actual, [
        'json',
        'yaml',
        'elm',
        'markdown',
        'handlebars',
        'handlebars',
      ]);
    });
  });
  describe('dropExtension', () => {
    it('should drop the extension for various filenames', () => {
      const cases = [
        'no-extension-filename',
        'filename.txt',
        './path/filename.json',
        'a:b:c:d:data/core/filename.elm',
        'a:b:c:d:data/core.ext/filename.elm',
      ];
      for (const filename of cases) {
        const actual = dropExtension(filename);
        assert.ok(actual.endsWith('filename'));
      }
    });
  });
});
