#!/bin/bash

AWS_REGION="us-east-1"
S3_BUCKET="horariu-app-deployment-bucket"
STAGE=${1:-Dev}  # Dev by default, but we can use Prod with the command: ./deploy.sh Prod

STACK_NAME="horariu-${STAGE}"

if [ "$STAGE" == "Prod" ]; then
  ALLOWED_ORIGIN="'https://www.horariu.com'"
else
  ALLOWED_ORIGIN="'http://localhost:5173'"
fi

echo "----------------------------------------"
echo "Building the project..."
echo "----------------------------------------"

npm run build

echo "----------------------------------------"
echo "Building the Lambda function with SAM..."
echo "----------------------------------------"

sam build

DB_HOST=$(aws ssm get-parameter --name "/horariu/${STAGE}/DB_HOST" --with-decryption --region $AWS_REGION --query "Parameter.Value" --output text)
DB_USER=$(aws ssm get-parameter --name "/horariu/${STAGE}/DB_USER" --with-decryption --region $AWS_REGION --query "Parameter.Value" --output text)
DB_PASSWORD=$(aws ssm get-parameter --name "/horariu/${STAGE}/DB_PASSWORD" --with-decryption --region $AWS_REGION --query "Parameter.Value" --output text)
DB_NAME=$(aws ssm get-parameter --name "/horariu/${STAGE}/DB_NAME" --with-decryption --region $AWS_REGION --query "Parameter.Value" --output text)
DB_PORT=$(aws ssm get-parameter --name "/horariu/${STAGE}/DB_PORT" --with-decryption --region $AWS_REGION --query "Parameter.Value" --output text)
NODE_ENV=$(aws ssm get-parameter --name "/horariu/${STAGE}/NODE_ENV" --with-decryption --region $AWS_REGION --query "Parameter.Value" --output text)
JWT_SECRET=$(aws ssm get-parameter --name "/horariu/${STAGE}/JWT_SECRET" --with-decryption --region $AWS_REGION --query "Parameter.Value" --output text)

echo "----------------------------------------"
echo "Deploying to AWS Lambda ($STAGE environment)..."
echo "Using AllowOrigin: $ALLOWED_ORIGIN"
echo "----------------------------------------"

sam deploy \
  --stack-name $STACK_NAME \
  --s3-bucket $S3_BUCKET \
  --region $AWS_REGION \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
  ParameterKey=StageName,ParameterValue=$STAGE \
  ParameterKey=DBHost,ParameterValue=$DB_HOST \
  ParameterKey=DBUser,ParameterValue=$DB_USER \
  ParameterKey=DBPassword,ParameterValue=$DB_PASSWORD \
  ParameterKey=DBName,ParameterValue=$DB_NAME \
  ParameterKey=DBPort,ParameterValue=$DB_PORT \
  ParameterKey=NodeEnv,ParameterValue=$NODE_ENV \
  ParameterKey=JwtSecret,ParameterValue=$JWT_SECRET \
  ParameterKey=AllowOrigin,ParameterValue=$ALLOWED_ORIGIN \
  | grep -v -E 'DBPassword|JwtSecret|DBUser|DBHost|DBName|DBPort|NodeEnv'

echo "----------------------------------------"
echo "All finished. Check if there's any errors or everything went smoothly!"
echo "----------------------------------------"