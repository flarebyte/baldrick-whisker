import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';
import { parseElmFunctions } from '../src/parse-elm-function.js';

describe('parse-elm-function', () => {
  it('parses function signatures from fixture', async () => {
    const content = await readFile('spec/fixtures/valid-elm-code.elm', 'utf8');
    const infos = parseElmFunctions(content);
    assert.ok(infos.length > 0);
    const first = infos[0];
    assert.ok(first.functionName.length > 0);
    assert.ok(Array.isArray(first.params));
  });
});
