import { parseElmFunction, parseElmFunctions } from '../src/parse-elm-function';
import { elmCodeFixture } from './elm-code-fixture';

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
    const actual = parseElmFunctions(elmCodeFixture);
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
