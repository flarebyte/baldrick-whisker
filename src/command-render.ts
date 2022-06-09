import { checkFile } from './check-file.js';
import { readInputFile, saveTextFile } from './file-io.js';
import { mergeObjects } from './merge-objects.js';
import { InputContent } from './model.js';
import { getFileIdentifier } from './text-utils.js';

export const commandRender = async (
  sourcePath: string,
  templatePath: string,
  destinationPath: string,
  options: { [name: string]: string }
) => {
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
  checkFile(destinationId, ['elm', 'markdown']);
  const diff = !!options['diff'];
  const destinationAsSource: InputContent[] = diff
    ? [await readInputFile(destinationId)]
    : [];

  const mergedSource = mergeObjects([
    source,
    ...configSource,
    ...destinationAsSource,
  ]);
  const isRenderable = template.fileType === 'handlebars';
  if (isRenderable) {
    const rendered = template.renderer(mergedSource);
    if (diff) {
      console.log(rendered);
    } else {
      await saveTextFile(destinationId, rendered);
    }
  }
};
