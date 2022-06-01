import { JsonArray, JsonObject, JsonPrimitive, JsonValue } from 'type-fest';
import { FunctionInfo, InputContent, MetaAnnotation } from './model';


const mergePrimitiveValues = (a: JsonPrimitive, b?: JsonPrimitive): JsonPrimitive =>
  b !== undefined ? b : a;

  
const mergeJsonArrays = (a: JsonArray, b?: JsonArray): JsonArray =>
  b !== undefined ? [...a, ...b] : [...a];
  
const mergeKey = (a: JsonObject, b: JsonObject) => (key: string): [string, JsonValue | undefined] => {
    const valueA = a[key];
    const valueB = b[key];
    if (valueA === undefined || valueA === null){
        return [key, valueB];
    }
    if (valueB === undefined || (valueB === null)){
        return [key, valueA];
    }
    //check if primitive
    //check if objects
    //check if array
    return [key, a];
}
const mergeJsonObjectsA = (a: JsonObject, b: JsonObject) => {
    const keys = [...Object.keys(a), ...Object.keys(b)];
    const keyValueTuples = keys.map(mergeKey(a,b))
    return Object.fromEntries(keyValueTuples)      
}
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
