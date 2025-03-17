const { randomUUID } = require('crypto');
const contentType = require('content-type');
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');
const logger = require('../logger');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!ownerId || !type) {
      throw new Error('Owner ID and type are required');
    }

    if (!Fragment.isSupportedType(type)) {
      throw new Error(`Type ${type} not supported`);
    }

    if (typeof size !== 'number' || size < 0) {
      throw new Error('Size must be a non-negative number');
    }

    this.id = id || randomUUID();
    this.ownerId = ownerId;
    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();
    this.type = type;
    this.size = size;
  }

  static async byUser(ownerId, expand = false) {
    const fragments = await listFragments(ownerId, expand);
    return expand ? fragments.map((f) => new Fragment(f)) : fragments;
  }

  static async byId(ownerId, id) {
    const data = await readFragment(ownerId, id);
    if (!data) throw new Error('Fragment not found');
    return new Fragment(data);
  }

  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  async save() {
    this.updated = new Date().toISOString();
    await writeFragment(this);
  }

  async getData() {
    const data = await readFragmentData(this.ownerId, this.id);
    if (!data) throw new Error('Fragment data not found');
    return data;
  }

  async setData(data) {
    if (!Buffer.isBuffer(data)) {
      throw new Error('Data must be a Buffer');
    }

    this.updated = new Date().toISOString();
    this.size = data.length;
    await writeFragmentData(this.ownerId, this.id, data);
    await this.save();
  }

  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  get isText() {
    return this.mimeType.startsWith('text/');
  }

  get formats() {
    return ['text/plain', 'text/markdown', 'text/html', 'application/json'];
  }

  static isSupportedType(value) {
    try {
      const { type } = contentType.parse(value);
      return validTypes.includes(type);
    } catch (err) {
      logger.error(err);
      return false;
    }
  }

  static async convertData(data, fromType, toType) {
    if (fromType === 'text/markdown' && toType === 'text/html') {
      const markdownIt = require('markdown-it')();
      return markdownIt.render(data.toString());
    }
    throw new Error('Unsupported conversion');
  }
}

const validTypes = [
  'text/plain',
  'text/markdown',
  'application/json',
  'charset=uft-8'
];

module.exports.Fragment = Fragment;