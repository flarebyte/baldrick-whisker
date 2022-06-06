import jetpack from 'fs-jetpack';
import YAML from 'yaml';
import { parseElmFunctions } from './parse-elm-function.js';

import { FileId, InputContent } from './model.js';
import { JsonObject } from 'type-fest';

const readInputFile = async (fileId: FileId): Promise<InputContent> => {
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
  const { fileType, filename } = fileId;
  const isSupportedType = fileType === 'json' || fileType === 'yaml';
  if (!isSupportedType) {
    throw new Error(
      `The type ${fileType} is not supported for export as ${filename}`
    );
  }
  const stringContent =
    fileId.fileType === 'json'
      ? JSON.stringify(content, null, 2)
      : YAML.stringify(content);
  await jetpack.writeAsync(filename, stringContent);
};
