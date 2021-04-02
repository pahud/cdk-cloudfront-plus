import * as cf from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as cdk from '@aws-cdk/core';
import * as extensions from '../../extensions';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'http302-demo');

// create the cloudfront distribution with extension(s)
const http302FromOrigin = new extensions.HTTP302FromOrigin(stack, 'http302');

// create the cloudfront distribution with extension(s)
const dist = new cf.Distribution(stack, 'dist', {
  defaultBehavior: {
    origin: new origins.HttpOrigin('aws.amazon.com'),
    edgeLambdas: [http302FromOrigin],
  },
});

new cdk.CfnOutput(stack, 'distributionDomainName', {
  value: dist.distributionDomainName,
});
