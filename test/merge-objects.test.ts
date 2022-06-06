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
      primitive: 8,
      arrayOfString: ['one', 'two'],
      someObject: { label: 'first' },
    },
    {
      primitive: 9,
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
      primitive: 8,
      arrayOfString: ['ten-one', 'ten-two'],
      someObject: { label: 'first' },
    },
  ],
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
            "primitive": 8,
            "someObject": Object {
              "label": "first",
            },
          },
          Object {
            "arrayOfString": Array [
              "ten",
              "eleven",
            ],
            "primitive": 9,
            "someObject": Object {
              "label": "second",
            },
          },
          Object {
            "arrayOfString": Array [
              "ten-one",
              "ten-two",
            ],
            "primitive": 8,
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
});
