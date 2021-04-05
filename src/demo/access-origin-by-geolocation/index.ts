import * as cf from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as cdk from '@aws-cdk/core';
import * as extensions from '../../extensions';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'demo-stack');

// create the cloudfront distribution with extension(s)
const ext = new extensions.AccessOriginByGeolocation(stack, 'AccessOriginByGeolocation', {
  countryTable: {
    CN: 'amazonaws.cn',
    US: 'twitter.com',
    TW: 'google.com',
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
