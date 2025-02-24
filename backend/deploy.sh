#!/bin/bash
# DO NOT hardcode secrets in this file.
# Secrets are fetched securely from AWS SSM.

# Set AWS region (customize if needed)
AWS_REGION="us-east-1"

echo "Building the Lambda function with SAM..."
sam build

echo "Fetching secrets from AWS SSM Parameter Store..."
DB_HOST=$(aws ssm get-parameter --name "/horariu/DB_HOST" --with-decryption --region $AWS_REGION --query "Parameter.Value" --output text)
DB_USER=$(aws ssm get-parameter --name "/horariu/DB_USER" --with-decryption --region $AWS_REGION --query "Parameter.Value" --output text)
DB_PASSWORD=$(aws ssm get-parameter --name "/horariu/DB_PASSWORD" --with-decryption --region $AWS_REGION --query "Parameter.Value" --output text)
DB_NAME=$(aws ssm get-parameter --name "/horariu/DB_NAME" --with-decryption --region $AWS_REGION --query "Parameter.Value" --output text)
DB_PORT=$(aws ssm get-parameter --name "/horariu/DB_PORT" --with-decryption --region $AWS_REGION --query "Parameter.Value" --output text)
NODE_ENV=$(aws ssm get-parameter --name "/horariu/NODE_ENV" --with-decryption --region $AWS_REGION --query "Parameter.Value" --output text)
JWT_SECRET=$(aws ssm get-parameter --name "/horariu/JWT_SECRET" --with-decryption --region $AWS_REGION --query "Parameter.Value" --output text)

echo "Secrets fetched successfully!"

echo "Deploying to AWS Lambda..."
sam deploy \
  --parameter-overrides \
  ParameterKey=DBHost,ParameterValue=$DB_HOST \
  ParameterKey=DBUser,ParameterValue=$DB_USER \
  ParameterKey=DBPassword,ParameterValue=$DB_PASSWORD \
  ParameterKey=DBName,ParameterValue=$DB_NAME \
  ParameterKey=DBPort,ParameterValue=$DB_PORT \
  ParameterKey=NodeEnv,ParameterValue=$NODE_ENV \
  ParameterKey=JwtSecret,ParameterValue=$JWT_SECRET
