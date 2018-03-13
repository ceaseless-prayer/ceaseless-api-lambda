ceaseless-api-lambda
====================

NodeJS Lambda function for retrieving Bible scripture in a supported language.

## Setup
To get this working in your local development environment, run ```npm run setup```

This will generate a .env and a deploy.env file
Fill in the details in both. Then run ```npm run deploy``` to deploy the lambda to your AWS account.

Note that in order to use the API, you need to configure API Gateway.
Currently, this is a manual step. Setup a new Resource for each of the paths of this API. Add an Any method and link it to your lambda. Check off the lambda proxy checkbox. Deploy your API. Now you should be able to call the api and get a response with the URL generated for you.

To support a custom domain, you need to follow the AWS instructions because it will setup a CloudFront distribution for your API.  

## Usage

TODO

## Request Params

TODO

## Response

TODO
