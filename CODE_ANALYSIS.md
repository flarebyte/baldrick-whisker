# Code Analysis

This document summarizes the features and internal responsibilities of the
baldrick-whisker codebase.

## High-level Features

-   Read and normalize various input formats: JSON, YAML, CSV, Elm,
    Markdown, Text, and Handlebars templates.
-   Merge multiple inputs into a single JSON object with rules for
    primitives, objects and arrays.
-   Render Handlebars templates using merged data, with custom helpers to
    enable advanced conditions and list formatting.
-   Validate and format rendered output for JSON/YAML targets.
-   Provide a CLI (Commander) with commands to merge objects and render
    templates.

## Modules Overview

-   `src/cli.mts`
    -   CLI entry; delegates to `runClient` to register/execute commands.

-   `src/client.ts`
    -   Wires Commander commands: `object` (merge) and `render` (template
        processing).
    -   Exposes `runClient()` used by the CLI entry.

-   `src/command-object.ts`
    -   Implements the `object` command: reads inputs (JSON/YAML/CSV/ELM),
        merges them and writes JSON/YAML.
    -   Applies flags (drop extension, skip overwrite) derived from CLI
        options.

-   `src/command-render.ts`
    -   Implements the `render` command: merges source, optional inline config,
        and a small local env object.
    -   Supports diff mode by reading destination content as source context.
    -   Renders a Handlebars template and validates/normalizes JSON/YAML
        output.

-   `src/file-io.ts`
    -   Reads files of many kinds; supports GitHub content via
        `github:owner:repo:path` using Octokit.
    -   Compiles Handlebars templates and registers built-in helpers.
    -   Persists JSON/YAML/Text output and provides content formatting
        utilities.

-   `src/merge-objects.ts`
    -   Core engine that merges `InputContent` into a single `JsonObject`.
    -   Handles arrays (concatenation) and supports array item decoration using
        per-key metadata with a configurable primary key.

-   `src/handlebars-helpers.ts`
    -   Custom helpers:
        -   `ifSatisfy`: conditional block helper supporting
            equals/contains/starts-with/ends-with, with optional inversion and
            ignore-case/space/punctuation flags.
        -   `listJoin`: joins rendered block items using a separator while
            preserving newline intent.

-   `src/text-utils.ts`
    -   String transformations (first-upper, first-lower, upper/lower
        camelCase, dasherize, title).
    -   File type detection and file identifier mapping.
    -   Filename normalization helpers.

-   `src/check-file.ts`
    -   Guards and validation: enforce supported `FileType` sets and ensure
        rendered JSON/YAML are valid and formatted.

-   `src/model.ts`
    -   Shared domain types for file kinds/identifiers, Elm function metadata,
        `InputContent`, and template renderer type.

-   `src/json-model.ts`
    -   Lightweight JSON types (`JsonObject`, `JsonArray`, `JsonValue`).

-   `src/parse-elm-function.ts`
    -   Parses Elm function signatures into structured `FunctionInfo` and
        `ParamInfo` data.

-   `src/index.ts`
    -   Public API re-exports for library consumers.

-   `src/version.ts`
    -   Exports the current package version for runtime use.

## Data Flow Summary

1.  Inputs are identified (`text-utils`) and loaded (`file-io`) as
    `InputContent`.
2.  Contents are normalized and merged (`merge-objects`).
3.  For the `render` command, a Handlebars template is compiled/applied
    (`file-io` + helpers).
4.  Output is validated/normalized for JSON/YAML (`check-file`) and saved
    (`file-io`).

## Extensibility

-   New input types can be added by extending `FileType`, `getFileType`,
    and `readInputFile`.
-   Merging behavior can be adjusted in `merge-objects.ts` (e.g., conflict
    resolution, array strategies).
-   Additional Handlebars helpers can be added in `handlebars-helpers.ts`
    and registered in `file-io.ts`.
