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

Please note that a filename can also be github filename such as
`github:flarebyte:baldrick-whisker:package.json`.
You can check the `script/cli-test.sh` shell script for some examples.

### Template

#### ifSatisfy

> Check if a condition is satisfied before executing the block

```handlebars
{{#ifSatisfy "equals" keywords "mustache"}}
  Will display if the word mustache is in the list of keywords
{{/ifSatisfy}}
```

```handlebars
{{#ifSatisfy "not equals" keywords "mustache"}}
  Will display if the word mustache is not in the list of keywords
{{/ifSatisfy}}
```

```handlebars
{{#ifSatisfy "contains" description "Elm"}}
  Will display if the word Elm is in the description
{{/ifSatisfy}}
```

```handlebars
{{#ifSatisfy "contains ignore-case" description "Elm OR Python"}}
  Will display if the words Elm or Python is in the description ignoring the
  case
{{/ifSatisfy}}
```

```handlebars
{{#ifSatisfy "starts-with ignore-space" description "Code generator"}}
  Will display if the description starts with Code generator ignoring any spaces
{{/ifSatisfy}}
```

```handlebars
{{#ifSatisfy "not ends-with" description "templates"}}
  Will display if the description does not ends with templates
{{/ifSatisfy}}
```

```handlebars
{{#ifSatisfy "contains ignore-punctuation" description "Code&generator"}}
  Will display if the description contains "Code generator" ignoring any
  punctuation
{{/ifSatisfy}}
```

#### listJoin

> Join a list with a separator

```handlebars
|{{#listJoin "|" keywords}} {{this}} {{/listJoin}}|
```

```handlebars
{{#listJoin ', newline' params}}
* {{paramName}} ==> {{paramType}} ==> {{upperCamelCase
paramType}}{{/listJoin}}
{{/each}}
```

#### String transformers

| Function                   | input      | output     |
| -------------------------- | ---------- | ---------- |
| `{{upperFirstChar value}}` | baldrick   | Baldrick   |
| `{{lowerFirstChar value}}` | Baldrick   | baldrick   |
| `{{upperCamelCase value}}` | great idea | GreatIdea  |
| `{{lowerCamelCase value}}` | great idea | greatIdea  |
| `{{toTitle value}}`        | GreatIdea  | Great idea |
| `{{dasherize value}}`      | GreatIdea  | great-idea |

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
