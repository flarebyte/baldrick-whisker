export interface MetaState {
  stateName: string;
}
export interface FunctionMeta {
  name: string;
  states: MetaState[];
  ok: string;
}

export interface ExtendedFunctionInfo extends FunctionInfo, FunctionMeta {}

export interface TextValue {
  text: string;
  camelCaseUpper: string;
  camelCaseLower: string;
}

export interface MustacheParam {
  paramName: TextValue;
  paramType: TextValue;
}

export interface MustacheState {
  stateName: TextValue;
}

export interface MustacheFunctionInfo {
  functionName: TextValue;
  params: MustacheParam[];
  returned: TextValue;
  states: MustacheState[];
  ok: TextValue;
}

export interface TemplateInfo {
  templateName: string;
  targetDir: string;
  targetName: string;
  packageName: string;
  moduleName: string;
}

export const toFunctionMetaObject = (
  metaArray: FunctionMeta[]
): { [name: string]: FunctionMeta } =>
  Object.fromEntries(metaArray.map((m) => [m.name, m]));

export const mergeWithExtendedMeta = (
  functionInfo: FunctionInfo,
  meta?: FunctionMeta
): ExtendedFunctionInfo =>
  meta
    ? {
        ...functionInfo,
        ...meta,
      }
    : { ...functionInfo, states: [], ok: "" };