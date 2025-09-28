/**
 * Implements the `object` command.
 * - Reads multiple input files (JSON/YAML/CSV/ELM) and merges them into one object.
 * - Applies output flags (drop extension, skip overwrite) and saves to JSON/YAML.
 */
import { checkFile } from './check-file.js';
import { readInputFiles, saveObjectFile } from './file-io.js';
import { optionsToFlag } from './flag-utils.js';
import { mergeObjects } from './merge-objects.js';
import { getFileIdentifier, getFileIdentifiers } from './text-utils.js';

export const commandObject = async (
  destinationPath: string,
  sourcePaths: string[],
  options: { [name: string]: string },
) => {
  const flag = optionsToFlag(options);
  const destinationId = getFileIdentifier(destinationPath);
  checkFile(destinationId, ['json', 'yaml']);
  const sourceIds = getFileIdentifiers(sourcePaths);
  const sources = await readInputFiles(sourceIds);
  for (const source of sources) {
    checkFile(source, ['json', 'yaml', 'elm']);
  }
  const merged = mergeObjects(sources);
  await saveObjectFile(destinationId, merged, flag);
};
