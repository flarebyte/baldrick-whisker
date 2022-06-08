import { FileId } from './model.js';

export const checkFile = (someFile: FileId) => {
  if (someFile.fileType === 'invalid' || someFile.fileType === 'unknown') {
    console.error(
      `The filename or content is unexpected: ${someFile.filename}`
    );
    process.exit(1);
  }
};
