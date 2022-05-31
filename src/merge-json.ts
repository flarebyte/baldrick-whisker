import { JsonArray, JsonObject, JsonPrimitive } from 'type-fest';
import { FunctionInfo, InputContent } from './model';


const mergePrimitives = (a: JsonPrimitive, b?: JsonPrimitive): JsonPrimitive =>
  b !== undefined ? b : a;

  
  const mergeJsonArrays = (a: JsonArray, b?: JsonArray): JsonArray =>
  b !== undefined ? [...a, ...b] : [...a];
  
  const mergeJsonObjects = (a: JsonObject, b?: JsonObject): JsonObject =>
    b !== undefined ? { ...a, ...b } : { ...a };
    
const fromFunctionInfos = (functionInfos: FunctionInfo[]): JsonObject {
    const content= JSON.stringify({ functions: functionInfos});
    return JSON.parse(content);
}
const toJsonObject = (inputContent: InputContent): JsonObject => {
    const {fileType} = inputContent;
    if (fileType === 'elm') {
        return fromFunctionInfos(inputContent.functionInfos);
    }
    if (fileType === 'json' ||fileType === 'yaml' ) {

        return inputContent.json;
    }
    return { message: 'invalid'};
}

export const mergeContents = (inputContents: InputContent[]): JsonObject => {
  const jsonContents = inputContents.map(toJsonObject) ;
    let result: JsonObject = {};
  for (const content of jsonContents) {
    result = mergeJsonObjects(result, content);
  }
  return result;
};
