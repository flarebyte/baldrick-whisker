/**
 * Commander-based CLI wiring.
 * - Registers commands for merging objects and rendering templates.
 * - Exposes a `runClient` function used by the CLI entry.
 */
import { Command } from 'commander';
import { commandObject } from './command-object.js';
import { commandRender } from './command-render.js';
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
  .option('--no-ext', 'Drop the extension suffix for destination')
  .option('--no-overwrite', 'Do not overwrite an existing file')
  .action(commandObject);

program
  .command('render')
  .description('Render a template')
  .argument('<source>', 'the path to source file in JSON or YAML')
  .argument('<template>', 'the path to the Handlebars template')
  .argument('<destination>', 'the path to the destination file (elm, ...)')
  .option('--diff', 'Only display the difference in the console')
  .option('--no-ext', 'Drop the extension suffix for destination')
  .option('--no-overwrite', 'Do not overwrite an existing file')
  .option('-c, --config <config>', 'Configuration as a JSON line')
  .action(commandRender);

export async function runClient() {
  try {
    // Prevent Commander from calling process.exit on --help/--version
    program.exitOverride();
    await program.parseAsync();
    console.log(`✓ Done. Version ${version}`);
  } catch (error) {
    const code = (error as { code?: string } | undefined)?.code;
    // Treat help/version exits as normal flow
    if (
      code === 'commander.help' ||
      code === 'commander.helpDisplayed' ||
      code === 'commander.version'
    ) {
      console.log(`✓ Done. Version ${version}`);
      return;
    }
    console.log('baldrick-decision will exit with error code 1');
    console.error(error);
    process.exit(1); // eslint-disable-line  unicorn/no-process-exit
  }
}
