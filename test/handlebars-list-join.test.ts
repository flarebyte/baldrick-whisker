import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import Handlebars from 'handlebars';
import '../src/file-io.js';

describe('handlebars helper listJoin', () => {
  it('joins items with separator and preserves newlines', () => {
    const tpl = Handlebars.compile('{{#listJoin ", " items}}{{this}}{{/listJoin}}');
    const out = tpl({ items: ['a', 'b', 'c'] });
    assert.equal(out, 'a, b, c');
    const tpl2 = Handlebars.compile('{{#listJoin "\n newline" items}}{{this}}{{/listJoin}}');
    const out2 = tpl2({ items: ['x', 'y'] });
    assert.equal(out2, 'x\n\ny');
  });

  it('ifSatisfy helper renders correct block', () => {
    const tpl = Handlebars.compile('{{#ifSatisfy "equals" value "blue"}}yes{{else}}no{{/ifSatisfy}}');
    const out = tpl({ value: 'blue' });
    assert.equal(out, 'yes');
    const out2 = tpl({ value: 'red' });
    assert.equal(out2, 'no');
  });
});
