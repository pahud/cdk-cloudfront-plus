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
  const convertQueryStringProsp: extensions.ConvertQueryStringProps = { args: ['language', 'name'] };
  const convertQueryString = new extensions.ConvertQueryString(stack, 'ConvertQueryStringDemo', convertQueryStringProsp);

  // create a demo S3 Bucket.
  const bucket = new s3.Bucket(convertQueryString, 'DemoBucket', {
    autoDeleteObjects: true,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    websiteIndexDocument: 'index.html',
    publicReadAccess: true,
  });

  // Put demo Object to Bucket.
  new BucketDeployment(convertQueryString, 'Deployment', {
    sources: [Source.asset(path.join(__dirname, './'))],
    destinationBucket: bucket,
    retainOnDelete: false,
  });

  // A CloudFront distribution
  const cloudFrontDistribution = new cf.Distribution(stack, 'CloudFrontDistribution', {
    defaultBehavior: {
      origin: new S3Origin(bucket),
      edgeLambdas: [convertQueryString],
      cachePolicy: new cf.CachePolicy(stack, 'DefaultCachePolicy', {
        cachePolicyName: 'ConvertQueryString-Cache-Policy',
        queryStringBehavior: cf.CacheQueryStringBehavior.all(),
      }),
      originRequestPolicy: new cf.OriginRequestPolicy(stack, 'RequestPolicy', {
        originRequestPolicyName: 'ConvertQueryString-Request-Policy',
        queryStringBehavior: cf.OriginRequestQueryStringBehavior.all(),
        comment: 'just for demonstration.',
      }),
    },
    comment: `The CloudFront distribution based on ${bucket.bucketName}`,
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
        Compress: true,
        LambdaFunctionAssociations: [
          {
            EventType: 'origin-request',
            LambdaFunctionARN: {
              Ref: 'ConvertQueryStringFuncCurrentVersion4FB275867e7e9c25e3c53d8bd214f3234ead7f9b',
            },
          },
        ],
        ViewerProtocolPolicy: 'allow-all',
      },
      Origins: [
        {
          CustomOriginConfig: {
            OriginProtocolPolicy: 'http-only',
            OriginSSLProtocols: [
              'TLSv1.2',
            ],
          },
        },
      ],
      PriceClass: 'PriceClass_200',
    },
  },
  );
});
