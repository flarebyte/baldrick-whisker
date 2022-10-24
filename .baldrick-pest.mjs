#!/usr/bin/env zx
/**
 * Run with: zx .baldrick-pest.mjs
 */

const assertSuccess = (test, message) => {
  if (test) {
    echo(`✅ OK: ${message}`);
  } else {
    echo(`❌ KO: ${message}`);
  }
};

const testFileName = 'ispec/run.pest.yaml';

const readTestFile = async () => {
  const content = await fs.readFile(testFileName, { encoding: 'utf8' });
  return YAML.parse(content);
};

const runCommand = (clientName) => async (command) => {
  echo(`Starting ${clientName} ${command.run} ...`);
  const fullCommand = `yarn cli ${command.run}`;
  await $`${fullCommand}`;
  if (command.expectFile !== undefined) {
    const actualFiles = await glob([command.expectFile]);
    assertSuccess(actualFiles.length === 1, `${clientName} ${command.run}`);
  }
  if (
    command.expectFileContent !== undefined &&
    command.expectFile !== undefined
  ) {
    const actualFileContent = await fs.readFile(command.expectFile, {
      encoding: 'utf8',
    });
    assertSuccess(
      actualFileContent.includes(command.expectFileContent),
      `${clientName} ${command.run}`
    );
  }
  echo('\n-----\n');
};

await $`rm -rf report/shell-tests`;
await $`mkdir -p report/shell-tests`;

const {
  testing: { name },
  cases,
} = await readTestFile();
console.log(`Testing ${name}`);

const commandPromises = cases.map(runCommand(name));
for await (const command of commandPromises) {
  command;
}
