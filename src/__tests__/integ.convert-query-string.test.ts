import '@aws-cdk/assert/jest';
import { SynthUtils } from '@aws-cdk/assert';
import * as cf from '@aws-cdk/aws-cloudfront';
import { HttpOrigin } from '@aws-cdk/aws-cloudfront-origins';
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

  // A CloudFront distribution
  const cloudFrontDistribution = new cf.Distribution(stack, 'CloudFrontDistribution', {
    defaultBehavior: {
      origin: new HttpOrigin('postman-echo.com', {
        httpPort: 80,
        originPath: '/get',
        originSslProtocols: [cf.OriginSslPolicy.TLS_V1],
        keepaliveTimeout: cdk.Duration.seconds(10),
        protocolPolicy: cf.OriginProtocolPolicy.HTTP_ONLY,
        readTimeout: cdk.Duration.seconds(10),
      }),
      edgeLambdas: [convertQueryString],
      cachePolicy: new cf.CachePolicy(stack, 'DefaultCachePolicy', {
        cachePolicyName: 'ConvertQueryString-Cache-Policy',
        queryStringBehavior: cf.CacheQueryStringBehavior.all(),
      }),
      originRequestPolicy: new cf.OriginRequestPolicy(stack, 'RequestPolicy', {
        originRequestPolicyName: 'ConvertQueryString-Request-Policy',
        queryStringBehavior: cf.OriginRequestQueryStringBehavior.all(),
        headerBehavior: cf.OriginRequestHeaderBehavior.all(),
        comment: 'just for demonstration.',
      }),
    },
    comment: 'The CloudFront distribution based on the custom origin',
    priceClass: cf.PriceClass.PRICE_CLASS_200,
  });
  new cdk.CfnOutput(stack, 'DistributionDomainName', {
    value: cloudFrontDistribution.distributionDomainName,
  });

  // THEN
  expect(SynthUtils.synthesize(stack).template).toMatchSnapshot();

  expect(stack).toHaveResourceLike('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Comment: 'The CloudFront distribution based on the custom origin',
      DefaultCacheBehavior: {
        LambdaFunctionAssociations: [
          {
            EventType: 'origin-request',
            LambdaFunctionARN: {
              Ref: 'ConvertQueryStringFuncCurrentVersion4FB275862a9b84221e5ba9190684389f5c63a7be',
            },
          },
        ],
        ViewerProtocolPolicy: 'allow-all',
      },
      Origins: [
        {
          CustomOriginConfig: {
            HTTPPort: 80,
            OriginKeepaliveTimeout: 10,
            OriginProtocolPolicy: 'http-only',
            OriginReadTimeout: 10,
            OriginSSLProtocols: [
              'TLSv1',
            ],
          },
          DomainName: 'postman-echo.com',
          Id: 'demostackCloudFrontDistributionOrigin15405BC3B',
          OriginPath: '/get',
        },
      ],
      PriceClass: 'PriceClass_200',
    },
  },
  );
});
