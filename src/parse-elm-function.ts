import { FunctionInfo, ParamInfo } from './model.js';

const isFunctionInfo = (value: unknown): value is FunctionInfo =>
  typeof value === 'object' && value !== null;

const trimStrings = (list: string[]) => list.map((s) => s.trim());
const chompLast = (text: string): string => text.trim().slice(0, -1).trim();

const replaceArrowWithinParenthesis = (text: string) => {
  let r = '';
  let inParen = false;
  const chars = text.split('');
  for (let letter of chars) {
    if (letter === '(') {
      inParen = true;
    }

    if (letter === ')') {
      inParen = false;
    }

    if (inParen && letter === '-') {
      letter = '';
    }

    if (inParen && letter === '>') {
      letter = '@';
    }

    r += letter;
  }

  return r;
};

const parseParams = (signature: string): string[] => {
  const noArrowWithinParenthesis = replaceArrowWithinParenthesis(signature);
  const params = trimStrings(noArrowWithinParenthesis.split('->'));
  return params.map((param) => param.replace('@', '->'));
};

const extractName = (line: string) => {
  const maybeName = line.split(':')[0]?.trim() || false;
  const name = maybeName && /(\w)+/.test(maybeName) ? maybeName : false;
  return name;
};

const matchName = (name: string, line: string): boolean =>
  line.trim().endsWith('=') && line.trim().startsWith(name);

const findElmFunctionBlocks = (content: string): [string, string][] => {
  const lines = content.split('\n');
  let firstLine: string | false = false;
  let name: string | false = false;
  const results: [string, string][] = [];
  for (const line of lines) {
    const isPerhapsFunction = line.includes(':') && line.includes('->');
    if (isPerhapsFunction) {
      name = extractName(line);
      if (name) {
        firstLine = line;
      }
    } else if (name && firstLine && matchName(name, line)) {
      results.push([firstLine, line]);
      name = false;
      firstLine = false;
    } else {
      name = false;
      firstLine = false;
    }
  }
  return results;
};

/**
 * Parse am elm function
 * @param twoLines a tuple with the signature followed parameters
 */
export const parseElmFunction = (
  twoLines: [string, string]
): FunctionInfo | false => {
  const [signatureLine, parametersLine] = twoLines;
  const hasEqual = parametersLine.trim().endsWith('=');
  const hasColon = signatureLine.includes(':');
  if (!hasEqual || !hasColon) {
    return false;
  }
  const [name, ...parameters] = trimStrings(
    chompLast(parametersLine).split(' ')
  );
  const [signatureName, signature] = trimStrings(signatureLine.split(':', 2));
  if (!name || name !== signatureName || !signature || !parameters) {
    return false;
  }
  const signatureParamsAndReturn = parseParams(signature);
  const returned = signatureParamsAndReturn.slice(-1)[0];
  const signatureParams = signatureParamsAndReturn.slice(0, -1);
  if (signatureParams.length !== parameters.length || !returned) {
    return false;
  }
  const params: ParamInfo[] = parameters.map((param, idx) => ({
    paramName: param,
    paramType: signatureParams[idx] || '',
  }));
  return {
    name,
    params,
    returned,
  };
};

/**
 * Parse an elm script file
 * @param content the elm script
 * @returns a list of functions for that script
 */
export const parseElmFunctions = (content: string): FunctionInfo[] =>
  findElmFunctionBlocks(content).map(parseElmFunction).filter(isFunctionInfo);
