import { JsonValue } from 'type-fest';

export type FileType =
  | 'elm'
  | 'json'
  | 'yaml'
  | 'console'
  | 'unknown'
  | 'invalid';

export interface FileId {
  fileType: FileType;
  filename: string;
}

export interface FunctionInfo {
  name: string;
  params: [string, string][];
  returned: string;
}

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
      json: JsonValue;
    }
  | {
      fileType: 'unknown' | 'invalid';
      filename: string;
    }
  | {
      fileType: 'console';
    };

export interface JsonContent {
  [k: string]: JsonValue | FunctionInfo[];
}
