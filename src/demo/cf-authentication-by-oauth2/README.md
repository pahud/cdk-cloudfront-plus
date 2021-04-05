# Getting Started

## Step 1: Setup at your identity provider

Usually you will setup one application or client at your identity provider. You will need the information for the next step. Make sure you configure it to go via [Authorization Code Grant](https://oauth.net/2/grant-types/authorization-code/) grant type.

## Step 2: duplicate & edit .env

Please make a copy from `.env-example-cf-authentication-by-oauth2` to `.env`. Place all the parameters and information from your identity provider.

## Step 3: deployment

Open two terminals. One for yarn watch, and the other for cdk.

On the first terminal:

```sh
yarn watch
```

On the second terminal:

```sh
AWS_REGION=us-east-1 cdk --app lib/demo/cf-authentication-by-oauth2/index.js bootstrap

AWS_REGION=us-east-1 cdk --app lib/demo/cf-authentication-by-oauth2/index.js diff

AWS_REGION=us-east-1 cdk --app lib/demo/cf-authentication-by-oauth2/index.js deploy
```

## Step 4: Login

On deploy completed, open the cloudfront URL with


```
https://<CLOUDFRONT_DOMAIN>
```

You should be redirect to the authroization page of your assigned identity provider. Enter your credentials.

## Step 5: Enjoy the private content

Once you login successfully, you will be redirect to the S3 origin and see this demo page:

```
Hello CloudFront Extension with CDK!!!
You have logged in. Enjoy your private content.
```
