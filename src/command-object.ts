import { checkFile } from './check-file.js';
import { readInputFiles, saveObjectFile } from './file-io.js';
import { mergeObjects } from './merge-objects.js';
import { getFileIdentifier, getFileIdentifiers } from './text-utils.js';

export const commandObject = async (
  destinationPath: string,
  sourcePaths: string[]
) => {
  const destinationId = getFileIdentifier(destinationPath);
  checkFile(destinationId, ['json', 'yaml']);
  const sourceIds = getFileIdentifiers(sourcePaths);
  const sources = await readInputFiles(sourceIds);
  for (const source of sources) {
    checkFile(source, ['json', 'yaml', 'elm']);
  }
  const merged = mergeObjects(sources);
  await saveObjectFile(destinationId, merged);
};
