import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { resolveGithubUri } from '../src/github-resolver.js';
import type { LocalGithubConfig } from '../src/model.js';

const tmp = async () => await mkdtemp(path.join(os.tmpdir(), 'whisker-'));

describe('cross-platform path handling (sanity)', () => {
  it('treats forward-slash traversal as escape and normal nested paths as local', async () => {
    const dir = await tmp();
    const subDir = path.join(dir, 'sub');
    await mkdir(subDir, { recursive: true });
    const okFile = path.join(subDir, 'data.txt');
    await writeFile(okFile, 'x', 'utf8');
    const cfg: LocalGithubConfig = {
      github: { mappings: [{ repo: 'me:repo', root: dir }] },
    };
    const ok = await resolveGithubUri(
      { owner: 'me', repo: 'repo', path: 'sub/data.txt' },
      cfg,
    );
    assert.equal(ok.type, 'local');
    assert.equal(ok.path, okFile);
    await assert.rejects(
      () =>
        resolveGithubUri(
          { owner: 'me', repo: 'repo', path: '../escape.txt' },
          cfg,
        ),
      /escapes mapping root/i,
    );
  });

  it('windows-style backslashes are treated as literal on POSIX (sanity)', async () => {
    if (path.sep === '\\') return; // Skip on Windows; covered elsewhere
    const dir = await tmp();
    // On POSIX, backslashes are literal, not separators. Create such a file.
    const weird = path.join(dir, 'data\\x.txt');
    await writeFile(weird, 'x', 'utf8');
    const cfg: LocalGithubConfig = {
      github: { mappings: [{ repo: 'me:repo', root: dir }] },
    };
    const res = await resolveGithubUri(
      { owner: 'me', repo: 'repo', path: 'data\\x.txt' },
      cfg,
    );
    assert.equal(res.type, 'local');
    assert.equal(res.path, weird);
  });
});
