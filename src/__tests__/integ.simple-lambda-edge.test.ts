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
  const simple = new extensions.SimpleLambdaEdge(stack, 'SimpleLambdaEdge');

  // create the cloudfront distribution with extension(s)
  const dist = new cf.Distribution(stack, 'dist', {
    defaultBehavior: {
      origin: new origins.HttpOrigin('aws.amazon.com'),
      edgeLambdas: [simple],
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
            EventType: 'viewer-request',
            LambdaFunctionARN: {
              Ref: 'SimpleLambdaEdgeFuncCurrentVersionC9DD846A1cfb90e3686bafc953ec65944f2ca7b8',
            },
          },
        ],
        ViewerProtocolPolicy: 'allow-all',
      },
    },
  });
});
