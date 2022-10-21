#!/usr/bin/env zx
/**
 * Run with: zx script/cli-test.mjs
 */

const assertSuccess = (test, message) => {
  if (test) {
    echo(`✅ OK: ${message}`);
  } else {
    echo(`❌ KO: ${message}`);
  }
};

const clientName = 'baldrick-whisker';

const runCommand = async (command) => {
  echo(`Starting broth ${command.run} ...`);
  await $`yarn cli ${command.run}`;
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

const commands = [
  {
    run: [
      'object report/shell-tests/dest.json package.json tsconfig.json script/fixture/Example.elm',
    ],
    expectFile: 'report/shell-tests/dest.json',
  },
  {
    run: [
      'object report/shell-tests/dest.yaml package.json tsconfig.json script/fixture/Example.elm',
    ],
    expectFile: 'report/shell-tests/dest.yaml',
  },
  {
    run: [
      'render report/shell-tests/dest.yaml script/fixture/example.hbs report/shell-tests/rendered.md --config \'{ "inline": "Inline works"}\'',
    ],
    expectFile: 'report/shell-tests/rendered.md',
  },
  {
    run: [
      'render report/shell-tests/dest.yaml script/fixture/example-overwrite.hbs report/shell-tests/rendered.md --config \'{ "inline": "Inline works"}\' --no-overwrite',
    ],
    expectFile: 'report/shell-tests/rendered.md',
    expectFileContent: 'overwrite',
  },
  {
    run: [
      'object report/shell-tests/dest-remote.json github:flarebyte:baldrick-whisker:package.json github:flarebyte:baldrick-whisker:tsconfig.json github:flarebyte:baldrick-whisker:script/fixture/Example.elm',
    ],
    expectFile: 'report/shell-tests/dest-remote.json',
  },
  {
    run: [
      'render report/shell-tests/dest-remote.json github:flarebyte:baldrick-whisker:script/fixture/example.hbs report/shell-tests/rendered-remote.md --config \'{ "inline": "Inline works"}\'',
    ],
    expectFile: 'report/shell-tests/rendered-remote.md',
  },

  {
    run: [
      'object --no-ext report/shell-tests/no-suffix-dest.json package.json tsconfig.json script/fixture/Example.elm',
    ],
    expectFile: 'report/shell-tests/no-suffix-dest',
  },

  {
    run: [
      'render --no-ext report/shell-tests/dest.yaml script/fixture/example.hbs report/shell-tests/no-suffix-rendered.md --config \'{ "inline": "Inline works"}\'',
    ],
    expectFile: 'report/shell-tests/no-suffix-rendered',
  },

  {
    run: [
      'render report/shell-tests/dest.yaml script/fixture/example.hbs report/shell-tests/rendered.md --diff',
    ],
  },
];

const commandPromises = commands.map(runCommand);
for await (const command of commandPromises) {
  command;
}
