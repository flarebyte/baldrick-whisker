import { Command } from 'commander';
import { version } from './version.js';

const program = new Command();
program
  .name('baldrick-whisker')
  .description('CLI to generate code using templates')
  .version(version);

program
  .command('object')
  .description('Convert source files to JSON or YAML')
  .argument('<destination>', 'the path to the JSON or YAML destination file')
  .argument('<sources...>', 'the path to the input filenames (JSON, YAML, Elm)')
  .option('-sc, --schema <schema>', 'JSON schema for the destination file')
  .action((destinationPath: string, sourcePaths: string[], options: { [name: string]: string }) => {
    console.log('destination', destinationPath);
    console.log('sources', sourcePaths);
    console.log('options', options);
  });

program
  .command('elm')
  .description('Convert a JSON or YAML source to Elm')
  .argument('<source>', 'the path to source file in JSON or YAML')
  .argument('<template>', 'the path to the Handlebars template')
  .argument('<destination>', 'the path to the Elm destination file (File.elm, console)')
  .option('--diff', 'Only display the difference in the console')
  .option('-cfg, --config <config>', 'Configuration as a JSON line')
  .option('-sc, --schema <schema>', 'JSON schema for the source file') 
  .action(
    (
      sourcePath: string,
      templatePath: string,
      destinationPath: string,
      options: { [name: string]: string }
    ) => {
      console.log('source', sourcePath);
      console.log('template', templatePath);
      console.log('destination', destinationPath);
      console.log('options', options);
    }
  );

/**
 * This function may be merged in the future when the linter does a better job at recognizing .mts files
 */
export async function runClient() {
  try {
    program.parseAsync();
    console.log(`✓ Done. Version ${version}`);
  } catch (error) {
    console.log('baldrick-decision will exit with error code 1');
    console.error(error);
    process.exit(1); // eslint-disable-line  unicorn/no-process-exit
  }
}
