import { mergeObjects } from '../src/merge-objects';

const alpha = {
  singlePrimitive: 7,
  anyObject: {
    title: 'root',
  },
  arrayOfString: ['un', 'deux', 'trois'],
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
});
