import jetpack from 'fs-jetpack';
import YAML from 'yaml';
import type { JsonObject } from 'type-fest';
import Handlebars from 'handlebars';
import { parseElmFunctions } from './parse-elm-function.js';

import { FileId, InputContent, TemplateRenderer } from './model.js';
import { checkFile } from './check-file.js';
import {
  dasherize,
  firstLower,
  firstUpper,
  lowerCamelCase,
  toTitle,
  upperCamelCase,
} from './text-utils.js';
import { ifSatisfy, listJoin } from './handlebars-helpers.js';

Handlebars.registerHelper('lowerFirstChar', firstLower);
Handlebars.registerHelper('upperFirstChar', firstUpper);
Handlebars.registerHelper('toTitle', toTitle);
Handlebars.registerHelper('upperCamelCase', upperCamelCase);
Handlebars.registerHelper('lowerCamelCase', lowerCamelCase);
Handlebars.registerHelper('dasherize', dasherize);
Handlebars.registerHelper('ifSatisfy', ifSatisfy);
Handlebars.registerHelper('listJoin', listJoin);

const compileTemplate = (templateContent: string): TemplateRenderer => {
  const compiled = Handlebars.compile(templateContent, { noEscape: true });
  return (objData: JsonObject) => compiled(objData);
};

/**
 * Read a supported input file (JSON, YAML, Elm, Markdown)
 * @param fileId a file identifier
 * @returns a structure content representing the file
 */
export const readInputFile = async (fileId: FileId): Promise<InputContent> => {
  const { fileType, filename } = fileId;
  if (fileType === 'unknown' || fileType === 'invalid') {
    return {
      fileType,
      filename,
    };
  }
  const content = await jetpack.readAsync(filename, 'utf8');
  if (content === undefined) {
    return {
      fileType: 'invalid',
      filename,
    };
  }
  if (fileType === 'elm') {
    return {
      fileType,
      filename,
      content,
      functionInfos: parseElmFunctions(content),
    };
  }
  if (fileType === 'json') {
    return {
      fileType,
      filename,
      content,
      json: JSON.parse(content),
    };
  }
  if (fileType === 'yaml') {
    return {
      fileType,
      filename,
      content,
      json: YAML.parse(content),
    };
  }
  if (fileType === 'handlebars') {
    return {
      fileType,
      filename,
      content,
      renderer: compileTemplate(content),
    };
  }
  if (fileType === 'markdown') {
    return {
      fileType,
      filename,
      content,
    };
  }
  return {
    fileType,
    filename,
  };
};

export const readInputFiles = async (
  fileIds: FileId[]
): Promise<InputContent[]> => {
  const files = fileIds.map(readInputFile);
  return Promise.all(files);
};

/**
 * Save a JSON object as a JSON or YAML file
 * @param fileId a file identifier
 * @param content some JSON or YAML content
 */
export const saveObjectFile = async (
  fileId: FileId,
  content: JsonObject
): Promise<void> => {
  const { filename, fileType } = fileId;
  checkFile(fileId, ['json', 'yaml']);
  const stringContent =
    fileType === 'json'
      ? JSON.stringify(content, undefined, 2)
      : YAML.stringify(content);
  await jetpack.writeAsync(filename, stringContent);
};

export const saveTextFile = async (
  fileId: FileId,
  content: string
): Promise<void> => {
  const { filename } = fileId;
  await jetpack.writeAsync(filename, content);
};
