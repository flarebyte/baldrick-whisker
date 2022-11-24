import { formatContent } from './file-io.js';
import { FileId, FileType } from './model.js';

export const checkFile = (someFile: FileId, supportedFileTypes: FileType[]) => {
  const isObjectCompatible = supportedFileTypes.includes(someFile.fileType);
  if (!isObjectCompatible) {
    console.error(
      `The filename of type ${someFile.fileType} is not supported: ${someFile.filename}`
    );
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }
};

export const checkOutputIsCompatible = (
  content: string,
  destinationId: FileId
): string => {
  const formattedStatus = formatContent(content, destinationId);
  if (formattedStatus.status === 'success') {
    return formattedStatus.value;
  } else {
    console.error(
      `The destination file ${destinationId.filename} of type ${destinationId.fileType} cannot be rendered: ${formattedStatus.error}`
    );
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }
};
