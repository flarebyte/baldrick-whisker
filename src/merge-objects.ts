import type {
  JsonArray,
  JsonObject,
  JsonPrimitive,
  JsonValue,
} from 'type-fest';
import { FunctionInfo, InputContent } from './model';

const isNullOrUndefined = (value: unknown): value is null | undefined =>
  typeof value === 'undefined' || value === null;

const isString = (value: unknown): value is string => typeof value === 'string';

const isPrimitive = (value: unknown): value is JsonPrimitive =>
  typeof value === 'string' ||
  typeof value === 'boolean' ||
  typeof value === 'number';

const isObject = (value: unknown): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isArray = (value: unknown): value is JsonArray =>
  typeof value === 'object' && value !== null && Array.isArray(value);

const mergeArrayValues =
  (primaryKey: string, moreMetadata: JsonObject) =>
  (arrayObj: JsonValue): JsonObject => {
    if (!isObject(arrayObj)) {
      return { error: 'The element in the array should be an object' };
    }
    const primaryKeyValue = arrayObj[primaryKey];
    if (!isString(primaryKeyValue)) {
      return { error: 'The primaryKeyValue should be a string' };
    }
    const metaObject = moreMetadata[primaryKeyValue];
    if (isNullOrUndefined(metaObject)) {
      return arrayObj;
    }
    if (!isObject(metaObject)) {
      return { error: 'The decorating value should be an object if present' };
    }
    return mergeJsonObjectsByKey(arrayObj, metaObject);
  };

const mergeKey =
  (a: JsonObject, b: JsonObject) =>
  (key: string): [string, JsonValue | undefined] => {
    const valueA = a[key];
    const valueB = b[key];
    if (isNullOrUndefined(valueA)) {
      return [key, valueB];
    }
    if (isNullOrUndefined(valueB)) {
      return [key, valueA];
    }
    if (isPrimitive(valueA) || isPrimitive(valueB)) {
      return [key, valueB];
    }
    if (isArray(valueA)) {
      if (isArray(valueB)) {
        return [key, [...valueA, ...valueB]];
      }
      if (isObject(valueB)) {
        const maybePrimaryKey = valueB['__merging_primary_key'];
        const primaryKey = isString(maybePrimaryKey) ? maybePrimaryKey : 'name';
        const arrayOfObjects = valueA.map(mergeArrayValues(primaryKey, valueB));
        return [key, arrayOfObjects];
      }
    }
    if (isObject(valueA)) {
      return isObject(valueB)
        ? [key, { ...valueA, ...valueB }]
        : [key, { ...valueA }];
    }
    return [key, { ...valueA }];
  };
const mergeJsonObjectsByKey = (a: JsonObject, b: JsonObject) => {
  const keys = [...Object.keys(a), ...Object.keys(b)];
  const keyValueTuples = keys.map(mergeKey(a, b));
  return Object.fromEntries(keyValueTuples);
};
const fromFunctionInfos = (functionInfos: FunctionInfo[]): JsonObject => {
  const content = JSON.stringify({ functions: functionInfos });
  return JSON.parse(content);
};
const toJsonObject = (inputContent: InputContent): JsonObject => {
  const { fileType } = inputContent;
  if (fileType === 'elm') {
    const { functionInfos } = inputContent;
    return fromFunctionInfos(functionInfos);
  }
  if (fileType === 'json' || fileType === 'yaml') {
    const { json } = inputContent;
    return json;
  }
  return { messages: [`invalid file ${inputContent.filename}`] };
};

/**
 * Merge several JSON, YAML, elm documents into one
 * @param inputContents a list of JSON and YAML payload to merge
 * @returns the merged JsonObject
 */
export const mergeObjects = (inputContents: InputContent[]): JsonObject => {
  const jsonContents = inputContents.map(toJsonObject);
  let result: JsonObject = {};
  for (const content of jsonContents) {
    result = mergeJsonObjectsByKey(result, content);
  }
  return result;
};
