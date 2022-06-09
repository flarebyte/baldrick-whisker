import { JsonObject } from 'type-fest';

export type FileType =
  | 'elm'
  | 'json'
  | 'yaml'
  | 'handlebars'
  | 'unknown'
  | 'invalid';

export interface FileId {
  fileType: FileType;
  filename: string;
}

export interface ParamInfo {
  paramName: string;
  paramType: string;
}

export interface FunctionInfo {
  functionName: string;
  params: ParamInfo[];
  returned: string;
}

export type TemplateRenderer = (objData: JsonObject) => string;

export type InputContent =
  | {
      fileType: 'elm';
      filename: string;
      content: string;
      functionInfos: FunctionInfo[];
    }
  | {
      fileType: 'json' | 'yaml';
      filename: string;
      content: string;
      json: JsonObject;
    }
  | {
      fileType: 'handlebars';
      filename: string;
      content: string;
      renderer: TemplateRenderer;
    }
  | {
      fileType: 'unknown' | 'invalid';
      filename: string;
    };
