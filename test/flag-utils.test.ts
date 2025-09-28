import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { optionsToFlag, shouldDropExtension, shouldSkipOverwrite } from '../src/flag-utils.js';

describe('flag-utils', () => {
  it('converts options to flags', () => {
    const flags1 = optionsToFlag({});
    assert.ok(flags1.includes('drop'));
    assert.ok(flags1.includes('skip-overwrite'));
    const flags2 = optionsToFlag({ ext: 'true', overwrite: 'true' } as any);
    assert.equal(flags2.includes('drop'), false);
    assert.equal(flags2.includes('skip-overwrite'), false);
  });

  it('interprets flags correctly', () => {
    const flags = 'drop skip-overwrite';
    assert.equal(shouldDropExtension(flags), true);
    assert.equal(shouldSkipOverwrite(flags), true);
  });
});

