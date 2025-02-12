const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  listFragments,
  deleteFragment,
} = require('../../src/model/data/memory/index');

describe('Memory Backend Data Functions', () => {
  // Test writeFragment/readFragment
  test('writeFragment() and readFragment() work with valid data', async () => {
    const fragment = {
      ownerId: 'user1',
      id: '1',
      type: 'text/plain',
      size: 256,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };
    
    await writeFragment(fragment);
    const result = await readFragment(fragment.ownerId, fragment.id);
    
    expect(result).toEqual(fragment);
  });

  test('readFragment() returns undefined with invalid keys', async () => {
    const result = await readFragment('invalid-user', 'invalid-id');
    expect(result).toBeUndefined();
  });

  // Test writeFragmentData/readFragmentData
  test('writeFragmentData() and readFragmentData() work with buffers', async () => {
    const ownerId = 'user2';
    const id = '2';
    const buffer = Buffer.from('test data');
    
    await writeFragmentData(ownerId, id, buffer);
    const result = await readFragmentData(ownerId, id);
    
    expect(result).toEqual(buffer);
    expect(Buffer.isBuffer(result)).toBe(true);
  });

  test('readFragmentData() returns undefined with invalid keys', async () => {
    const result = await readFragmentData('invalid-user', 'invalid-id');
    expect(result).toBeUndefined();
  });

  // Test listFragments
  test('listFragments() returns empty array when no fragments exist', async () => {
    const result = await listFragments('empty-user');
    expect(result).toEqual([]);
  });

  test('listFragments() returns ids when expand=false', async () => {
    const ownerId = 'user3';
    const fragments = [
      { ownerId, id: '1', type: 'text/plain', size: 100 },
      { ownerId, id: '2', type: 'text/plain', size: 200 },
    ];

    await Promise.all(fragments.map(fragment => writeFragment(fragment)));
    const result = await listFragments(ownerId);
    
    expect(result).toEqual(['1', '2']);
  });

  test('listFragments() returns expanded fragments when expand=true', async () => {
    const ownerId = 'user4';
    const fragments = [
      { ownerId, id: '1', type: 'text/plain', size: 100 },
      { ownerId, id: '2', type: 'text/plain', size: 200 },
    ];

    await Promise.all(fragments.map(fragment => writeFragment(fragment)));
    const result = await listFragments(ownerId, true);
    
    expect(result).toEqual(fragments);
  });

  // Test deleteFragment
  test('deleteFragment() removes metadata and data', async () => {
    const ownerId = 'user5';
    const id = '1';
    const fragment = { ownerId, id, type: 'text/plain', size: 100 };
    const buffer = Buffer.from('test data');

    await writeFragment(fragment);
    await writeFragmentData(ownerId, id, buffer);
    await deleteFragment(ownerId, id);

    const metadataResult = await readFragment(ownerId, id);
    const dataResult = await readFragmentData(ownerId, id);
    
    expect(metadataResult).toBeUndefined();
    expect(dataResult).toBeUndefined();
  });

  // Test error handling
  test('writeFragment() throws with invalid ownerId type', async () => {
    const fragment = { ownerId: 123, id: '1' };
    await expect(writeFragment(fragment)).rejects.toThrow(
      'primaryKey and secondaryKey strings are required'
    );
  });

  test('readFragmentData() throws with invalid id type', async () => {
    await expect(readFragmentData('user6', null)).rejects.toThrow(
      'primaryKey and secondaryKey strings are required'
    );
  });

  test('deleteFragment() throws with non-string keys', async () => {
    await expect(deleteFragment(123, '1')).rejects.toThrow();
    await expect(deleteFragment('user7', true)).rejects.toThrow();
  });
});