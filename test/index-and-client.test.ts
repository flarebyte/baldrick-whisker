import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { runClient } from '../src/client.js';

describe('index exports and client', () => {
  it('loads public API module', async () => {
    const mod = (await import('../src/index.js')) as Record<string, unknown>;
    assert.equal(typeof mod.mergeObjects, 'function');
  });
  it('runs client without crashing', async () => {
    const oldArgv = process.argv;
    const logs: string[] = [];
    const oldLog = console.log;
    try {
      process.argv = ['node', 'cli', '--version'];
      console.log = (s: string) => logs.push(String(s));
      await runClient();
      assert.ok(logs.some((l) => l.includes('Version')));
    } finally {
      process.argv = oldArgv;
      console.log = oldLog;
    }
  });
});
