import * as fs from 'fs';
import * as path from 'path';
import * as cf from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import * as extensions from '../../extensions';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'default-dir-index-demo');

// create the cloudfront distribution with extension(s)
const defaultDirIndex = new extensions.DefaultDirIndex(stack, 'DefaultDirIndexDemo');

// create Demo S3 Bucket.
const bucket = new s3.Bucket(defaultDirIndex, 'demoBucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  websiteIndexDocument: 'index.html',
  websiteErrorDocument: 'index.html',
});

// create index.html in the demo folder

fs.mkdirSync(path.join(__dirname, 'a/b/c'), {
  recursive: true,
});
fs.writeFileSync(path.join(__dirname, 'a/b/c/index.html'), '<h1>Hello CDK!</h1>');
fs.writeFileSync(path.join(__dirname, 'index.html'), '<h1>Hello CDK!!! From root directory </h1>');
// Put demo Object to Bucket.
new BucketDeployment(defaultDirIndex, 'Deployment', {
  sources: [Source.asset(path.join(__dirname, './'))],
  destinationBucket: bucket,
  retainOnDelete: false,
});

// CloudFront OriginAccessIdentity for Bucket
const originAccessIdentity = new cf.OriginAccessIdentity(defaultDirIndex, 'OriginAccessIdentity', {
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
        lambdaFunctionAssociations: [defaultDirIndex],
      }],
    },
  ],
});
new cdk.CfnOutput(stack, 'distributionDomainName', {
  value: cloudfrontWebDistribution.distributionDomainName,
});
