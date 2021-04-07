import * as cf from '@aws-cdk/aws-cloudfront';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
// import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cdk from '@aws-cdk/core';
import * as extensions from '../../extensions';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'http302-demo');

// create the cloudfront distribution with extension(s)
const http302FromOrigin = new extensions.HTTP302FromOrigin(stack, 'http302');

const demoAlbService = new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'DemoAlbService', {
  taskImageOptions: { image: ecs.ContainerImage.fromRegistry('mendhak/http-https-echo:14') },
  publicLoadBalancer: true,
});

// demoAlbService.listener.addRedirectResponse('302RedirectRule', {
//   statusCode: 'HTTP_302',
//   conditions: [
//     elbv2.ListenerCondition.pathPatterns(['/ok']),
//   ],
//   path: '/',
// });

// Cloudfront
const demoCloudFront = new cf.CloudFrontWebDistribution(stack, 'DemoCloudFront', {
  viewerProtocolPolicy: cf.ViewerProtocolPolicy.ALLOW_ALL,
  originConfigs: [
    {
      customOriginSource: {
        originProtocolPolicy: cf.OriginProtocolPolicy.HTTP_ONLY,
        domainName: demoAlbService.loadBalancer.loadBalancerDnsName,
      },
      behaviors: [{
        isDefaultBehavior: true,
        lambdaFunctionAssociations: [http302FromOrigin],
      }],
    },
  ],
});

// Cloudfront without lambda function
const demoCloudFrontWithoutLambda = new cf.CloudFrontWebDistribution(stack, 'DemoCloudFrontWithoutLambda', {
  viewerProtocolPolicy: cf.ViewerProtocolPolicy.ALLOW_ALL,
  originConfigs: [
    {
      customOriginSource: {
        originProtocolPolicy: cf.OriginProtocolPolicy.HTTP_ONLY,
        domainName: demoAlbService.loadBalancer.loadBalancerDnsName,
      },
      behaviors: [{
        isDefaultBehavior: true,
      }],
    },
  ],
});

new cdk.CfnOutput(stack, 'demoDomainName', {
  value: 'http://' + demoCloudFront.distributionDomainName,
});
new cdk.CfnOutput(stack, 'demoDomainNameWithoutLambda', {
  value: 'http://' + demoCloudFrontWithoutLambda.distributionDomainName,
});
