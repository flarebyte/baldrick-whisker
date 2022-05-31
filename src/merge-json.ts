import { InputContent, JsonContent } from "./model";

const mergeTwoContents = (a: JsonContent, b: JsonContent): JsonContent => {
    const tupleAList = Object.entries(a)
    const tupleBList = Object.entries(b)
    const results = [...tupleAList]
    
    return Object.fromEntries(results);

}

export const mergeContents = (inputContents: InputContent[]): JsonContent => {
    let result: JsonContent = {};
    for (const content of inputContents) {
        
    }
    return result;
}