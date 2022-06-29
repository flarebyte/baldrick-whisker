import path from 'node:path';
import { checkFile } from './check-file.js';
import { readInputFile, saveTextFile } from './file-io.js';
import { mergeObjects } from './merge-objects.js';
import { InputContent } from './model.js';
import { getFileIdentifier } from './text-utils.js';

const extractDestContent = (inputContent: InputContent): string => {
  const hasDestContent =
    inputContent.fileType === 'elm' ||
    inputContent.fileType === 'markdown' ||
    inputContent.fileType === 'bash' ||
    inputContent.fileType === 'text';
  return hasDestContent ? inputContent.content : '';
};

export const commandRender = async (
  sourcePath: string,
  templatePath: string,
  destinationPath: string,
  options: { [name: string]: string }
) => {
  const flag = options['ext'] ? undefined : 'drop';
  const sourceId = getFileIdentifier(sourcePath);
  const source = await readInputFile(sourceId);
  checkFile(source, ['json', 'yaml']);
  const templateId = getFileIdentifier(templatePath);
  const template = await readInputFile(templateId);
  checkFile(template, ['handlebars']);

  const destinationId = getFileIdentifier(destinationPath);

  const configText = options['config'];
  const configSource: InputContent[] =
    typeof configText === 'string'
      ? [
          {
            fileType: 'json',
            filename: 'inline',
            content: configText,
            json: JSON.parse(configText),
          },
        ]
      : [];
  checkFile(destinationId, ['elm', 'markdown', 'bash']);
  const diff = !!options['diff'];
  const expectedOutput = diff
    ? extractDestContent(await readInputFile(destinationId))
    : '';
  const destinationAsSource: InputContent[] = diff
    ? [
        {
          fileType: 'json',
          filename: 'inline',
          content: expectedOutput,
          json: {
            output: expectedOutput,
          },
        },
      ]
    : [];
  const localEnv = {
    pwdBaseName: path.basename(process.cwd()),
  };
  const localEnvContent: InputContent = {
    fileType: 'json',
    filename: 'inline',
    content: JSON.stringify(localEnv),
    json: localEnv,
  };
  const mergedSource = mergeObjects([
    source,
    localEnvContent,
    ...configSource,
    ...destinationAsSource,
  ]);
  const isRenderable = template.fileType === 'handlebars';
  if (isRenderable) {
    const rendered = template.renderer(mergedSource);
    if (diff) {
      console.log(rendered);
    } else {
      await saveTextFile(destinationId, rendered, flag);
    }
  }
};
