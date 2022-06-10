import jetpack from 'fs-jetpack';
import YAML from 'yaml';
import Handlebars from 'handlebars';
import { parseElmFunctions } from './parse-elm-function.js';

import { FileId, InputContent, TemplateRenderer } from './model.js';
import { JsonObject } from 'type-fest';
import { checkFile } from './check-file.js';
import { dasherize, firstLower, firstUpper, lowerCamelCase, toTitle, upperCamelCase } from './text-utils.js';
import { ifHasString } from "./handlebars-helpers";

Handlebars.registerHelper('lowerFirstChar', firstLower)
Handlebars.registerHelper('upperFirstChar', firstUpper)
Handlebars.registerHelper('toTitle', toTitle)
Handlebars.registerHelper('upperCamelCase', upperCamelCase)
Handlebars.registerHelper('lowerCamelCase', lowerCamelCase)
Handlebars.registerHelper('dasherize', dasherize)
Handlebars.registerHelper('ifHasString', ifHasString)

const compileTemplate = (templateContent: string): TemplateRenderer => {
  const compiled = Handlebars.compile(templateContent, { noEscape: true });
  return (objData: JsonObject) => compiled(objData);
};

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

export const saveObjectFile = async (
  fileId: FileId,
  content: JsonObject
): Promise<void> => {
  const { filename } = fileId;
  checkFile(fileId, ['json', 'yaml']);
  const stringContent =
    fileId.fileType === 'json'
      ? JSON.stringify(content, null, 2)
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
