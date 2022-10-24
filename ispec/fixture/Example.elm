module Bubblegum.Entity.Example exposing
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


{-| Set an optional list of tags to mark the data

    setFacets [ "min", "inclusive" ] model

-}
setFacets : List String -> Model -> Model
setFacets facets model =
    { model | facets = facets }


{-| Set a list of string values

    setValues [ "some label" ] model

-}
setValues : List String -> Model -> Model
setValues values model =
    { model | values = values }


blankAttribute : Model
blankAttribute =
    { id = Nothing
    , key = ""
    , facets = []
    , values = []
    }


{-| Find an attribute by key

    findAttributeByKey "ui:label" models -- Just label

-}
findAttributeByKey : String -> List Model -> Maybe Model
findAttributeByKey key attributes =
    case attributes of
        [] ->
            Nothing

        first :: rest ->
            if first.key == key then
                Just first

            else
                findAttributeByKey key rest


{-| Delete an attribute by key

    deleteAttributeByKey "ui:label" models -- []

-}
deleteAttributeByKey : String -> List Model -> List Model
deleteAttributeByKey key attributes =
    List.filter (\attr -> attr.key /= key) attributes


{-| Find an attribute by key and then get the first value if any

    findAttributeFirstValueByKey "ui:label" models -- Just "some label"

-}
findAttributeFirstValueByKey : String -> List Model -> Maybe String
findAttributeFirstValueByKey key attributes =
    findAttributeByKey key attributes |> Maybe.map .values |> Maybe.andThen List.head


{-| Find an outcome searching by key

    findOutcomeByKey "ui:label" models -- Valid ["some label"]

-}
findOutcomeByKey : String -> List Model -> Outcome (List String)
findOutcomeByKey key attributes =
    findAttributeByKey key attributes |> Maybe.map .values |> Outcome.fromMaybe


createTuple : a -> a -> ( a, a )
createTuple a b =
    ( a, b )


{-| Find an outcome searching by a couple of keys

    findOutcomeByKeyTuple ( "ui:min", "ui:max" ) models -- Valid (["1"], ["10"])

-}
findOutcomeByKeyTuple : ( String, String ) -> List Model -> Outcome ( List String, List String )
findOutcomeByKeyTuple tuple attributes =
    let
        a =
            findAttributeByKey (first tuple) attributes |> Maybe.map .values

        b =
            findAttributeByKey (second tuple) attributes |> Maybe.map .values

        ab =
            Maybe.map2 createTuple a b
    in
    Outcome.fromMaybe ab


{-| Replace or create an attribute by key

     replaceAttributeByKey "ui:label" ["new label"] models -- models

-}
replaceAttributeByKey : String -> List String -> List Model -> List Model
replaceAttributeByKey key values attributes =
    let
        existingOrNew =
            findAttributeByKey key attributes |> Maybe.withDefault { blankAttribute | key = key }
    in
    deleteAttributeByKey key attributes |> (++) [ { existingOrNew | values = values } ]
