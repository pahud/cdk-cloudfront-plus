import * as path from 'path';
import { SynthUtils } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as cf from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import * as extensions from '../extensions';

test('minimal usage', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  // WHEN
  // create the cloudfront distribution with extension(s)
  const rewriteUriDemo = new extensions.DefaultDirIndex(stack, 'DefaultDirIndexDemo');

  // create Demo S3 Bucket.
  const bucket = new s3.Bucket(rewriteUriDemo, 'demoBucket', {
    autoDeleteObjects: true,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    websiteIndexDocument: 'index.html',
    websiteErrorDocument: 'index.html',
  });

  // Put demo Object to Bucket.
  new BucketDeployment(rewriteUriDemo, 'Deployment', {
    sources: [Source.asset(path.join(__dirname, '.'))],
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

  // THEN
  expect(SynthUtils.synthesize(stack).template).toMatchSnapshot();

  expect(stack).toHaveResourceLike('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      DefaultCacheBehavior: {
        LambdaFunctionAssociations: [
          {
            EventType: 'origin-request',
            LambdaFunctionARN: {
              'Fn::GetAtt': [
                'DefaultDirIndexDemoNestedStackDefaultDirIndexDemoNestedStackResource55AA5BD2',
                'Outputs.demostackDefaultDirIndexDemoFuncVerDefaultDirIndexDemo2C78B9F8Ref',
              ],
            },
          },
        ],
        ViewerProtocolPolicy: 'redirect-to-https',
      },
      DefaultRootObject: 'index.html',
    },
  });
});
