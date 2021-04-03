import * as cf from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as cdk from '@aws-cdk/core';
import * as extensions from '../../extensions';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'redirect-by-geolocation');

// create the cloudfront distribution with extension(s)
const ext = new extensions.RedirectByGeolocation(stack, 'RedirectByGeolocation', {
  countryTable: {
    CN: 'https://amazonaws.cn',
    US: 'https://twitter.com',
  },
});

// CloudfrontWebDistribution
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