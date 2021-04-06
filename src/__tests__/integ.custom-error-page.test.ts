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
  const customErrorPage = new extensions.CustomErrorPage(stack, 'CustomErrorPage');

  // create s3 bucket
  const bucket = new s3.Bucket(customErrorPage, 'demoBucket', {
    autoDeleteObjects: true,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    websiteIndexDocument: 'index.html',
    websiteErrorDocument: 'error.html',
  });

  // Put demo Object to Bucket.
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

  // THEN
  expect(SynthUtils.synthesize(stack).template).toMatchSnapshot();

  expect(stack).toHaveResourceLike('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      DefaultCacheBehavior: {
        AllowedMethods: [
          'GET',
          'HEAD',
        ],
        CachedMethods: [
          'GET',
          'HEAD',
        ],
        Compress: true,
        DefaultTTL: 10,
        ForwardedValues: {
          Cookies: {
            Forward: 'none',
          },
          QueryString: false,
        },
        LambdaFunctionAssociations: [
          {
            EventType: 'origin-response',
            LambdaFunctionARN: {
              'Fn::GetAtt': [
                'CustomErrorPageNestedStackCustomErrorPageNestedStackResource5229F8E2',
                'Outputs.demostackCustomErrorPageCustomFuncCurrentVersion4B2B308BRef',
              ],
            },
          },
        ],
        TargetOriginId: 'origin1',
        ViewerProtocolPolicy: 'redirect-to-https',
      },
      DefaultRootObject: 'index.html',
    },
  });
});
