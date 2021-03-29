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
const rewriteUriDemo = new extensions.DefaultDirIndex(stack, 'DefaultDirIndexDemo');

// create Demo S3 Bucket.
const bucket = new s3.Bucket(rewriteUriDemo, 'demoBucket', {
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
// Put demo Object to Bucket.
new BucketDeployment(rewriteUriDemo, 'Deployment', {
  sources: [Source.asset(path.join(__dirname, './'))],
  destinationBucket: bucket,
  retainOnDelete: false,
});

// CloudFront OriginAccessIdentity for Bucket
const originAccessIdentity = new cf.OriginAccessIdentity(rewriteUriDemo, 'OriginAccessIdentity', {
  comment: `CloudFront OriginAccessIdentity for ${bucket.bucketName}`,
});

// CloudfrontWebDistribution
const cloudfrontWebDistribution = new cf.CloudFrontWebDistribution(stack, 'CloudFrontWebDistribution', {
  enableIpV6: false,
  originConfigs: [
    {
      s3OriginSource: {
        originAccessIdentity,
        s3BucketSource: bucket,
      },
      behaviors: [{
        isDefaultBehavior: true,
        lambdaFunctionAssociations: [rewriteUriDemo],
      }],
    },
  ],
});
new cdk.CfnOutput(stack, 'distributionDomainName', {
  value: cloudfrontWebDistribution.distributionDomainName,
});
