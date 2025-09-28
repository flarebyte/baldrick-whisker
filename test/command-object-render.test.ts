import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { commandObject } from '../src/command-object.js';
import { commandRender } from '../src/command-render.js';

const tmp = async () => await mkdtemp(path.join(os.tmpdir(), 'whisker-'));

describe('commands', () => {
  it('object: merges inputs and writes YAML', async () => {
    const dir = await tmp();
    const in1 = path.join(dir, 'a.json');
    const in2 = path.join(dir, 'b.yaml');
    await writeFile(in1, JSON.stringify({ alpha: 1 }), 'utf8');
    await writeFile(in2, 'beta: 2', 'utf8');
    const out = path.join(dir, 'out.yaml');
    await commandObject(out, [in1, in2], {} as any);
    const content = await readFile(path.join(dir, 'out'), 'utf8');
    assert.match(content, /alpha: 1/);
    assert.match(content, /beta: 2/);
  });

  it('render: renders Handlebars to JSON and supports diff mode', async () => {
    const dir = await tmp();
    const src = path.join(dir, 'src.json');
    const tpl = path.join(dir, 'tmpl.hbs');
    const dest = path.join(dir, 'out.json');
    await writeFile(src, JSON.stringify({ name: 'Ada' }), 'utf8');
    await writeFile(tpl, '{"greet":"Hello {{name}}"}', 'utf8');
    await commandRender(src, tpl, dest, { config: '{"extra": true}' } as any);
    // invalid inline config is ignored here, still renders
    const content = await readFile(path.join(dir, 'out'), 'utf8');
    assert.match(content, /Hello Ada/);

    // diff mode prints expected output
    let printed = '';
    const orig = console.log;
    try {
      console.log = (s: string) => {
        printed = s;
      };
      await commandRender(src, tpl, dest, { diff: '1' } as any);
      assert.ok(printed.length > 0);
    } finally {
      console.log = orig;
    }
  });
});
