import * as fs from 'fs';
import * as path from 'path';
import * as cf from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import * as extensions from '../../extensions';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'demo-redirect-error-page');

// create the cloudfront distribution with extension(s)
const customErrorPage = new extensions.CustomErrorPage(stack, 'customErrorPage');

// create s3 bucket
const bucket = new s3.Bucket(customErrorPage, 'demoBucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  websiteIndexDocument: 'index.html',
  websiteErrorDocument: 'error.html',
});

// create pages
fs.writeFileSync(path.join(__dirname, 'index.html'), '<h1>Hello CDK!</h1>');
fs.writeFileSync(path.join(__dirname, 'error.html'), '<h1>This is an ERROR.</h1>');
fs.writeFileSync(path.join(__dirname, '404.html'), '<h1>This is a custom 404 error page.</h1>');

// put pages to s3 bucket
new BucketDeployment(customErrorPage, 'Deployment', {
  sources: [Source.asset(path.join(__dirname, './'))],
  destinationBucket: bucket,
  retainOnDelete: false,
});

// cloudFront OriginAccessIdentity for bucket
const originAccessIdentity = new cf.OriginAccessIdentity(customErrorPage, 'OriginAccessIdentity', {
  comment: `CloudFront OriginAccessIdentity for ${bucket.bucketName}`,
});

// cloudfront distribution
const distribution = new cf.CloudFrontWebDistribution(stack, 'distribution', {
  originConfigs: [
    {
      s3OriginSource: {
        originAccessIdentity,
        s3BucketSource: bucket,
      },
      behaviors: [{
        isDefaultBehavior: true,
        defaultTtl: cdk.Duration.seconds(10),
        lambdaFunctionAssociations: [customErrorPage],
      }],
    },
  ],
});

new cdk.CfnOutput(stack, 'distributionDomainName', {
  value: distribution.distributionDomainName,
});
