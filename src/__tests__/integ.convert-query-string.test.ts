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
  const convertQueryStringProsp: extensions.ConvertQueryStringProps = { key1: 'name', key2: 'language' };
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

  // An S3 origin with its corresponding CloudFront OAI
  const demoOrigin = new S3Origin(bucket, {
    originAccessIdentity: new cf.OriginAccessIdentity(bucket, 'OriginAccessIdentity', {
      comment: `The origin access identity (OAI) for the CloudFront distribution related to ${bucket.bucketName}`,
    }),
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
        LambdaFunctionAssociations: [
          {
            EventType: 'origin-request',
            LambdaFunctionARN: {
              Ref: 'ConvertQueryStringFuncCurrentVersion4FB275862710d92882adce4553e969ea3da56431',
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
