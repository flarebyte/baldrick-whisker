import { mergeObjects } from '../src/merge-objects';

const alpha = {
  singlePrimitive: 7,
  anyObject: {
    title: 'alpha-root',
  },
  arrayOfString: ['un', 'deux', 'trois'],
  secondArrayOfString: ['un'],
  arrayOfObjs: [
    {
      primitive: 'eight',
      arrayOfString: ['one', 'two'],
      someObject: { label: 'first' },
    },
    {
      primitive: 'nine',
      arrayOfString: ['ten', 'eleven'],
      someObject: { label: 'second' },
    },
  ],
};

const beta = {
  singlePrimitive: 8,
  secondPrimitive: 2,
  anyObject: {
    title: 'beta-root',
  },
  arrayOfString: ['quatre'],
  arrayOfObjs: [
    {
      primitive: 'eight',
      arrayOfString: ['ten-one', 'ten-two'],
      someObject: { label: 'first' },
    },
  ],
};

const betaWithPrimary = {
  singlePrimitive: 8,
  secondPrimitive: 2,
  anyObject: {
    title: 'beta-root',
  },
  arrayOfString: ['quatre'],
  arrayOfObjs: {
    __merging_primary_key: 'primitive',
    eight: {
      primitive: 'eight',
      arrayOfString: ['ten-one', 'ten-two'],
      someObject: { label: 'first' },
    },
    ten: {
      primitive: 'ten',
      arrayOfString: ['ten-one', 'ten-two'],
      someObject: { label: 'third' },
    },
  },
};

describe('merge-objects', () => {
  it('should deal with empty array', () => {
    const actual = mergeObjects([]);
    expect(actual).toStrictEqual({});
  });
  it('should not modify an existing object', () => {
    const actual = mergeObjects([
      {
        fileType: 'json',
        json: alpha,
        content: JSON.stringify(alpha),
        filename: 'file1',
      },
    ]);
    expect(actual).toStrictEqual(alpha);
  });
  it('should include a message for a corrupted file', () => {
    const actual = mergeObjects([
      {
        fileType: 'json',
        json: alpha,
        content: JSON.stringify(alpha),
        filename: 'file1',
      },
      {
        fileType: 'invalid',
        filename: 'corrupted',
      },
    ]);
    expect(actual).toHaveProperty('messages');
  });
  it('should merge two files without primary key', () => {
    const actual = mergeObjects([
      {
        fileType: 'json',
        json: alpha,
        content: JSON.stringify(alpha),
        filename: 'file1.json',
      },
      {
        fileType: 'yaml',
        json: beta,
        content: JSON.stringify(beta),
        filename: 'file2.yaml',
      },
    ]);
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "anyObject": Object {
          "title": "beta-root",
        },
        "arrayOfObjs": Array [
          Object {
            "arrayOfString": Array [
              "one",
              "two",
            ],
            "primitive": "eight",
            "someObject": Object {
              "label": "first",
            },
          },
          Object {
            "arrayOfString": Array [
              "ten",
              "eleven",
            ],
            "primitive": "nine",
            "someObject": Object {
              "label": "second",
            },
          },
          Object {
            "arrayOfString": Array [
              "ten-one",
              "ten-two",
            ],
            "primitive": "eight",
            "someObject": Object {
              "label": "first",
            },
          },
        ],
        "arrayOfString": Array [
          "un",
          "deux",
          "trois",
          "quatre",
        ],
        "secondArrayOfString": Array [
          "un",
        ],
        "secondPrimitive": 2,
        "singlePrimitive": 8,
      }
    `);
  });
  it('should merge two files with a primary key', () => {
    const actual = mergeObjects([
      {
        fileType: 'json',
        json: alpha,
        content: JSON.stringify(alpha),
        filename: 'file1.json',
      },
      {
        fileType: 'yaml',
        json: betaWithPrimary,
        content: JSON.stringify(betaWithPrimary),
        filename: 'file2.yaml',
      },
    ]);
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "anyObject": Object {
          "title": "beta-root",
        },
        "arrayOfObjs": Array [
          Object {
            "arrayOfString": Array [
              "one",
              "two",
              "ten-one",
              "ten-two",
            ],
            "primitive": "eight",
            "someObject": Object {
              "label": "first",
            },
          },
          Object {
            "arrayOfString": Array [
              "ten",
              "eleven",
            ],
            "primitive": "nine",
            "someObject": Object {
              "label": "second",
            },
          },
        ],
        "arrayOfString": Array [
          "un",
          "deux",
          "trois",
          "quatre",
        ],
        "secondArrayOfString": Array [
          "un",
        ],
        "secondPrimitive": 2,
        "singlePrimitive": 8,
      }
    `);
  });
  it('should merge a elm file with a json file', () => {
    const actual = mergeObjects([
      {
        fileType: 'elm',
        content: '{-| a elm file content -}',
        functionInfos: [
          {
            name: 'setId',
            params: [
              { paramName: 'id', paramType: 'Maybe String' },
              { paramName: 'model', paramType: 'Model' },
            ],
            returned: 'Model',
          },
          {
            name: 'setKey',
            params: [
              { paramName: 'key', paramType: 'Maybe String' },
              { paramName: 'model', paramType: 'Model' },
            ],
            returned: 'Model',
          },
        ],
        filename: 'file1.elm',
      },
    ]);
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "functions": Array [
          Object {
            "name": "setId",
            "params": Array [
              Object {
                "paramName": "id",
                "paramType": "Maybe String",
              },
              Object {
                "paramName": "model",
                "paramType": "Model",
              },
            ],
            "returned": "Model",
          },
          Object {
            "name": "setKey",
            "params": Array [
              Object {
                "paramName": "key",
                "paramType": "Maybe String",
              },
              Object {
                "paramName": "model",
                "paramType": "Model",
              },
            ],
            "returned": "Model",
          },
        ],
      }
    `);
  });
});
