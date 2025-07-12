#!/bin/bash

AWS_REGION="us-east-1"
S3_BUCKET="horariu-app-deployment-bucket"
STAGE=${1:-Dev}  # Dev by default, but we can use Prod with the command: ./deploy.sh Prod

IS_PR_VALIDATION=false
if [ "$STAGE" == "Validate" ]; then
  IS_PR_VALIDATION=true
  # Use Dev parameters for validation
  STAGE="Dev"
fi

STACK_NAME="horariu-${STAGE}"
if [ "$IS_PR_VALIDATION" == true ]; then
  # Use a temporary stack name for validation
  PR_NUMBER=$(echo $GITHUB_REF | awk -F/ '{print $3}')
  STACK_NAME="horariu-validation-pr-${PR_NUMBER:-temp}"
fi


if [ "$STAGE" == "Prod" ]; then
  ALLOWED_ORIGIN="'https://horariu.com'"
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
if [ "$IS_PR_VALIDATION" == true ]; then
  echo "Validating deployment to AWS Lambda (using ${STAGE} parameters)..."
else
  echo "Deploying to AWS Lambda (${STAGE} environment)..."
fi
echo "Using AllowOrigin: $ALLOWED_ORIGIN"
echo "----------------------------------------"

# Set up common parameters
PARAMS=(
  --stack-name $STACK_NAME
  --s3-bucket $S3_BUCKET
  --region $AWS_REGION
  --capabilities CAPABILITY_IAM
  --parameter-overrides 
  ParameterKey=StageName,ParameterValue=$STAGE
  ParameterKey=DBHost,ParameterValue=$DB_HOST
  ParameterKey=DBUser,ParameterValue=$DB_USER
  ParameterKey=DBPassword,ParameterValue=$DB_PASSWORD
  ParameterKey=DBName,ParameterValue=$DB_NAME
  ParameterKey=DBPort,ParameterValue=$DB_PORT
  ParameterKey=NodeEnv,ParameterValue=$NODE_ENV
  ParameterKey=JwtSecret,ParameterValue=$JWT_SECRET
  ParameterKey=AllowOrigin,ParameterValue=$ALLOWED_ORIGIN
)

if [ "$IS_PR_VALIDATION" == true ]; then
  # Just validate without deploying
  sam deploy --no-execute-changeset "${PARAMS[@]}" | grep -v -E 'DBPassword|JwtSecret|DBUser|DBHost|DBName|DBPort|NodeEnv'
  VALIDATION_RESULT=$?
  
  if [ $VALIDATION_RESULT -eq 0 ]; then
    echo "----------------------------------------"
    echo "✅ Validation successful! Template and parameters are valid."
    echo "No resources were deployed."
    echo "----------------------------------------"
    exit 0
  else
    echo "----------------------------------------"
    echo "❌ Validation failed! Check the errors above."
    echo "----------------------------------------"
    exit 1
  fi
else
  # Actual deployment
  sam deploy "${PARAMS[@]}" | grep -v -E 'DBPassword|JwtSecret|DBUser|DBHost|DBName|DBPort|NodeEnv'
  DEPLOYMENT_RESULT=$?

  echo "----------------------------------------"
  if [ $DEPLOYMENT_RESULT -eq 0 ]; then
    echo "✅ Deployment successful!"
  else
    echo "❌ Deployment failed! Check the errors above."
  fi
  echo "----------------------------------------"
  exit $DEPLOYMENT_RESULT
fi