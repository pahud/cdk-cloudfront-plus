import { SynthUtils } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as cf from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as cdk from '@aws-cdk/core';
import * as extensions from '../extensions';


test('minimal usage', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');

  // WHEN
  // create the cloudfront distribution with extension(s)
  const ext = new extensions.RedirectByGeolocation(stack, 'RedirectByGeolocation', {
    countryTable: {
      US: 'mock-api.com',
      CN: 'mock-api.com.cn',
    },
  });

  const policy = new cf.OriginRequestPolicy(stack, 'OrigReqPolicy', {
    headerBehavior: cf.OriginRequestHeaderBehavior.allowList(
      'cloudfront-viewer-country',
    ),
  });

  // create the cloudfront distribution with extension(s)
  const dist = new cf.Distribution(stack, 'dist', {
    defaultBehavior: {
      origin: new origins.HttpOrigin('aws.amazon.com'),
      edgeLambdas: [ext],
      originRequestPolicy: {
        originRequestPolicyId: policy.originRequestPolicyId,
      },
    },
  });

  new cdk.CfnOutput(stack, 'distributionDomainName', {
    value: dist.distributionDomainName,
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
              Ref: 'RedirectByGeolocationFuncCurrentVersion56E461BD0b5cb75fbfe4bc34cd92d1a72339d39f',
            },
          },
        ],
        ViewerProtocolPolicy: 'allow-all',
      },
    },
  });
});
