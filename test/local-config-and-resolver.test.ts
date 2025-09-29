import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { resolveGithubUri } from '../src/github-resolver.js';
import {
  loadLocalGithubConfig,
  reloadLocalGithubConfig,
} from '../src/local-config.js';
import type { LocalGithubConfig } from '../src/model.js';

const tmp = async () => await mkdtemp(path.join(os.tmpdir(), 'whisker-'));

describe('local-config + resolver', () => {
  let tempDir: string;
  let prevEnv: string | undefined;

  beforeEach(async () => {
    tempDir = await tmp();
    // biome-ignore lint/complexity/useLiteralKeys: environment access via index
    prevEnv = process.env['BALDRICK_WHISKER_CONFIG'];
  });

  afterEach(async () => {
    // biome-ignore lint/complexity/useLiteralKeys: environment access via index
    if (prevEnv === undefined) delete process.env['BALDRICK_WHISKER_CONFIG'];
    // biome-ignore lint/complexity/useLiteralKeys: environment access via index
    else process.env['BALDRICK_WHISKER_CONFIG'] = prevEnv;
    await reloadLocalGithubConfig();
  });

  it('loads config from env override and validates minimal schema', async () => {
    const cfgPath = path.join(tempDir, 'config.yaml');
    await writeFile(
      cfgPath,
      [
        'github:',
        '  mappings:',
        '    - repo: foo:bar',
        `      root: ${tempDir}`,
        '',
      ].join('\n'),
      'utf8',
    );
    // biome-ignore lint/complexity/useLiteralKeys: environment access via index
    process.env['BALDRICK_WHISKER_CONFIG'] = cfgPath;
    const cfg = await loadLocalGithubConfig();
    assert.ok(cfg.github?.mappings && cfg.github.mappings.length === 1);
    assert.equal(cfg.github?.mappings?.[0].repo, 'foo:bar');
  });

  it('resolver returns remote for unmapped repos', async () => {
    const cfg: LocalGithubConfig = {};
    const res = await resolveGithubUri(
      { owner: 'x', repo: 'y', path: 'a.txt' },
      cfg,
    );
    assert.equal(res.type, 'remote');
  });

  it('resolver returns local path for mapped repo', async () => {
    const filePath = path.join(tempDir, 'file.txt');
    await writeFile(filePath, 'hello', 'utf8');
    const cfg: LocalGithubConfig = {
      github: { mappings: [{ repo: 'foo:bar', root: tempDir }] },
    };
    const res = await resolveGithubUri(
      { owner: 'foo', repo: 'bar', path: 'file.txt' },
      cfg,
    );
    assert.equal(res.type, 'local');
    assert.equal(res.path, filePath);
  });

  it('resolver prevents traversal outside root', async () => {
    const cfg: LocalGithubConfig = {
      github: { mappings: [{ repo: 'foo:bar', root: tempDir }] },
    };
    await assert.rejects(
      () =>
        resolveGithubUri(
          { owner: 'foo', repo: 'bar', path: '../etc/passwd' },
          cfg,
        ),
      /escapes mapping root/i,
    );
  });

  it('resolver errors when mapped file is missing', async () => {
    const cfg: LocalGithubConfig = {
      github: { mappings: [{ repo: 'foo:bar', root: tempDir }] },
    };
    await assert.rejects(
      () =>
        resolveGithubUri({ owner: 'foo', repo: 'bar', path: 'none.txt' }, cfg),
      /not found/i,
    );
  });
});
