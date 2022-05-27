import prompts from 'prompts';
import { PromptChoice, PromptText } from './model.js';

/**
 * Prompt to select the decision file
 * @param choices a list of decision document titles
 * @returns the chosen value
 */
export const promptDecisionFile = async (
  choices: PromptChoice[]
): Promise<string> => {
  const response = await prompts({
    type: 'select',
    name: 'value',
    message: 'Select the decision file',
    choices,
  });

  return response.value;
};

/**
 * Prompt a list of multiple choices questions
 * @param choices a list of choices
 * @returns a list of values
 */
export const promptQuestions = async (
  choices: PromptChoice[]
): Promise<string[]> => {
  const response = await prompts({
    type: 'multiselect',
    name: 'value',
    message: 'Pick the suitable answers',
    choices,
    hint: '- Space to select. Return to submit',
  });

  return response.value;
};

/**
 * Prompt for a single parameter input
 * @param promptText the description of the parameter
 * @returns the input value
 */
export const promptParameter = async (
  promptText: PromptText
): Promise<string> => {
  const response = await prompts({
    type: 'text',
    name: 'value',
    message: promptText.message,
  });

  return response.value;
};

/**
 * Ask the user if they intend to add another fragment section
 * @returns true if another fragment is expected
 */
export const promptAnotherFragmentQuestion = async (): Promise<boolean> => {
  const response = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Is there another fragment ?',
    initial: false,
  });

  return response.value;
};