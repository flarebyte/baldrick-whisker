# API of baldrick-whisker

> List of functions and variables for `baldrick-whisker`

**Functions:**

-   [mergeObjects](API.md#mergeObjects)
-   [parseElmFunctions](API.md#parseElmFunctions)
-   [readInputFile](API.md#readInputFile)
-   [saveObjectFile](API.md#saveObjectFile)

## mergeObjects

⎔ Merge several JSON, YAML, elm documents into one

### Parameters

-   inputContents: Array of `InputContent`: a list of JSON and YAML payload
    to merge

### Returns

the merged JsonObject

See [merge-objects.ts -
L104](https://github.com/flarebyte/baldrick-whisker/blob/main/src/merge-objects.ts#L104)

## parseElmFunctions

⎔ Parse an Elm file content to retrieve the functions

### Parameters

-   content: `string`: Elm file content

### Returns

a list of information about each function

See [parse-elm-function.ts -
L113](https://github.com/flarebyte/baldrick-whisker/blob/main/src/parse-elm-function.ts#L113)

## readInputFile

⎔ Read a supported input file (JSON, YAML, Elm, Markdown)

### Parameters

-   fileId: `FileId`: a file identifier

### Returns

a structure content representing the file

See [file-io.ts -
L75](https://github.com/flarebyte/baldrick-whisker/blob/main/src/file-io.ts#L75)

## saveObjectFile

⎔ Save a JSON object as a JSON or YAML file

### Parameters

-   fileId: `FileId`: a file identifier
-   content: `JsonObject`: some JSON or YAML content

See [file-io.ts -
L152](https://github.com/flarebyte/baldrick-whisker/blob/main/src/file-io.ts#L152)
