// In tests/setup.js
jest.mock('../src/model/fragment', () => {
  const actual = jest.requireActual('../src/model/fragment');
  return {
    Fragment: jest.fn().mockImplementation((params) => {
      const fragment = new actual.Fragment(params);
      return {
        ...fragment,
        save: jest.fn().mockImplementation(function() {
          this.updated = new Date().toISOString();
          return Promise.resolve(true);
        }),
        setData: jest.fn().mockImplementation(function(data) {
          this.size = Buffer.byteLength(data);
          return Promise.resolve(true);
        }),
      };
    }),
    Fragment: {
      ...actual.Fragment,
      isSupportedType: jest.fn().mockImplementation((type) => 
        ['text/plain'].includes(type)
      )
    }
  };
});