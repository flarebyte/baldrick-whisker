import { parseElmFunction, parseElmFunctions } from '../src/parse-elm-function';

const elmCode = `
module Bubblegum.Entity.Attribute exposing
    ( Model, setId, setKey, setValues, setFacets
    , findAttributeByKey, findAttributeFirstValueByKey, replaceAttributeByKey, deleteAttributeByKey
    , findOutcomeByKey, findOutcomeByKeyTuple
    )

{-| An attribute represents a small piece of information such as a [Semantic triple](https://en.wikipedia.org/wiki/Semantic_triple).


# Model setters

@docs Model, setId, setKey, setValues, setFacets


# Attribute

@docs findAttributeByKey, findAttributeFirstValueByKey, replaceAttributeByKey, deleteAttributeByKey


# Outcome

@docs findOutcomeByKey, findOutcomeByKeyTuple

-}

import Bubblegum.Entity.Outcome as Outcome exposing (Outcome(..))
import Maybe
import Tuple exposing (first, second)


{-| The core representation of an attribute with:

  - id: a possible id to represent the attribute (ex: id:1234)
  - key: the key of the attribute (ex: ui:label)
  - values: a list of string values
  - facets: an optional list of tags to mark the data (ex: [min])

When representing a RDF triple:

  - subject: should be represented by id
  - predicate: should be represented by key
  - object: should be represented by values

-}
type alias Model =
    { id : Maybe String
    , key : String
    , values : List String
    , facets : List String
    }


{-| Set a possible id to represent the attribute

     setId (Just "id:1234") model

-}
setId : Maybe String -> Model -> Model
setId id model =
    { model | id = id }


{-| Set the key of the attribute

    setKey "ui:label" model

-}
setKey : String -> Model -> Model
setKey key model =
    { model | key = key }

`;

describe('parse-elm', () => {
  describe('parseElmFunction', () => {
    it('should parse a valid function', () => {
      const actual = parseElmFunction([
        'setId : Maybe String -> Model -> ReturnedModel',
        'setId id model =',
      ]);
      expect(actual).toMatchInlineSnapshot(`
        Object {
          "name": "setId",
          "params": Array [
            Array [
              "id",
              "Maybe String",
            ],
            Array [
              "model",
              "Model",
            ],
          ],
          "returned": "ReturnedModel",
        }
      `);
    });
    it('should parse a one parameter function', () => {
      const actual = parseElmFunction([
        'setId : Maybe String -> ReturnedModel',
        'setId id = ',
      ]);
      expect(actual).toMatchInlineSnapshot(`
        Object {
          "name": "setId",
          "params": Array [
            Array [
              "id",
              "Maybe String",
            ],
          ],
          "returned": "ReturnedModel",
        }
      `);
    });
    it('should parse a higher level function', () => {
      const actual = parseElmFunction([
        'setId : Maybe String -> ( Int -> String ) ->ReturnedModel',
        'setId id formatter = ',
      ]);
      expect(actual).toMatchInlineSnapshot(`
        Object {
          "name": "setId",
          "params": Array [
            Array [
              "id",
              "Maybe String",
            ],
            Array [
              "formatter",
              "( Int -> String )",
            ],
          ],
          "returned": "ReturnedModel",
        }
      `);
    });
  });
  it('should parse a valid elm code', () => {
    const actual = parseElmFunctions(elmCode);
    expect(actual).toMatchInlineSnapshot(`
      Array [
        Object {
          "name": "setId",
          "params": Array [
            Array [
              "id",
              "Maybe String",
            ],
            Array [
              "model",
              "Model",
            ],
          ],
          "returned": "Model",
        },
        Object {
          "name": "setKey",
          "params": Array [
            Array [
              "key",
              "String",
            ],
            Array [
              "model",
              "Model",
            ],
          ],
          "returned": "Model",
        },
      ]
    `);
  });
});
