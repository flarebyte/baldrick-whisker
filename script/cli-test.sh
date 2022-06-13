#!/bin/bash
rm -rf report/shell-tests
mkdir -p report/shell-tests
yarn cli object report/shell-tests/dest.json package.json tsconfig.json script/fixture/Example.elm
if [ ! -f "report/shell-tests/dest.json" ]; then
    echo "❌ KO dest.json"
    exit 1
fi
yarn cli object report/shell-tests/dest.yaml package.json tsconfig.json script/fixture/Example.elm
if [ ! -f "report/shell-tests/dest.yaml" ]; then
    echo "❌ KO dest.yaml"
    exit 1
fi
yarn cli render report/shell-tests/dest.yaml script/fixture/example.hbs report/shell-tests/rendered.md --config '{ "inline": "Inline works"}'
if [ ! -f "report/shell-tests/rendered.md" ]; then
    echo "❌ KO rendered.md"
    exit 1
fi

yarn cli render report/shell-tests/dest.yaml script/fixture/example.hbs report/shell-tests/rendered.md --diff
