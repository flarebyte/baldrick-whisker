import path from "node:path";
import jetpack from "fs-jetpack";
import Mustache from "mustache";
import { FunctionInfo, parseElmFunctions } from "./parse-elm-function.js";
import {
  FunctionMeta,
  mergeWithExtendedMeta,
  ExtendedFunctionInfo,
  toFunctionMetaObject,
  TemplateInfo,
} from "./data/data-model.js";
import { camelCaseUpper, firstUpper } from "./text-utils.js";
import { formatDiagnostic } from "typescript";
const elmSourceDir = "../src/Bubblegum/Entity";
const generatedDir = "../generated";
const templateDir = "../generator/template";

/**
 *  Custom global config for Mustache
 */
Mustache.escape = function (text: string) {
  return text;
};

export const readElmContent = async (name: string): Promise<string> => {
  const filename = path.join(elmSourceDir, `${name}.elm`);
  const content =
    (await jetpack.readAsync(filename, "utf8")) || "// Snippet not found";
  return content;
};

/**
 * Load a list of elm functions
 * @param name the elm file name
 */
export const readElmFunctions = async (
  name: string
): Promise<FunctionInfo[]> => {
  const content = await readElmContent(name);
  return parseElmFunctions(content);
};

export const saveExtendedElmFunctions = async (
  name: string,
  extendedFunctions: ExtendedFunctionInfo[]
): Promise<number> => {
  const filename = path.join(generatedDir, `${name}.json`);
  await jetpack.writeAsync(
    filename,
    JSON.stringify(extendedFunctions, null, 2)
  );
  return extendedFunctions.length;
};

export const readExtendedElmFunctions = async (
  name: string
): Promise<ExtendedFunctionInfo[]> => {
  const filename = path.join(generatedDir, `${name}.json`);
  const content = (await jetpack.readAsync(filename, "utf8")) || "[]";
  const extendedFunctions: ExtendedFunctionInfo[] = JSON.parse(content);
  return extendedFunctions;
};

/**
 * Delete previously generated folder
 */
export const deleteGenerated = async () => {
  console.log("Deleting generated folder");
  await jetpack.removeAsync(generatedDir);
};

export const mergeElmFunctions = async (
  name: string,
  metas: FunctionMeta[]
): Promise<ExtendedFunctionInfo[]> => {
  const elmFunctions = await readElmFunctions(name);
  const metaDict = toFunctionMetaObject(metas);
  const extendedFunctions = elmFunctions.map((fn) =>
    mergeWithExtendedMeta(fn, metaDict[fn.name])
  );
  await saveExtendedElmFunctions(name, extendedFunctions);
  console.log(
    `Generated extended model for ${name} with ${extendedFunctions.length} functions`
  );
  return extendedFunctions;
};

export const hydrateFunctionTemplate = async (templateInfo: TemplateInfo) => {
  const filename = path.join(
    templateDir,
    `${templateInfo.templateName}.mustache`
  );
  const targetFilename = path.join(
    templateInfo.targetDir,
    `${templateInfo.targetName}.elm`
  );
  const template = (await jetpack.readAsync(filename, "utf8")) || "[]";
  const functionsWithState = await (
    await readExtendedElmFunctions(templateInfo.moduleName)
  ).filter((f) => f.states.length > 0);
  const functions = functionsWithState.map((fn) => ({
    ...fn,
    name: { text: fn.name, firstUpper: firstUpper(fn.name) },
    states: fn.states.map((state) => ({
      state: {
        text: state.stateName,
        camelCaseUpper: camelCaseUpper(state.stateName),
      },
    })),
    has1Param: fn.params.length === 1,
    has2Params: fn.params.length === 2,
    has3Params: fn.params.length === 3,
  }));
  const enhancedTemplateInfo = {
    ...templateInfo,
    packageNameDot: templateInfo.packageName.replace(/\//, "."),
    functions,
  };
  console.log(JSON.stringify(enhancedTemplateInfo, null, 2));
  const content = Mustache.render(template, enhancedTemplateInfo);
  await jetpack.writeAsync(targetFilename, content);
};