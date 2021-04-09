import * as cf from '@aws-cdk/aws-cloudfront';
import { HttpOrigin } from '@aws-cdk/aws-cloudfront-origins';
import * as cdk from '@aws-cdk/core';
import * as extensions from '../../extensions';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'convert-query-string-demo', {
  env: { account: cdk.Aws.ACCOUNT_ID, region: 'us-east-1' },
});

/**
 * create an extension (L@E)
 * keys defined in a whitelist, or `ConvertQueryStringProps`, will become
 * custom headers with 'x-' prefixed.
 */
const convertQueryStringProsp: extensions.ConvertQueryStringProps = { args: ['language', 'name'] };
const convertQueryString = new extensions.ConvertQueryString(stack, 'LambdaEdge', convertQueryStringProsp);

/*
 * If you deploy this demonstration in another region other than us-east-1, your
 * closest edge location might not be what you expect. Change the price class
 * accordingly based on your anticipation.
 *
 */
// A CloudFront distribution with the L@E
const cloudFrontDistribution = new cf.Distribution(stack, 'CloudFrontDistribution', {
  defaultBehavior: {
    origin: new HttpOrigin('postman-echo.com', {
      httpPort: 80,
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

new cdk.CfnOutput(stack, 'CopyRightValueAndPasteToBrowser', {
  value: `${cloudFrontDistribution.distributionDomainName}/get?language=english&name=viola&mood=hakunamatata`,
});
