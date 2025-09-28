import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';

import { Command } from 'commander';
import jetpack from 'fs-jetpack';
import Handlebars from 'handlebars';
import { Octokit } from 'octokit';
import CSV from 'papaparse';
import YAML from 'yaml';

const tmp = async () => await mkdtemp(path.join(os.tmpdir(), 'deps-smoke-'));

describe('prod-deps smoke', () => {
  it('commander parses args', () => {
    const program = new Command();
    program
      .name('smoke')
      .option('-f, --flag', 'a boolean flag')
      .option('-v, --value <value>', 'a value');
    program.parse(['node', 'smoke', '--flag', '--value', 'x']);
    const opts = program.opts<{ flag?: boolean; value?: string }>();
    assert.equal(opts.flag, true);
    assert.equal(opts.value, 'x');
  });

  it('fs-jetpack writes and reads', async () => {
    const dir = await tmp();
    const file = path.join(dir, 'f.txt');
    await jetpack.writeAsync(file, 'hello');
    const content = await jetpack.readAsync(file, 'utf8');
    assert.equal(content, 'hello');
  });

  it('handlebars compiles and renders', () => {
    const tpl = Handlebars.compile('Hi {{name}}');
    const out = tpl({ name: 'there' } as Record<string, unknown>);
    assert.equal(out, 'Hi there');
  });

  it('octokit constructs a client (no network)', () => {
    const client = new Octokit();
    assert.ok(client);
    assert.equal(typeof client.request, 'function');
  });

  it('papaparse parses CSV', () => {
    const parsed = CSV.parse('name,age\nAda,30\n', { header: true });
    assert.equal(parsed.data[0]?.name, 'Ada');
  });

  it('yaml parses and stringifies', () => {
    const obj = YAML.parse('a: 1');
    assert.equal(obj.a, 1);
    const y = YAML.stringify({ b: 2 });
    assert.match(y, /b: 2/);
  });
});
