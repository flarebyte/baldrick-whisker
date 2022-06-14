# Baldrick-whisker

![npm](https://img.shields.io/npm/v/baldrick-whisker) ![Build
status](https://github.com/flarebyte/baldrick-whisker/actions/workflows/main.yml/badge.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/baldrick-whisker)

![npm type definitions](https://img.shields.io/npm/types/baldrick-whisker)
![node-current](https://img.shields.io/node/v/baldrick-whisker)
![NPM](https://img.shields.io/npm/l/baldrick-whisker)

> Code generator for Elm and Typescript using templates

## Usage

### Options

```bash
Usage: baldrick-whisker [options] [command]

CLI to generate code using templates

Options:
- V, --version                                       output the version
number
- h, --help                                          display help for
command

Commands:
object <destination> <sources...>                   Convert source files to
JSON or YAML
render [options] <source> <template> <destination>  Render a template
help [command]                                      display help for command
```

Convert source files to JSON or YAML

```bash
Usage: baldrick-whisker object [options] <destination> <sources...>

Convert source files to JSON or YAML

Arguments:
destination  the path to the JSON or YAML destination file
sources      the path to the input filenames (JSON, YAML, Elm)

Options:
- h, --help   display help for command
```

Render a template

```bash
Usage: baldrick-whisker render [options] <source> <template> <destination>

Render a template

Arguments:
source                   the path to source file in JSON or YAML
template                 the path to the Handlebars template
destination              the path to the destination file (elm, ...)

Options:
- -diff                   Only display the difference in the console
- cfg, --config <config>  Configuration as a JSON line
- h, --help               display help for command
```

## Documentation and links

-   [Code Maintenance](MAINTENANCE.md)
-   [Code Of Conduct](CODE_OF_CONDUCT.md)
-   [Api for baldrick-whisker](API.md)
-   [Contributing](CONTRIBUTING.md)
-   [Glossary](GLOSSARY.md)
-   [Diagram for the code base](INTERNAL.md)
-   [Vocabulary used in the code base](CODE_VOCABULARY.md)
-   [Architectural Decision Records](DECISIONS.md)
-   [Contributors](https://github.com/flarebyte/baldrick-whisker/graphs/contributors)
-   [Dependencies](https://github.com/flarebyte/baldrick-whisker/network/dependencies)

## Installation

This package is [ESM
only](https://blog.sindresorhus.com/get-ready-for-esm-aa53530b3f77).

```bash
yarn global add baldrick-whisker
baldrick-whisker --help
```

Or alternatively run it:

```bash
npx baldrick-whisker --help
```

If you want to tun the latest version from github. Mostly useful for dev:

```bash
git clone git@github.com:flarebyte/baldrick-whisker.git
yarn global add `pwd`
```
