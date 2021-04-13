import * as fs from 'fs';
import * as path from 'path';
import * as cf from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import * as dotenv from 'dotenv';
import * as extensions from '../../extensions';

const resultDotEnv = dotenv.config({ path: __dirname + '/../../../dotenv/cf-authentication-by-oauth2/.env' });

if (resultDotEnv.error) {
  throw resultDotEnv.error;
}

const app = new cdk.App();
const stack = new cdk.Stack(app, 'cf-authentication-by-oauth2-demo');

// create the cloudfront distribution with extension(s)
const OAuth2AuthorizationCodeGrant = new extensions.OAuth2AuthorizationCodeGrant(stack, 'OAuth2AuthorizationCodeGrant', {
  clientId: process.env.CLIENT_ID as string,
  clientSecret: process.env.CLIENT_SECRET as string,
  clientDomain: process.env.CLIENT_DOMAIN as string,
  clientPublicKey: new Buffer(process.env.CLIENT_PUBLIC_KEY as string).toString('base64'),
  callbackPath: process.env.CALLBACK_PATH as string,
  jwtArgorithm: process.env.JWT_ARGORITHM as string,
  authorizeUrl: process.env.AUTHORIZE_URL as string,
  authorizeParams: new Buffer(process.env.AUTHORIZE_PARAMS as string).toString('base64'),
  debugEnable: process.env.DEBUG_ENABLE as unknown as boolean,
});

// create Demo S3 Bucket.
const bucket = new s3.Bucket(stack, 'demoBucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  websiteIndexDocument: 'index.html',
  websiteErrorDocument: 'index.html',
});

// create index.html in the demo folder
fs.writeFileSync(path.join(__dirname, 'index.html'), '<h1>Hello CloudFront Extension (OAuth2 Authentication) with CDK!!!</h1><p>You have logged in. Enjoy your private content.</p>');
// Put demo Object to Bucket.
new BucketDeployment(stack, 'BucketDeployment', {
  sources: [Source.asset(path.join(__dirname, './'))],
  destinationBucket: bucket,
  retainOnDelete: false,
});

// CloudFront OriginAccessIdentity for Bucket
const originAccessIdentity = new cf.OriginAccessIdentity(stack, 'OriginAccessIdentity', {
  comment: `CloudFront OriginAccessIdentity for ${bucket.bucketName}`,
});

// CloudfrontWebDistribution
const cloudfrontWebDistribution = new cf.CloudFrontWebDistribution(stack, 'CloudFrontWebDistribution', {
  originConfigs: [
    {
      s3OriginSource: {
        originAccessIdentity,
        s3BucketSource: bucket,
      },
      behaviors: [{
        isDefaultBehavior: true,
        lambdaFunctionAssociations: [OAuth2AuthorizationCodeGrant],
      }],
    },
  ],
  priceClass: cf.PriceClass.PRICE_CLASS_ALL,
});

new cdk.CfnOutput(stack, 'distributionDomainName', {
  value: cloudfrontWebDistribution.distributionDomainName,
});

