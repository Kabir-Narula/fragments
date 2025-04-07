#!/bin/bash

# Set AWS credentials
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_SESSION_TOKEN=test
export AWS_DEFAULT_REGION=us-east-1

# Wait for LocalStackdo
echo "Waiting for LocalStack S3..."
until curl -s http://localhost:4566/_localstack/health | grep "\"s3\": \"available\""; do
  sleep 5
done

# Create S3 bucket
aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket fragments

# Create DynamoDB table
aws --endpoint-url=http://localhost:8000 dynamodb create-table \
    --table-name fragments \
    --attribute-definitions \
        AttributeName=ownerId,AttributeType=S \
        AttributeName=id,AttributeType=S \
    --key-schema \
        AttributeName=ownerId,KeyType=HASH \
        AttributeName=id,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=10,WriteCapacityUnits=5

# Wait for table creation
aws --endpoint-url=http://localhost:8000 dynamodb wait table-exists --table-name fragments