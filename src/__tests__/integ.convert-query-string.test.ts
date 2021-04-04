import '@aws-cdk/assert/jest';
import * as path from 'path';
import { SynthUtils } from '@aws-cdk/assert';
import * as cf from '@aws-cdk/aws-cloudfront';
import { S3Origin } from '@aws-cdk/aws-cloudfront-origins';
import * as s3 from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import * as extensions from '../extensions';

test('minimal usage', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  // WHEN
  // create a cloudfront distribution with an extension (L@E)
  const convertQueryStringDemo = new extensions.ConvertQueryString(stack, 'ConvertQueryStringDemo');

  // create a demo S3 Bucket.
  const bucket = new s3.Bucket(convertQueryStringDemo, 'demoBucket', {
    autoDeleteObjects: true,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    websiteIndexDocument: 'index.html',
    websiteErrorDocument: 'index.html',
  });

  // Put demo Object to Bucket.
  new BucketDeployment(convertQueryStringDemo, 'Deployment', {
    sources: [Source.asset(path.join(__dirname, '.'))],
    destinationBucket: bucket,
    retainOnDelete: false,
  });

  // An S3 origin with its corresponding CloudFront OAI
  const demoOrigin = new S3Origin(bucket, {
    originAccessIdentity: new cf.OriginAccessIdentity(bucket, 'OriginAccessIdentity', {
      comment: `The origin access identity (OAI) for the CloudFront distribution related to ${bucket.bucketName}`,
    }),
  });

  // A CloudFront distribution
  const cloudFrontDistribution = new cf.Distribution(stack, 'CloudFrontWebDistribution', {
    defaultBehavior: {
      origin: demoOrigin,
      edgeLambdas: [convertQueryStringDemo],
      cachePolicy: new cf.CachePolicy(stack, 'DefaultCachePolicy', {
        cachePolicyName: 'ConvertQueryString-Default-Cache-Policy',
        queryStringBehavior: cf.CacheQueryStringBehavior.none(),
      }),
      originRequestPolicy: new cf.OriginRequestPolicy(stack, 'RequestPolicy', {
        originRequestPolicyName: 'ConvertQueryString-Request-Policy',
        queryStringBehavior: cf.OriginRequestQueryStringBehavior.none(),
        headerBehavior: cf.OriginRequestHeaderBehavior.allowList(
          'hakunamatata',
        ),
        comment: 'just for demonstration.',
      }),
    },
    comment: `The CloudFront distribution for ${bucket.bucketName}`,
    priceClass: cf.PriceClass.PRICE_CLASS_200,
  });
  new cdk.CfnOutput(stack, 'DistributionDomainName', {
    value: cloudFrontDistribution.distributionDomainName,
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
              Ref: 'ConvertQueryStringCurrentVersion10CD740B1117fb8e65bbb4e59b197dd41484776e',
            },
          },
        ],
        ViewerProtocolPolicy: 'allow-all',
      },
    },
  });
});
