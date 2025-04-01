// XXX: temporary use of memory-db until we add DynamoDB
const MemoryDB = require('../memory/memory-db');
const s3Client = require('./s3Client');
const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const logger = require('../../../logger');

// Create in-memory database for fragment metadata
const metadata = new MemoryDB();

// Convert stream to Buffer utility function
const streamToBuffer = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });

// Write a fragment's metadata to memory db
async function writeFragment(fragment) {
  const serialized = JSON.stringify(fragment);
  await metadata.put(fragment.ownerId, fragment.id, serialized);
}

// Read a fragment's metadata from memory db
async function readFragment(ownerId, id) {
  const serialized = await metadata.get(ownerId, id);
  return typeof serialized === 'string' ? JSON.parse(serialized) : serialized;
}

// Write a fragment's data buffer to S3
async function writeFragmentData(ownerId, id, buffer) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
    Body: buffer,
  };

  const command = new PutObjectCommand(params);

  try {
    await s3Client.send(command);
  } catch (err) {
    const { Bucket, Key } = params;
    logger.error({ err, Bucket, Key }, 'Error uploading fragment data to S3');
    throw new Error('unable to upload fragment data');
  }
}

// Read a fragment's data from S3
async function readFragmentData(ownerId, id) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
  };

  const command = new GetObjectCommand(params);

  try {
    const data = await s3Client.send(command);
    return streamToBuffer(data.Body);
  } catch (err) {
    const { Bucket, Key } = params;
    logger.error({ err, Bucket, Key }, 'Error streaming fragment data from S3');
    throw new Error('unable to read fragment data');
  }
}

// Delete a fragment's metadata from memory and data from S3
async function deleteFragment(ownerId, id) {
  // Delete metadata from memoryDB
  await metadata.del(ownerId, id);

  // Delete data from S3
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
  };

  const command = new DeleteObjectCommand(params);

  try {
    await s3Client.send(command);
  } catch (err) {
    const { Bucket, Key } = params;
    logger.error({ err, Bucket, Key }, 'Error deleting fragment data from S3');
    throw new Error('unable to delete fragment data');
  }
}

// List fragments (metadata remains in memoryDB)
async function listFragments(ownerId, expand = false) {
  const fragments = await metadata.query(ownerId);
  const parsedFragments = fragments.map((fragment) => JSON.parse(fragment));

  return expand ? parsedFragments : parsedFragments.map((fragment) => fragment.id);
}

module.exports = {
  listFragments,
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  deleteFragment,
};