# baldrick-whisker

![npm](https://img.shields.io/npm/v/baldrick-whisker) ![Build
status](https://github.com/flarebyte/baldrick-whisker/actions/workflows/main.yml/badge.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/baldrick-whisker)

![npm type definitions](https://img.shields.io/npm/types/baldrick-whisker)
![node-current](https://img.shields.io/node/v/baldrick-whisker)
![NPM](https://img.shields.io/npm/l/baldrick-whisker)

![Experimental](https://img.shields.io/badge/status-experimental-blue)

> Code generator for Elm and Typescript using templates

Code generator for Elm and Typescript using templates

baldrick-whisker is an ESM-only CLI that reads JSON, YAML, CSV and Elm
sources, merges them into a single object, and renders Handlebars templates
for Elm/Markdown/JSON/YAML outputs. Ships with rich helpers and supports
GitHub file URIs. Requires Node.js >= 22.

![Hero image for baldrick-whisker](baldrick-whisker-hero-512.jpeg)

## CLI Examples

Merge JSON + Elm to YAML:

```bash
npx baldrick-whisker object report/out.yaml package.json
pest-spec/fixtures/Example.elm
```

Render Handlebars template:

```bash
npx baldrick-whisker render report/out.yaml pest-spec/fixtures/example.hbs
report/rendered.md
```

Show diff instead of writing:

```bash
npx baldrick-whisker render --diff report/out.yaml
pest-spec/fixtures/example.hbs report/rendered.md
```

Drop extension on destination:

```bash
npx baldrick-whisker object --no-ext report/out.json package.json
```

## Quickstart

Install globally or run with npx, then try the object and render commands.

1.  yarn global add baldrick-whisker
2.  baldrick-whisker --help
3.  npx baldrick-whisker object out.yaml a.json b.yaml
    spec/fixtures/Example.elm
4.  npx baldrick-whisker render out.yaml pest-spec/fixtures/example.hbs
    rendered.md

```
```

## Configuration

Config files:

-   \`\`:

## Architecture

-   file-io reads/writes files, compiles Handlebars, and registers helpers.
-   merge-objects normalizes InputContent and merges
    primitives/objects/arrays.
-   handlebars-helpers provides ifSatisfy, listJoin and string
    transformers.
-   cli wiring via Commander exposes object and render commands.

## Documentation and links

-   [Code Maintenance :wrench:](MAINTENANCE.md)
-   [Code Of Conduct](CODE_OF_CONDUCT.md)
-   [Api for baldrick-whisker](API.md)
-   [Contributing :busts\_in\_silhouette: :construction:](CONTRIBUTING.md)
-   [Diagram for the code base :triangular\_ruler:](INTERNAL.md)
-   [Vocabulary used in the code base :book:](CODE_VOCABULARY.md)
-   [Architectural Decision Records :memo:](DECISIONS.md)
-   [Contributors
    :busts\_in\_silhouette:](https://github.com/flarebyte/baldrick-whisker/graphs/contributors)
-   [Dependencies](https://github.com/flarebyte/baldrick-whisker/network/dependencies)
-   [Glossary
    :book:](https://github.com/flarebyte/overview/blob/main/GLOSSARY.md)
-   [Software engineering principles
    :gem:](https://github.com/flarebyte/overview/blob/main/PRINCIPLES.md)
-   [Overview of Flarebyte.com ecosystem
    :factory:](https://github.com/flarebyte/overview)
-   [Usage](USAGE.md)
-   [API](API.md)
-   [Code Maintenance](MAINTENANCE.md)
-   [Contributing](CONTRIBUTING.md)
-   [Glossary](GLOSSARY.md)
-   [Vocabulary](CODE_VOCABULARY.md)
-   [Design](INTERNAL.md)
-   [ADR](DECISIONS.md)

## Related

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
