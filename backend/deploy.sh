#!/bin/bash

AWS_REGION="us-east-1"
S3_BUCKET="horariu-app-deployment-bucket"
STAGE=${1:-Dev}  # Dev by default, but we can use Prod with the command: ./deploy.sh Prod

STACK_NAME="horariu-${STAGE}"

echo "----------------------------------------"
echo "Building the Lambda function with SAM..."
echo "----------------------------------------"

sam build

echo "----------------------------------------"
echo "Fetching secrets from AWS SSM Parameter Store..."
echo "----------------------------------------"
DB_HOST=$(aws ssm get-parameter --name "/horariu/${STAGE}/DB_HOST" --with-decryption --region $AWS_REGION --query "Parameter.Value" --output text)
DB_USER=$(aws ssm get-parameter --name "/horariu/${STAGE}/DB_USER" --with-decryption --region $AWS_REGION --query "Parameter.Value" --output text)
DB_PASSWORD=$(aws ssm get-parameter --name "/horariu/${STAGE}/DB_PASSWORD" --with-decryption --region $AWS_REGION --query "Parameter.Value" --output text)
DB_NAME=$(aws ssm get-parameter --name "/horariu/${STAGE}/DB_NAME" --with-decryption --region $AWS_REGION --query "Parameter.Value" --output text)
DB_PORT=$(aws ssm get-parameter --name "/horariu/${STAGE}/DB_PORT" --with-decryption --region $AWS_REGION --query "Parameter.Value" --output text)
NODE_ENV=$(aws ssm get-parameter --name "/horariu/${STAGE}/NODE_ENV" --with-decryption --region $AWS_REGION --query "Parameter.Value" --output text)
JWT_SECRET=$(aws ssm get-parameter --name "/horariu/${STAGE}/JWT_SECRET" --with-decryption --region $AWS_REGION --query "Parameter.Value" --output text)

echo "----------------------------------------"
echo "Secrets fetched successfully!"
echo "----------------------------------------"

echo "----------------------------------------"
echo "Deploying to AWS Lambda..."
echo "----------------------------------------"

sam deploy \
  --stack-name $STACK_NAME \
  --s3-bucket $S3_BUCKET \
  --region $AWS_REGION \
  --capabilities CAPABILITY_IAM \
  --confirm-changeset \
  --parameter-overrides \
  ParameterKey=StageName,ParameterValue=$STAGE \
  ParameterKey=DBHost,ParameterValue=$DB_HOST \
  ParameterKey=DBUser,ParameterValue=$DB_USER \
  ParameterKey=DBPassword,ParameterValue=$DB_PASSWORD \
  ParameterKey=DBName,ParameterValue=$DB_NAME \
  ParameterKey=DBPort,ParameterValue=$DB_PORT \
  ParameterKey=NodeEnv,ParameterValue=$NODE_ENV \
  ParameterKey=JwtSecret,ParameterValue=$JWT_SECRET

echo "----------------------------------------"
echo "All finished. Check if there's any errors or everything went smoothly!"
echo "----------------------------------------"