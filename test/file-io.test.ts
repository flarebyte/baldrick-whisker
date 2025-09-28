import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm, stat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { readInputFile, saveObjectFile, saveTextFile, formatContent } from '../src/file-io.js';
import { getFileIdentifier } from '../src/text-utils.js';
import type { FileId, InputContent } from '../src/model.js';

const tmp = async () => await mkdtemp(path.join(os.tmpdir(), 'whisker-'));

describe('file-io', () => {
  let tempDir: string;
  beforeEach(async () => {
    tempDir = await tmp();
  });

  it('reads JSON and YAML files into InputContent', async () => {
    const jsonPath = path.join(tempDir, 'data.json');
    const yamlPath = path.join(tempDir, 'data.yaml');
    await writeFile(jsonPath, JSON.stringify({ a: 1 }), 'utf8');
    await writeFile(yamlPath, 'b: 2', 'utf8');
    const json = await readInputFile(getFileIdentifier(jsonPath));
    const yaml = await readInputFile(getFileIdentifier(yamlPath));
    assert.equal(json.fileType, 'json');
    assert.equal((json as Extract<InputContent,{fileType:'json'}>).json.a, 1);
    assert.equal(yaml.fileType, 'yaml');
    assert.equal((yaml as Extract<InputContent,{fileType:'yaml'}>).json.b, 2);
  });

  it('reads CSV and maps rows under filename key', async () => {
    const csvPath = path.join(tempDir, 'rows.csv');
    await writeFile(csvPath, 'name,age\nAlice,30\nBob,25\n', 'utf8');
    const csv = await readInputFile(getFileIdentifier(csvPath));
    assert.equal(csv.fileType, 'csv');
    const keys = Object.keys((csv as any).json);
    assert.equal(keys.length, 1);
    assert.equal(((csv as any).json[keys[0]] as any[]).length, 2);
  });

  it('compiles Handlebars and renders content', async () => {
    const hbsPath = path.join(tempDir, 'tmpl.hbs');
    await writeFile(hbsPath, 'Hello {{name}}', 'utf8');
    const tmpl = await readInputFile(getFileIdentifier(hbsPath));
    assert.equal(tmpl.fileType, 'handlebars');
    const out = tmpl.renderer({ name: 'World' } as any);
    assert.equal(out, 'Hello World');
  });

  it('formats JSON/YAML via formatContent', async () => {
    const destJson: FileId = { filename: 'out.json', fileType: 'json' };
    const okJ = formatContent('{"x":1}', destJson);
    assert.equal(okJ.status, 'success');
    const badJ = formatContent('{x:1}', destJson);
    assert.equal(badJ.status, 'failure');

    const destYaml: FileId = { filename: 'out.yaml', fileType: 'yaml' };
    const okY = formatContent('x: 1', destYaml);
    assert.equal(okY.status, 'success');
    const badY = formatContent('a: [1,2', destYaml);
    assert.equal(badY.status, 'failure');
  });

  it('saves JSON and YAML with flags', async () => {
    const fileJson = { filename: path.join(tempDir, 'result.json'), fileType: 'json' } as const;
    await saveObjectFile(fileJson, { a: 1 } as any, '');
    const txt1 = await readFile(fileJson.filename, 'utf8');
    assert.match(txt1, /\"a\": 1/);

    const fileYaml = { filename: path.join(tempDir, 'result.yaml'), fileType: 'yaml' } as const;
    await saveObjectFile(fileYaml, { b: 2 } as any, 'drop');
    const dropped = path.join(tempDir, 'result');
    const txt2 = await readFile(dropped, 'utf8');
    assert.match(txt2, /b: 2/);
  });

  it('skips overwrite when flag is present', async () => {
    const f = { filename: path.join(tempDir, 'keep.json'), fileType: 'json' } as const;
    await writeFile(f.filename, JSON.stringify({ old: true }, null, 2), 'utf8');
    const before = await readFile(f.filename, 'utf8');
    await saveObjectFile(f, { new: true } as any, 'skip-overwrite');
    const after = await readFile(f.filename, 'utf8');
    assert.equal(after, before);
  });

  it('writes text output honoring drop flag', async () => {
    const f = { filename: path.join(tempDir, 'out.txt'), fileType: 'text' } as const;
    await saveTextFile(f, 'hello', 'drop');
    const p = path.join(tempDir, 'out');
    const content = await readFile(p, 'utf8');
    assert.equal(content, 'hello');
  });

  it('returns unknown/invalid for unsupported or missing files', async () => {
    const unknown = await readInputFile({ filename: 'x.bin', fileType: 'unknown' });
    assert.equal(unknown.fileType, 'unknown');
    const invalid = await readInputFile({ filename: path.join(tempDir, 'missing.json'), fileType: 'json' });
    assert.equal(invalid.fileType, 'invalid');
  });
});
