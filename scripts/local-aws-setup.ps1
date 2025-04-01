$env:AWS_ACCESS_KEY_ID = "test"
$env:AWS_SECRET_ACCESS_KEY = "test"
$env:AWS_SESSION_TOKEN = "test"
$env:AWS_DEFAULT_REGION = "us-east-1"

Write-Host "Waiting for LocalStack S3..."
do {
    Start-Sleep -Seconds 5
    $health = Invoke-RestMethod -Uri "http://localhost:4566/_localstack/health"
    Write-Host "Current status: $($health.services.s3)"
} until ($health.services.s3 -eq "running")
Write-Host "LocalStack S3 Ready"

# Create S3 bucket
aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket fragments

# Create DynamoDB table
aws --endpoint-url=http://localhost:8000 dynamodb create-table `
    --table-name fragments `
    --attribute-definitions AttributeName=ownerId,AttributeType=S AttributeName=id,AttributeType=S `
    --key-schema AttributeName=ownerId,KeyType=HASH AttributeName=id,KeyType=RANGE `
    --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5

# Wait for table
aws --endpoint-url=http://localhost:8000 dynamodb wait table-exists --table-name fragments