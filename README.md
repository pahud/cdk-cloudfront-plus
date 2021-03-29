[![NPM version](https://badge.fury.io/js/cdk-cloudfront-plus.svg)](https://badge.fury.io/js/cdk-cloudfront-plus)
[![PyPI version](https://badge.fury.io/py/cdk-cloudfront-plus.svg)](https://badge.fury.io/py/cdk-cloudfront-plus)
![Release](https://github.com/pahud/cdk-cloudfront-plus/workflows/Release/badge.svg?branch=main)

# cdk-cloudfront-plus

CDK constructs library that allows you to build [AWS CloudFront Extensions](https://github.com/awslabs/aws-cloudfront-extensions) in **JavaScript**, **TypeScript** or **Python**.


# Sample


```ts
import * as cfplus from 'cdk-cloudfront-plus';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'demo-stack');

// prepare the `modify resonse header` extension
const modifyRespHeader = new extensions.ModifyResponseHeader(stack, 'ModifyResp');

// prepare the `anti-hotlinking` extension
const antiHotlinking = new extensions.AntiHotlinking(stack, 'AntiHotlink', {
  referer: [
    'example.com',
    'exa?ple.*',
  ],
});

// create the cloudfront distribution with extension(s)
new Distribution(stack, 'dist', {
  defaultBehavior: {
    origin: new origins.HttpOrigin('aws.amazon.com'),
    edgeLambdas: [
      modifyRespHeader,
      antiHotlinking,
    ],
  },
});

```


# Available Extensions in AWS CDK


| Extension Name | Category   | Solution ID   | Function/Folder Name   | Status |
| -------------- | ---------- | ------------- | --------------------------------------- | ---|
| [Access Origin by geolocation](https://github.com/pahud/cdk-cloudfront-plus/issues/11) | Origin Selection    | SOL8118 | cf-access-origin-by-geolocation        | WIP |
| [Convert Query String](https://github.com/pahud/cdk-cloudfront-plus/issues/23) |  Override Request   | SOL8113 | cf-convert-query-string        | WIP |
| [OAuth2 Authentication](https://github.com/pahud/cdk-cloudfront-plus/issues/17) |  Authentication   | SOL8131 | cfn-authentication-by-oauth2        | WIP |
| [Cognito Redirect](https://github.com/pahud/cdk-cloudfront-plus/issues/16) |  Authentication   | SOL8132 | cf-authentication-by-cognito-redirect        | WIP |
| [Custom Log to Kinesis Firehose](https://github.com/pahud/cdk-cloudfront-plus/issues/14) |  Logging   | SOL8133 | cf-global-data-ingestion        | WIP |
| [HTTP 302 from Origin](https://github.com/pahud/cdk-cloudfront-plus/issues/12) |  URL Redirect   | SOL8103 | cf-http302-from-origin     | WIP |
| [Default Directory Index for Amazon S3 Origin](https://github.com/pahud/cdk-cloudfront-plus/issues/9) |  URL Redirect   | SOL8134 | cf-default-dir-index     | Completed |
| Modify Response Header |  Header Rewrite   | SO8105 | [modify-response-header](https://github.com/awslabs/aws-cloudfront-extensions/tree/main/edge/nodejs/modify-response-header)     | Completed |
| Anti Hotlinking |  Security   | SO8126 | [anti-hotlinking](https://github.com/awslabs/aws-cloudfront-extensions/tree/main/edge/nodejs/anti-hotlinking)     | Completed |
| Add Security Headers |  Security   | SO8102 | [add-security-headers](https://github.com/awslabs/aws-cloudfront-extensions/tree/main/edge/nodejs/add-security-headers)     | Completed |
