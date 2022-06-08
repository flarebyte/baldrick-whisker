import { readInputFiles, saveObjectFile } from './file-io.js';
import { mergeObjects } from './merge-objects.js';
import { FileId } from './model.js';
import { getFileIdentifier, getFileIdentifiers } from './text-utils.js';

const checkFile = (someFile: FileId) => {
  if (someFile.fileType === 'invalid' || someFile.fileType === 'unknown') {
    console.error(
      `The filename or content is unexpected: ${someFile.filename}`
    );
    process.exit(1);
  }
};
export const commandObject = async (
  destinationPath: string,
  sourcePaths: string[]
) => {
  const destinationId = getFileIdentifier(destinationPath);
  checkFile(destinationId);
  const sourceIds = getFileIdentifiers(sourcePaths);
  const sources = await readInputFiles(sourceIds);
  for (const source of sources) {
    checkFile(source);
  }
  const merged = mergeObjects(sources);
  await saveObjectFile(destinationId, merged);
};
