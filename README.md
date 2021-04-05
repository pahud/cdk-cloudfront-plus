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
| [Access Origin by geolocation](https://github.com/pahud/cdk-cloudfront-plus/issues/41) | Origin Selection    | SO8118 | cf-access-origin-by-geolocation        | Completed |
| [Redirect by geolocation](https://github.com/pahud/cdk-cloudfront-plus/issues/11) | Origin Selection    | SO8135 | cf-redirect-by-geolocation        | Completed |
| [Convert Query String](https://github.com/pahud/cdk-cloudfront-plus/issues/23) |  Override Request   | SO8113 | cf-convert-query-string        | WIP(ScottHsieh) |
| [OAuth2 Authentication](https://github.com/pahud/cdk-cloudfront-plus/issues/17) |  Authentication   | SO8131 | cf-authentication-by-oauth2        | WIP(Ernest) |
| [Cognito Redirect](https://github.com/pahud/cdk-cloudfront-plus/issues/16) |  Authentication   | SO8132 | cf-authentication-by-cognito-redirect        | WIP(BabooPan) |
| [Custom Log to Kinesis Firehose](https://github.com/pahud/cdk-cloudfront-plus/issues/14) |  Logging   | SO8133 | cf-global-data-ingestion        | WIP(Titan) |
| [HTTP 302 from Origin](https://github.com/pahud/cdk-cloudfront-plus/issues/12) |  URL Redirect   | SO8103 | cf-http302-from-origin     | WIP(Rico) |
| [Default Directory Index for Amazon S3 Origin](https://github.com/pahud/cdk-cloudfront-plus/issues/9) |  URL Redirect   | SO8134 | cf-default-dir-index     | Completed |
| [Modify Response Header](https://github.com/awslabs/aws-cloudfront-extensions/tree/main/edge/nodejs/modify-response-header) |  Header Rewrite   | SO8105 | cf-modify-response-header     | Completed |
| [Custom Error Page](https://github.com/pahud/cdk-cloudfront-plus/pull/46)|  Header Rewrite   | SO8136 | cf-custom-error-page  | Completed |
| [Anti Hotlinking](https://github.com/awslabs/aws-cloudfront-extensions/tree/main/edge/nodejs/anti-hotlinking) |  Security   | SO8126 | cf-anti-hotlinking     | Completed |
| [Add Security Headers](https://github.com/awslabs/aws-cloudfront-extensions/tree/main/edge/nodejs/add-security-headers) |  Security   | SO8102 | cf-add-security-headers     | Completed |
