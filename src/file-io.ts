import jetpack from 'fs-jetpack';
import YAML from 'yaml';
import CSV from 'papaparse';
import type { JsonObject } from 'type-fest';
import Handlebars from 'handlebars';
import { Octokit } from 'octokit';
import { parseElmFunctions } from './parse-elm-function.js';

import { FileId, GithubFile, InputContent, TemplateRenderer } from './model.js';
import { checkFile } from './check-file.js';
import {
  dasherize,
  dropExtension,
  filenameAsKey,
  firstLower,
  firstUpper,
  lowerCamelCase,
  toTitle,
  upperCamelCase,
} from './text-utils.js';
import { ifSatisfy, listJoin } from './handlebars-helpers.js';
import { shouldDropExtension, shouldSkipOverwrite } from './flag-utils.js';

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

const prepareCsv = (content: string): string =>
  content
    .split('\n')
    .filter((line) => line.length > 2)
    .join('\n');

const parseCsv = (content: string): Record<string, string>[] => {
  const parsed = CSV.parse<Record<string, string>>(prepareCsv(content), {
    header: true,
  });
  const { data, errors } = parsed;
  if (errors.length > 0) {
    const errMessage = errors
      .map((err) => `Row ${err.row}: ${err.message}`)
      .join('\n');
    throw new Error(`Parsing CSV failed with ${errMessage}`);
  }
  if (data.length === 0) {
    throw new Error('Length of csv data should be more than zero');
  }
  return data;
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

  const advancedFilename = githubFile || filename;
  const content = await readContentAsString(advancedFilename);
  if (content === undefined) {
    return {
      fileType: 'invalid',
      filename,
    };
  }
  switch (fileType) {
    case 'elm':
      return {
        fileType,
        filename,
        content,
        functionInfos: parseElmFunctions(content),
      };
    case 'json':
      return {
        fileType,
        filename,
        content,
        json: JSON.parse(content),
      };
    case 'yaml':
      return {
        fileType,
        filename,
        content,
        json: YAML.parse(content),
      };
    case 'handlebars':
      return {
        fileType,
        filename,
        content,
        renderer: compileTemplate(content),
      };
    case 'markdown':
      return {
        fileType,
        filename,
        content,
      };
    case 'bash':
      return {
        fileType,
        filename,
        content,
      };
    case 'text':
      return {
        fileType,
        filename,
        content,
      };
    case 'csv': {
      const keyFilename = filenameAsKey(filename);
      const json = {
        [keyFilename]: parseCsv(content),
      };
      return {
        fileType,
        filename,
        content,
        json,
      };
    }
  }
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
  flags: string
): Promise<void> => {
  const { filename, fileType } = fileId;
  const realFilename = shouldDropExtension(flags)
    ? dropExtension(filename)
    : filename;
  checkFile(fileId, ['json', 'yaml']);
  const stringContent =
    fileType === 'json'
      ? JSON.stringify(content, undefined, 2)
      : YAML.stringify(content);
  const shouldWrite =
    !shouldSkipOverwrite(flags) || !(await jetpack.existsAsync(realFilename));
  if (shouldWrite) {
    await jetpack.writeAsync(realFilename, stringContent);
  }
};

export const saveTextFile = async (
  fileId: FileId,
  content: string,
  flags: string
): Promise<void> => {
  const { filename } = fileId;
  const realFilename = shouldDropExtension(flags)
    ? dropExtension(filename)
    : filename;
  const shouldWrite =
    !shouldSkipOverwrite(flags) || !(await jetpack.existsAsync(realFilename));
  if (shouldWrite) {
    await jetpack.writeAsync(realFilename, content);
  }
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export const formatContent = (
  content: string,
  destinationId: FileId
):
  | { status: 'success'; value: string }
  | { status: 'failure'; error: string } => {
  if (destinationId.fileType === 'json') {
    try {
      const parsed = JSON.parse(content);
      // eslint-disable-next-line unicorn/no-null
      return { status: 'success', value: JSON.stringify(parsed, null, 2) };
    } catch (error) {
      return {
        status: 'failure',
        error:
          'Rendered JSON cannot be parsed (424805): ' + getErrorMessage(error),
      };
    }
  }
  if (destinationId.fileType === 'yaml') {
    try {
      const parsed = YAML.parse(content);
      return { status: 'success', value: YAML.stringify(parsed) };
    } catch (error) {
      return {
        status: 'failure',
        error:
          'Rendered YAML cannot be parsed (719207): ' + getErrorMessage(error),
      };
    }
  }
  return { status: 'success', value: content };
};
