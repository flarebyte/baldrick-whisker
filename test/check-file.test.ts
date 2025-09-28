import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { checkFile, checkOutputIsCompatible } from '../src/check-file.js';

describe('check-file', () => {
  it('checkFile exits when unsupported', () => {
    const origExit = process.exit;
    let code: number | undefined;
    // @ts-expect-error override
    process.exit = (c?: number) => {
      code = c;
      throw new Error('exit');
    };
    try {
      checkFile({ filename: 'a.txt', fileType: 'text' }, ['json']);
      assert.fail('should have exited');
    } catch {
      assert.equal(code, 1);
    } finally {
      process.exit = origExit;
    }
  });

  it('checkOutputIsCompatible returns formatted content when valid', () => {
    const out = checkOutputIsCompatible('{"x":1}', { filename: 'a.json', fileType: 'json' });
    assert.match(out, /\"x\": 1/);
  });
});

