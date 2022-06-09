import { FileId, FileType } from './model.js';

export const checkFile = (someFile: FileId, supportedFileTypes: FileType[]) => {
  const isObjectCompatible = supportedFileTypes.includes(someFile.fileType);
  if (!isObjectCompatible) {
    console.error(
      `The filename or content is not supported: ${someFile.filename}`
    );
    process.exit(1);
  }
};
