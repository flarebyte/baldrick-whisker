rm -rf report/shell-tests
mkdir -p report/shell-tests
yarn try object report/shell-tests/dest.json package.json tsconfig.json script/fixture/Example.elm
yarn try object report/shell-tests/dest.yaml package.json tsconfig.json script/fixture/Example.elm
yarn try render report/shell-tests/dest.yaml script/fixture/example.hbs report/shell-tests/rendered.md