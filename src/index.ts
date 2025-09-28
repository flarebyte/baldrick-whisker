/**
 * Public API surface of baldrick-whisker.
 * Re-exports core functions and types for consumers.
 */
export { readInputFile, saveObjectFile } from './file-io.js';
export { mergeObjects } from './merge-objects.js';
export { FunctionInfo, InputContent, TemplateRenderer } from './model.js';
export { parseElmFunctions } from './parse-elm-function.js';
