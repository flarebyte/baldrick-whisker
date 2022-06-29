# Internal

> Overview of the code base of baldrick-whisker

This document has been generated automatically by
[baldrick-doc-ts](https://github.com/flarebyte/baldrick-doc-ts)

## Diagram of the dependencies

```mermaid
classDiagram
class `check-file.ts`{
  +checkFile()
}
class `client.ts`{
  +runClient()
}
class `command-object.ts`{
  +commandObject()
}
class `command-render.ts`{
  - extractDestContent()
  +commandRender()
}
class `file-io.ts`{
  - compileTemplate()
  - parseGithubFilename()
  - readGithubFile()
  - readContentAsString()
  +readInputFile()
  +readInputFiles()
  +saveObjectFile()
  +saveTextFile()
}
class `handlebars-helpers.ts`{
  +ifSatisfy()
  +listJoin()
  - isStringArray()
  - isString()
  - isFiniteNumber()
  - parseNumber()
  - withIgnoreCase()
  - withIgnoreSpace()
  - withIgnorePunctuation()
  - withAllIgnore()
  - stringCompare()
  - parseFlags()
  - asAlternativeExpected()
  - ifSatisfyForString()
  - ifSatisfyForNumber()
  +ifSatisfyForStringList()
  +ifSatisfyHelper()
  - isAnyArray()
  +replaceAll()
  - countNewLines()
}
class `index.ts`
class `merge-objects.ts`{
  - isNullOrUndefined()
  - isString()
  - isPrimitive()
  - isObject()
  - isArray()
  - mergeArrayValues()
  - mergeKey()
  - mergeJsonObjectsByKey()
  - fromFunctionInfos()
  - toJsonObject()
  +mergeObjects()
}
class `model.ts`
class `parse-elm-function.ts`{
  - isFunctionInfo()
  - trimStrings()
  - chompLast()
  - replaceArrowWithinParenthesis()
  - parseParams()
  - extractName()
  - matchName()
  - findElmFunctionBlocks()
  +parseElmFunction()
  +parseElmFunctions()
}
class `text-utils.ts`{
  - capitalizeWord()
  - wordToCamel()
  - splitBySpace()
  +splitOnCaseChange()
  - isNullOrUndefined()
  +firstUpper()
  +firstLower()
  +toTitle()
  +upperCamelCase()
  +lowerCamelCase()
  +dasherize()
  +getFileType()
  +getFileIdentifier()
  +getFileIdentifiers()
  +dropExtension()
}
class `version.ts`
class `./model.js`{
  +ParamInfo()
  +FunctionInfo()
  +TemplateRenderer()
  +InputContent()
  +GithubFile()
  +FileId()
  +FileType()
}
class `commander`{
  +Command()
}
class `./command-object.js`{
  +commandObject()
}
class `./command-render.js`{
  +commandRender()
}
class `./version.js`{
  +version()
}
class `./check-file.js`{
  +checkFile()
}
class `./file-io.js`{
  +saveTextFile()
  +readInputFile()
  +saveObjectFile()
  +readInputFiles()
}
class `./merge-objects.js`{
  +mergeObjects()
}
class `./text-utils.js`{
  +upperCamelCase()
  +toTitle()
  +lowerCamelCase()
  +firstUpper()
  +firstLower()
  +dropExtension()
  +dasherize()
  +getFileIdentifier()
  +getFileIdentifiers()
}
class `node:path`{
  +path()
}
class `fs-jetpack`{
  +jetpack()
}
class `yaml`{
  +YAML()
}
class `type-fest`{
  +JsonObject()
  +JsonValue()
  +JsonPrimitive()
  +JsonArray()
}
class `handlebars`{
  +HelperOptions()
  +Handlebars()
}
class `octokit`{
  +Octokit()
}
class `./parse-elm-function.js`{
  +parseElmFunctions()
}
class `./handlebars-helpers.js`{
  +listJoin()
  +ifSatisfy()
}
class `./model`{
  +FileType()
  +FileId()
  +InputContent()
  +FunctionInfo()
}
`check-file.ts`-->`./model.js`
`client.ts`-->`commander`
`client.ts`-->`./command-object.js`
`client.ts`-->`./command-render.js`
`client.ts`-->`./version.js`
`command-object.ts`-->`./check-file.js`
`command-object.ts`-->`./file-io.js`
`command-object.ts`-->`./merge-objects.js`
`command-object.ts`-->`./text-utils.js`
`command-render.ts`-->`node:path`
`command-render.ts`-->`./check-file.js`
`command-render.ts`-->`./file-io.js`
`command-render.ts`-->`./merge-objects.js`
`command-render.ts`-->`./model.js`
`command-render.ts`-->`./text-utils.js`
`file-io.ts`-->`fs-jetpack`
`file-io.ts`-->`yaml`
`file-io.ts`-->`type-fest`
`file-io.ts`-->`handlebars`
`file-io.ts`-->`octokit`
`file-io.ts`-->`./parse-elm-function.js`
`file-io.ts`-->`./model.js`
`file-io.ts`-->`./check-file.js`
`file-io.ts`-->`./text-utils.js`
`file-io.ts`-->`./handlebars-helpers.js`
`handlebars-helpers.ts`-->`handlebars`
`merge-objects.ts`-->`type-fest`
`merge-objects.ts`-->`./model`
`model.ts`-->`type-fest`
`parse-elm-function.ts`-->`./model.js`
`text-utils.ts`-->`./model`
```
