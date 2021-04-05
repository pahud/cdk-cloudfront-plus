import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as cdk from '@aws-cdk/core';
import { Distribution } from './';
import * as extensions from './extensions';

export class IntegTesting {
  readonly stack: cdk.Stack[];
  constructor() {
    const app = new cdk.App();

    const stack = new cdk.Stack(app, 'demo-stack');

    // prepare the `modify resonse header` extension
    // const modifyRespHeader = new extensions.ModifyResponseHeader(stack, 'ModifyResp');

    // prepare the `anti-hotlinking` extension
    // const antiHotlinking = new extensions.AntiHotlinking(stack, 'AntiHotlink', {
    //   referer: [
    //     'example.com',
    //     'exa?ple.*',
    //   ],
    // });

    // prepare the security headers extension
    const securityHeaders = new extensions.SecurtyHeaders(stack, 'SecurityHeaders');
    const mulOrgIpRetry = new extensions.MultipleOriginIpRetry(stack, 'MulOrgIpRetry', {
      originIp: ['1.2.3.4'],
      originProtocol: 'https',
    });
    // create the cloudfront distribution with extension(s)
    new Distribution(stack, 'dist', {
      defaultBehavior: {
        origin: new origins.HttpOrigin('aws.amazon.com'),
        edgeLambdas: [
          // modifyRespHeader,
          // viewer request
          //antiHotlinking,
          // origin response
          securityHeaders,
          mulOrgIpRetry,
        ],
      },
    });
    this.stack = [stack];
  }
}


new IntegTesting();
