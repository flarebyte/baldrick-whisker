import { checkFile } from './check-file.js';
import { readInputFile } from './file-io.js';
import { getFileIdentifier } from './text-utils.js';

export const commandRender = async (
  sourcePath: string,
  templatePath: string,
  destinationPath: string,
  options: { [name: string]: string }
) => {
  const sourceId = getFileIdentifier(sourcePath);
  const source = await readInputFile(sourceId);
  checkFile(source);
  const templateId = getFileIdentifier(templatePath);
  const template = await readInputFile(templateId);
  checkFile(template);

  const destinationId = getFileIdentifier(destinationPath);
  checkFile(destinationId);

  console.log('options', options);
};
