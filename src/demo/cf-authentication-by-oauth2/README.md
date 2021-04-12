# Highlights

- Using OAuth 2.0 - Authorization Code Grant type to protect private content.
- Using Lambda@Edge Viewer request trigger.
# Getting Started

## Step 1: Setup at your identity provider

Usually you will setup one application or client at your identity provider (IdP). You will need the information for the next step. Make sure you configure it to go via [Authorization Code Grant](https://oauth.net/2/grant-types/authorization-code/) grant type. (We are not using Authorization Code with PKCE in this demo.)

### Example: Auth0

- Application Type: **Regular Web Application**
- Token Endpoint Authentication Method: **None**
- Allowed Callback URLs: **https://abcabcabcabcab.cloudfront.net/callback**
- Allowed Web Origins: **https://abcabcabcabcab.cloudfront.net**
- Get your public key at Advanced Settings --> Certificates tab --> Signing Certificate.

## Step 2: duplicate & edit .env

Please make a copy from `dotenv/cf-authentication-by-oauth2/.env-example` to `dotenv/cf-authentication-by-oauth2/.env`. Place all the parameters and information from your identity provider (IdP).

## Step 3: deployment

Open two terminals. One for yarn watch, and the other for cdk.

On the first terminal:

```sh
yarn install

yarn watch
```

On the second terminal:

```sh
AWS_REGION=us-east-1 cdk --app lib/demo/cf-authentication-by-oauth2/index.js bootstrap

AWS_REGION=us-east-1 cdk --app lib/demo/cf-authentication-by-oauth2/index.js diff

AWS_REGION=us-east-1 cdk --app lib/demo/cf-authentication-by-oauth2/index.js deploy
```

## Step 4: Setup callback URL at your Identity Provider (IdP)

Once you deploy successfully, the CDK script will output a cloudfront URL. Please combine with the callback path you assigned in the `.env` file to configurate callback URL at your IdP application setting.

## Step 5: Login

On deploy completed, open the cloudfront URL with

```
https://<CLOUDFRONT_DOMAIN>
```

You should be redirect to the authroization page of your assigned identity provider. Enter your credentials.

## Step 6: Enjoy the private content

Once you login successfully, you will be redirect to the S3 origin and see this demo page:

```
Hello CloudFront Extension with CDK!!!
You have logged in. Enjoy your private content.
```
