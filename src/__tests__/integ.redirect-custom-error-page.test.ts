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
  const redirectCustomErrorPage = new extensions.RedirectCustomErrorPage(stack, 'RedirectCustomErrorPage');

  // create s3 bucket
  const bucket = new s3.Bucket(redirectCustomErrorPage, 'demoBucket', {
    autoDeleteObjects: true,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    websiteIndexDocument: 'index.html',
    websiteErrorDocument: 'error.html',
  });

  // Put demo Object to Bucket.
  new BucketDeployment(redirectCustomErrorPage, 'Deployment', {
    sources: [Source.asset(path.join(__dirname, './'))],
    destinationBucket: bucket,
    retainOnDelete: false,
  });

  // cloudFront OriginAccessIdentity for bucket
  const originAccessIdentity = new cf.OriginAccessIdentity(redirectCustomErrorPage, 'OriginAccessIdentity', {
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
          lambdaFunctionAssociations: [redirectCustomErrorPage],
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
                'RedirectCustomErrorPageNestedStackRedirectCustomErrorPageNestedStackResource03C997D1',
                'Outputs.demostackRedirectCustomErrorPageCustomFuncCurrentVersion7F055A6BRef',
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
