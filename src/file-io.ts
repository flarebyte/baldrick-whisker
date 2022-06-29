import jetpack from 'fs-jetpack';
import YAML from 'yaml';
import type { JsonObject } from 'type-fest';
import Handlebars from 'handlebars';
import { Octokit } from 'octokit';
import { parseElmFunctions } from './parse-elm-function.js';

import { FileId, GithubFile, InputContent, TemplateRenderer } from './model.js';
import { checkFile } from './check-file.js';
import {
  dasherize,
  dropExtension,
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

const octokit = new Octokit();

const compileTemplate = (templateContent: string): TemplateRenderer => {
  const compiled = Handlebars.compile(templateContent, { noEscape: true });
  return (objData: JsonObject) => compiled(objData);
};

const parseGithubFilename = (filename: string): GithubFile | undefined => {
  const [prefix, owner, repo, path] = filename.split(':', 4);
  if (
    owner === undefined ||
    repo === undefined ||
    path === undefined ||
    prefix !== 'github'
  ) {
    return undefined;
  }
  return { owner, repo, path };
};

const readGithubFile = async (ghFile: GithubFile): Promise<string> => {
  const { owner, repo, path } = ghFile;
  const { data } = await octokit.rest.repos.getContent({
    mediaType: {
      format: 'raw',
    },
    owner,
    repo,
    path,
  });
  return data.toString();
};

const readContentAsString = async (
  filename: string | GithubFile
): Promise<string | undefined> => {
  return await (typeof filename === 'string'
    ? jetpack.readAsync(filename, 'utf8')
    : readGithubFile(filename));
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
  const githubFile = filename.startsWith('github:')
    ? parseGithubFilename(filename)
    : false;

  const advancedFilename = githubFile ? githubFile : filename;
  const content = await readContentAsString(advancedFilename);
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
  if (fileType === 'markdown' || fileType === 'bash' || fileType === 'text') {
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
 * @param flags drop if the extension must be dropped
 */
export const saveObjectFile = async (
  fileId: FileId,
  content: JsonObject,
  flags?: string
): Promise<void> => {
  const { filename, fileType } = fileId;
  const realFilename = flags === 'drop' ? dropExtension(filename) : filename;
  checkFile(fileId, ['json', 'yaml']);
  const stringContent =
    fileType === 'json'
      ? JSON.stringify(content, undefined, 2)
      : YAML.stringify(content);
  await jetpack.writeAsync(realFilename, stringContent);
};

export const saveTextFile = async (
  fileId: FileId,
  content: string,
  flags?: string
): Promise<void> => {
  const { filename } = fileId;
  const realFilename = flags === 'drop' ? dropExtension(filename) : filename;
  await jetpack.writeAsync(realFilename, content);
};
