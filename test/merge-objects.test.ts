import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';
import YAML from 'yaml';
import { mergeObjects } from '../src/merge-objects.js';
import type { InputContent } from '../src/model.js';
import { parseElmFunctions } from '../src/parse-elm-function.js';

const loadFixtureAsInputs = async (
  fixturePath: string,
): Promise<InputContent[]> => {
  const raw = await readFile(fixturePath, 'utf8');
  const data = YAML.parse(raw) as unknown[];
  return data.map((entry) => {
    if (entry.fileType === 'elm') {
      return {
        fileType: 'elm' as const,
        filename: entry.filename ?? 'inline.elm',
        content: entry.content,
        functionInfos: parseElmFunctions(entry.content),
      } satisfies InputContent;
    }
    if (
      entry.fileType === 'json' ||
      entry.fileType === 'yaml' ||
      entry.fileType === 'csv'
    ) {
      return {
        fileType: entry.fileType,
        filename: entry.filename,
        content: entry.content ?? '',
        json: entry.json,
      } satisfies InputContent;
    }
    return entry as InputContent;
  });
};

describe('merge-objects (from spec fixtures)', () => {
  it('should merge two files without primary key', async () => {
    const inputs = await loadFixtureAsInputs(
      'spec/fixtures/file-content-no-primary.yaml',
    );
    const merged = mergeObjects(inputs);
    assert.equal(merged.singlePrimitive, 8);
    assert.equal(merged.secondPrimitive, 2);
    assert.ok(Array.isArray(merged.arrayOfString));
    assert.ok((merged.arrayOfString as unknown[]).length >= 1);
  });

  it('should merge two files with primary key', async () => {
    const inputs = await loadFixtureAsInputs(
      'spec/fixtures/file-content-with-primary.yaml',
    );
    const merged = mergeObjects(inputs);
    const items = (merged.arrayOfObjs as unknown[]) || [];
    assert.equal(items.length, 2);
    // decorated array entries keep labels from metadata
    const first = items[0];
    assert.equal(first.someObject.label, 'first');
  });

  it('should include a message for a corrupted file', async () => {
    const inputs = await loadFixtureAsInputs(
      'spec/fixtures/file-content-corrupted.yaml',
    );
    const merged = mergeObjects(inputs);
    assert.ok(Array.isArray(merged.messages));
    assert.ok((merged.messages as string[])[0]?.includes('invalid file'));
  });

  it('should merge an elm file with a json file', async () => {
    const inputs = await loadFixtureAsInputs(
      'spec/fixtures/file-content-elm-and-json.yaml',
    );
    const merged = mergeObjects(inputs);
    assert.ok('functions' in merged);
    assert.ok(Array.isArray((merged as Record<string, unknown>).functions));
  });
});
