import path from 'node:path';
import { Command } from 'commander';
import {
  promptAnotherFragmentQuestion,
  promptDecisionFile,
  promptParameter,
  promptQuestions,
} from './prompting.js';
import { version } from './version.js';
import { writeJsonSchema } from './whisker-schema';

const program = new Command();
program
  .name('baldrick-decision')
  .description('CLI to make cunning decisions')
  .version(version)
  .argument('<dir>', 'directory containing the decision files')
  .option('--schema', 'write the decision JSON schema in the directory');

const askMainQuestions = async (decisionManager: DecisionManager) => {
  let mainQuestionsChoices = decisionManager.getRootMainQuestions();
  let maxIterations = 30;
  decisionManager.pushMainAutoAnswerTags();
  console.log('--- Questions ---');
  while (mainQuestionsChoices.length > 1 && maxIterations > 0) {
    maxIterations--;
    const answers = await promptQuestions(mainQuestionsChoices);
    decisionManager.pushAnswerTags(answers.join(' '));
    mainQuestionsChoices = decisionManager.getFollowUpMainQuestions();
  }

  const mainParameters = decisionManager.getMainParameters();
  const mainParameterValues: ParameterValue[] = [];
  for (const parameter of mainParameters) {
    const parameterValue = await promptParameter(parameter);
    mainParameterValues.push({ name: parameter.name, value: parameterValue });
  }
  decisionManager.setMainDecisionTaken(mainParameterValues);
};

const askFragmentQuestions = async (decisionManager: DecisionManager) => {
  let fragmentQuestionsChoices = decisionManager.getRootFragmentQuestions();
  let maxIterations = 30;
  decisionManager.pushFragmentAutoAnswerTags();
  console.log('--- Questions about fragment ---');
  while (fragmentQuestionsChoices.length > 1 && maxIterations > 0) {
    maxIterations--;
    const answers = await promptQuestions(fragmentQuestionsChoices);
    decisionManager.pushAnswerTags(answers.join(' '));
    fragmentQuestionsChoices = decisionManager.getFollowUpFragmentQuestions();
  }

  const fragmentParameters = decisionManager.getFragmentParameters();
  const fragmentParameterValues: ParameterValue[] = [];
  for (const parameter of fragmentParameters) {
    const parameterValue = await promptParameter(parameter);
    fragmentParameterValues.push({
      name: parameter.name,
      value: parameterValue,
    });
  }
  decisionManager.addFragmentDecisionTaken(fragmentParameterValues);
};

/**
 * This function may be merged in the future when the linter does a better job at recognizing .mts files
 */
export async function runClient() {
  try {
    program.parse();
    const rootDir = program.args[0] || './temp/';
    const shouldWriteSchema = !!program.opts()['schema'];
    if (shouldWriteSchema) {
      const jsonSchemaFilename = path.join(rootDir, 'decision.schema.json');
      console.log(
        `Writing the JSON Schema for decision:s ${jsonSchemaFilename}`
      );
      await writeJsonSchema(jsonSchemaFilename);
      return;
    }
    const decisionStore = new DecisionStore();
    await decisionStore.loadFromDirectory(rootDir);
    const decisionTitle = await promptDecisionFile(decisionStore.getChoices());
    const mainDecision = decisionStore.getByTitle(decisionTitle);
    if (!mainDecision) {
      throw new Error(
        'Somehow something went wrong and we could not find the decision by title'
      );
    }
    const decisionManager = new DecisionManager(mainDecision);
    await askMainQuestions(decisionManager);
    let moreFragment = await promptAnotherFragmentQuestion();
    while (moreFragment) {
      await askFragmentQuestions(decisionManager);
      moreFragment = await promptAnotherFragmentQuestion();
    }

    const content = hydrate(decisionManager.overallDecision);
    console.log(content);

    console.log(`✓ Done. Version ${version}`);
  } catch (error) {
    console.log('baldrick-decision will exit with error code 1');
    console.error(error);
    process.exit(1); // eslint-disable-line  unicorn/no-process-exit
  }
}