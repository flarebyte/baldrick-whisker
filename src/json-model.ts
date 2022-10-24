//Strongly inspired by https://github.com/sindresorhus/type-fest
export type JsonObject = {
  [Key in string]: JsonValue;
};
export type JsonArray = JsonValue[];
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
