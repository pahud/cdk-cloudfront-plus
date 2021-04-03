import * as cf from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as cdk from '@aws-cdk/core';
import * as extensions from '../../extensions';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'demo-stack');

// create the cloudfront distribution with extension(s)
const ext = new extensions.ModifyResponseHeader(stack, 'ModifyResp');

// create the cloudfront distribution with extension(s)
const dist = new cf.Distribution(stack, 'dist', {
  defaultBehavior: {
    origin: new origins.HttpOrigin('aws.amazon.com'),
    edgeLambdas: [ext],
  },
});

new cdk.CfnOutput(stack, 'distributionDomainName', {
  value: dist.distributionDomainName,
});
