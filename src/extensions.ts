import * as path from 'path';
import * as cf from '@aws-cdk/aws-cloudfront';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import * as cdk from '@aws-cdk/core';
import { ServerlessApp } from './';
import { Custom } from './custom';

/**
 * The directory for all extensions lambda assets
 */
const EXTENSION_ASSETS_PATH = path.join(__dirname, '../lambda-assets/extensions');

/**
 * The Extension interface
 */
export interface IExtensions {
  /**
   * Lambda function ARN for this extension
   */
  readonly functionArn: string;
  /**
   * Lambda function version for the function
   */
  readonly functionVersion: lambda.Version;
  /**
   * The Lambda edge event type for this extension
   */
  readonly eventType: cf.LambdaEdgeEventType;
  /**
   * Allows a Lambda function to have read access to the body content.
   *
   * @default false
   */
  readonly includeBody?: boolean;
};

/**
 * The modify response header extension
 * @see https://github.com/awslabs/aws-cloudfront-extensions/tree/main/edge/nodejs/modify-response-header
 * @see https://console.aws.amazon.com/lambda/home#/create/app?applicationId=arn:aws:serverlessrepo:us-east-1:418289889111:applications/modify-response-header
 */
export class ModifyResponseHeader extends ServerlessApp implements IExtensions {
  readonly functionArn: string;
  readonly functionVersion: lambda.Version;
  readonly eventType: cf.LambdaEdgeEventType;
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id, {
      applicationId: 'arn:aws:serverlessrepo:us-east-1:418289889111:applications/modify-response-header',
      semanticVersion: '1.0.0',
    });
    const stack = cdk.Stack.of(scope);
    this.functionArn = this.resource.getAtt('Outputs.ModifyResponseHeaderFunctionARN').toString();
    this.functionVersion = bumpFunctionVersion(stack, id, this.functionArn);
    this.eventType = cf.LambdaEdgeEventType.ORIGIN_RESPONSE;
  }
}

/**
 * The HTTP[302] from origin extension
 * @see https://github.com/awslabs/aws-cloudfront-extensions/tree/main/edge/nodejs/http302-from-origin
 * @see https://console.aws.amazon.com/lambda/home#/create/app?applicationId=arn:aws:serverlessrepo:us-east-1:418289889111:applications/http302-from-origin
 */
// export class HTTP302FromOrigin extends ServerlessApp implements IExtensions {
//   readonly functionArn: string;
//   readonly functionVersion: lambda.Version;
//   readonly eventType: cf.LambdaEdgeEventType;
//   readonly lambdaFunction: lambda.Version;
//   constructor(scope: cdk.Construct, id: string) {
//     super(scope, id, {
//       applicationId: 'arn:aws:serverlessrepo:us-east-1:418289889111:applications/http302-from-origin',
//       semanticVersion: '1.0.2',
//     });
//     const stack = cdk.Stack.of(scope);
//     this.functionArn = this.resource.getAtt('Outputs.Http302Function').toString();
//     this.functionVersion = bumpFunctionVersion(stack, id, this.functionArn);
//     this.lambdaFunction = this.functionVersion;
//     this.eventType = cf.LambdaEdgeEventType.ORIGIN_RESPONSE;
//   }
// };
export class HTTP302FromOrigin extends Custom {
  readonly lambdaFunction: lambda.Version;
  constructor(scope: cdk.Construct, id: string) {
    const func = new NodejsFunction(scope, 'HTTP302FromOriginFunc', {
      entry: `${EXTENSION_ASSETS_PATH}/cf-http302-from-origin/index.ts`,
      // L@E does not support NODE14 so use NODE12 instead.
      runtime: lambda.Runtime.NODEJS_12_X,
    });
    super(scope, id, {
      func,
      eventType: cf.LambdaEdgeEventType.ORIGIN_RESPONSE,
      solutionId: 'SO8103',
      templateDescription: 'Cloudfront extension with AWS CDK - HTTP 302 from Origin',
    });
    this.lambdaFunction = this.functionVersion;
  }
};

/**
 * Construct properties for AntiHotlinking
 */
export interface AntiHotlinkingProps {
  /**
   * Referer allow list with wildcard(* and ?) support i.e. `example.com` or `exa?ple.*`
   */
  readonly referer: string[];
}

/**
 * The Anti-Hotlinking extension
 * @see https://github.com/awslabs/aws-cloudfront-extensions/tree/main/edge/nodejs/anti-hotlinking
 * @see https://console.aws.amazon.com/lambda/home#/create/app?applicationId=arn:aws:serverlessrepo:us-east-1:418289889111:applications/anti-hotlinking
 */
export class AntiHotlinking extends ServerlessApp implements IExtensions {
  readonly functionArn: string;
  readonly functionVersion: lambda.Version;
  readonly eventType: cf.LambdaEdgeEventType;
  constructor(scope: cdk.Construct, id: string, props: AntiHotlinkingProps) {
    super(scope, id, {
      applicationId: 'arn:aws:serverlessrepo:us-east-1:418289889111:applications/anti-hotlinking',
      semanticVersion: '1.2.5',
      parameters: {
        RefererList: props.referer.join(','),
      },
    });
    const stack = cdk.Stack.of(scope);
    this.functionArn = this.resource.getAtt('Outputs.AntiHotlinking').toString();
    this.functionVersion = bumpFunctionVersion(stack, id, this.functionArn);
    this.eventType = cf.LambdaEdgeEventType.VIEWER_REQUEST;
  }
}

/**
 * Security Headers extension
 * @see https://console.aws.amazon.com/lambda/home?region=us-east-1#/create/app?applicationId=arn:aws:serverlessrepo:us-east-1:418289889111:applications/add-security-headers
 * @see https://aws.amazon.com/tw/blogs/networking-and-content-delivery/adding-http-security-headers-using-lambdaedge-and-amazon-cloudfront/
 */
export class SecurtyHeaders extends ServerlessApp implements IExtensions {
  readonly functionArn: string;
  readonly functionVersion: lambda.Version;
  readonly eventType: cf.LambdaEdgeEventType;
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id, {
      applicationId: 'arn:aws:serverlessrepo:us-east-1:418289889111:applications/add-security-headers',
      semanticVersion: '1.0.0',
    });
    const stack = cdk.Stack.of(scope);
    this.functionArn = this.resource.getAtt('Outputs.AddSecurityHeaderFunction').toString();
    this.functionVersion = bumpFunctionVersion(stack, id, this.functionArn);
    this.eventType = cf.LambdaEdgeEventType.ORIGIN_RESPONSE;
  }
}

/**
 * Construct properties for MultipleOriginIpRetry
 */
export interface MultipleOriginIpRetryProps {
  /**
   * Origin IP list for retry, use semicolon to separate multiple IP addresses
   */
  readonly originIp: string[];

  /**
   * Origin IP list for retry, use semicolon to separate multiple IP addresses
   *
   * @example https or http
   */
  readonly originProtocol: string;
}

/**
 * Multiple Origin IP Retry extension
 * @see https://ap-northeast-1.console.aws.amazon.com/lambda/home#/create/app?applicationId=arn:aws:serverlessrepo:us-east-1:418289889111:applications/multiple-origin-IP-retry
 * @see https://github.com/awslabs/aws-cloudfront-extensions/tree/main/edge/nodejs/multiple-origin-IP-retry
 */
export class MultipleOriginIpRetry extends ServerlessApp implements IExtensions {
  readonly functionArn: string;
  readonly functionVersion: lambda.Version;
  readonly eventType: cf.LambdaEdgeEventType;
  constructor(scope: cdk.Construct, id: string, props: MultipleOriginIpRetryProps) {
    super(scope, id, {
      applicationId: 'arn:aws:serverlessrepo:us-east-1:418289889111:applications/multiple-origin-IP-retry',
      semanticVersion: '1.0.1',
      parameters: {
        OriginIPList: props.originIp.join(';'),
        OriginProtocol: props.originProtocol,
      },
    });
    const stack = cdk.Stack.of(scope);
    this.functionArn = this.resource.getAtt('Outputs.MultipleOriginIPRetry').toString();
    this.functionVersion = bumpFunctionVersion(stack, id, this.functionArn);
    this.eventType = cf.LambdaEdgeEventType.ORIGIN_REQUEST;
  }
}

/**
 * Normalize Query String extension
 * @see https://ap-northeast-1.console.aws.amazon.com/lambda/home#/create/app?applicationId=arn:aws:serverlessrepo:us-east-1:418289889111:applications/normalize-query-string
 * @see https://github.com/awslabs/aws-cloudfront-extensions/tree/main/edge/nodejs/normalize-query-string
 */
export class NormalizeQueryString extends ServerlessApp implements IExtensions {
  readonly functionArn: string;
  readonly functionVersion: lambda.Version;
  readonly eventType: cf.LambdaEdgeEventType;
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id, {
      applicationId: 'arn:aws:serverlessrepo:us-east-1:418289889111:applications/normalize-query-string',
      semanticVersion: '1.0.1',
    });
    const stack = cdk.Stack.of(scope);
    this.functionArn = this.resource.getAtt('Outputs.NormalizeQueryStringFunction').toString();
    this.functionVersion = bumpFunctionVersion(stack, id, this.functionArn);
    this.eventType = cf.LambdaEdgeEventType.VIEWER_REQUEST;
  }
}


/**
 * Generate a lambda function version from the given function ARN
 * @param scope
 * @param id
 * @param functionArn The lambda function ARN
 * @returns lambda.Version
 */
function bumpFunctionVersion(scope: cdk.Construct, id: string, functionArn: string): lambda.Version {
  return new lambda.Version(scope, `LambdaVersion${id}`, {
    lambda: lambda.Function.fromFunctionArn(scope, `FuncArn${id}`, functionArn),
  });
}

/**
 * keys options
 */
export interface ConvertQueryStringProps {
  /**
   * The request arguments that will be converted to additional request headers.
   * For example ['key1', 'key2'] will be converted to the header `x-key1` and `x-key2`.
   * Any other request arguments will not be converted.
   *
   */
  readonly args: Array<string>;
}

/**
 * Convert a query string to key-value pairs and add them into header.
 *
 *  @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-examples.html#lambda-examples-header-based-on-query-string
 */
export class ConvertQueryString extends Custom {
  readonly lambdaFunction: lambda.Version;
  constructor(scope: cdk.Construct, id: string, props: ConvertQueryStringProps) {
    const func = new NodejsFunction(scope, 'ConvertQueryStringFunc', {
      entry: `${EXTENSION_ASSETS_PATH}/cf-convert-query-string/index.ts`,
      handler: 'lambdaHandler',
      runtime: lambda.Runtime.NODEJS_12_X,
      bundling: {
        define: {
          NEEDED_KEYS: jsonStringifiedBundlingDefinition(props.args),
        },
      },
    });
    super(scope, id, {
      func,
      eventType: cf.LambdaEdgeEventType.ORIGIN_REQUEST,
      solutionId: 'SO8113',
      templateDescription: 'Cloudfront extension with AWS CDK - Convert Query String.',
    });
    this.lambdaFunction = this.functionVersion;
  }
}

/**
 * Default Directory Indexes in Amazon S3-backed Amazon CloudFront Origins
 *
 *  use case - see https://aws.amazon.com/tw/blogs/compute/implementing-default-directory-indexes-in-amazon-s3-backed-amazon-cloudfront-origins-using-lambdaedge/
 */
export class DefaultDirIndex extends Custom {
  readonly lambdaFunction: lambda.Version;
  constructor(scope: cdk.Construct, id: string) {
    const func = new NodejsFunction(scope, 'DefaultDirIndexFunc', {
      entry: `${EXTENSION_ASSETS_PATH}/cf-default-dir-index/index.ts`,
      // L@E does not support NODE14 so use NODE12 instead.
      runtime: lambda.Runtime.NODEJS_12_X,
    });
    super(scope, id, {
      func,
      eventType: cf.LambdaEdgeEventType.ORIGIN_REQUEST,
      solutionId: 'SO8134',
      templateDescription: 'Cloudfront extension with AWS CDK - Default Directory Index for Amazon S3 Origin.',
    });
    this.lambdaFunction = this.functionVersion;
  }
};

/**
 * Display customized error pages, or mask 4XX error pages, based on where the error originated
 *
 *  use case - see https://aws.amazon.com/blogs/networking-and-content-delivery/customize-403-error-pages-from-amazon-cloudfront-origin-with-lambdaedge/
 */
export class CustomErrorPage extends Custom {
  readonly lambdaFunction: lambda.Version;
  constructor(scope: cdk.Construct, id: string) {

    super(scope, id, {
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: 'index.handler',
      code: lambda.AssetCode.fromAsset(`${EXTENSION_ASSETS_PATH}/cf-custom-error-page`),
      eventType: cf.LambdaEdgeEventType.ORIGIN_RESPONSE,
      solutionId: 'SO8136',
      templateDescription: 'Cloudfront extension with AWS CDK - Custom Error Page',
    });
    this.lambdaFunction = this.functionVersion;
  }
};

export interface AccessOriginByGeolocationProps {
  /**
   * The pre-defined country code table.
   * Exampe: { 'US': 'amazon.com' }
   */
  readonly countryTable: { [code: string]: string };
}

/**
 * (SO8118)Access Origin by Geolocation
 */
export class AccessOriginByGeolocation extends Custom {
  constructor(scope: cdk.Construct, id: string, props: AccessOriginByGeolocationProps) {
    const func = new NodejsFunction(scope, 'AccessOriginByGeolocationFunc', {
      entry: `${EXTENSION_ASSETS_PATH}/cf-access-origin-by-geolocation/index.ts`,
      // L@E does not support NODE14 so use NODE12 instead.
      runtime: lambda.Runtime.NODEJS_12_X,
      bundling: {
        define: {
          'process.env.COUNTRY_CODE_TABLE': jsonStringifiedBundlingDefinition(props.countryTable),
        },
      },
    });
    super(scope, id, {
      func,
      eventType: cf.LambdaEdgeEventType.ORIGIN_REQUEST,
      solutionId: 'S08118',
      templateDescription: 'Cloudfront extension with AWS CDK - Access Origin by Geolocation',
    });
  }
};

export interface RedirectByGeolocationProps {
  /**
   * The pre-defined country code table.
   * Exampe: { 'US': 'amazon.com' }
   */
  readonly countryTable: { [code: string]: string };
}

/**
 * Forward request to the nearest PoP as per geolocation.
 */
export class RedirectByGeolocation extends Custom {
  constructor(scope: cdk.Construct, id: string, props: RedirectByGeolocationProps) {
    const func = new NodejsFunction(scope, 'RedirectByGeolocationFunc', {
      entry: `${EXTENSION_ASSETS_PATH}/cf-redirect-by-geolocation/index.ts`,
      // L@E does not support NODE14 so use NODE12 instead.
      runtime: lambda.Runtime.NODEJS_12_X,
      bundling: {
        define: {
          'process.env.COUNTRY_CODE_TABLE': jsonStringifiedBundlingDefinition(props.countryTable),
        },
      },
    });
    super(scope, id, {
      func,
      eventType: cf.LambdaEdgeEventType.ORIGIN_REQUEST,
      solutionId: 'SO8135',
      templateDescription: 'Cloudfront extension with AWS CDK - Redirect by Geolocation',
    });
  }
}

/**
 * Simple content generation
 * @see https://github.com/awslabs/aws-cloudfront-extensions/tree/main/edge/nodejs/simple-lambda-edge
 */
export class SimpleLambdaEdge extends Custom {
  constructor(scope: cdk.Construct, id: string) {
    const func = new NodejsFunction(scope, 'SimpleLambdaEdgeFunc', {
      entry: `${EXTENSION_ASSETS_PATH}/simple-lambda-edge/index.ts`,
      // L@E does not support NODE14 so use NODE12 instead.
      runtime: lambda.Runtime.NODEJS_12_X,
    });
    super(scope, id, {
      func,
      eventType: cf.LambdaEdgeEventType.VIEWER_REQUEST,
      solutionId: '',
      templateDescription: 'Cloudfront extension with AWS CDK - Simple Lambda Edge.',
    });
  }
};

export interface OAuth2AuthorizationCodeGrantProps {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly clientDomain: string;
  readonly clientPublicKey: string;
  readonly callbackPath: string;
  readonly jwtArgorithm: string;
  readonly authorizeUrl: string;
  readonly authorizeParams: string;
  readonly debugEnable: boolean;
}

/**
 * OAuth2 Authentication - Authorization Code Grant
 */
export class OAuth2AuthorizationCodeGrant extends Custom {
  readonly lambdaFunction: lambda.Version;
  constructor(scope: cdk.Construct, id: string, props: OAuth2AuthorizationCodeGrantProps) {
    const func = new NodejsFunction(scope, 'OAuth2AuthorizationCodeGrantFunc', {
      entry: `${EXTENSION_ASSETS_PATH}/cf-authentication-by-oauth2/index.ts`,
      // L@E does not support NODE14 so use NODE12 instead.
      runtime: lambda.Runtime.NODEJS_12_X,
      bundling: {
        define: {
          'process.env.CLIENT_ID': jsonStringifiedBundlingDefinition(props.clientId),
          'process.env.CLIENT_SECRET': jsonStringifiedBundlingDefinition(props.clientSecret),
          'process.env.CLIENT_DOMAIN': jsonStringifiedBundlingDefinition(props.clientDomain),
          'process.env.CLIENT_PUBLIC_KEY': jsonStringifiedBundlingDefinition(props.clientPublicKey),
          'process.env.CALLBACK_PATH': jsonStringifiedBundlingDefinition(props.callbackPath),
          'process.env.JWT_ARGORITHM': jsonStringifiedBundlingDefinition(props.jwtArgorithm),
          'process.env.AUTHORIZE_URL': jsonStringifiedBundlingDefinition(props.authorizeUrl),
          'process.env.AUTHORIZE_PARAMS': jsonStringifiedBundlingDefinition(props.authorizeParams),
          'process.env.DEBUG_ENABLE': jsonStringifiedBundlingDefinition(props.debugEnable),
        },
      },
    });
    super(scope, id, {
      func,
      eventType: cf.LambdaEdgeEventType.VIEWER_REQUEST,
      solutionId: 'SO8131',
      templateDescription: 'Cloudfront extension with AWS CDK - OAuth2 Authentication - Authorization Code Grant.',
    });
    this.lambdaFunction = this.functionVersion;
  }
};


export interface GlobalDataIngestionProps {
  /**
   * Kinesis Firehose DeliveryStreamName
   */
  readonly firehoseStreamName: string;
};

/**
 * Ingest data to Kinesis Firehose by nearest cloudfront edge
 * @see https://aws.amazon.com/blogs/networking-and-content-delivery/global-data-ingestion-with-amazon-cloudfront-and-lambdaedge/
 */
export class GlobalDataIngestion extends Custom {
  readonly lambdaFunction: lambda.Version;

  constructor(scope: cdk.Construct, id: string, props: GlobalDataIngestionProps) {
    const func = new NodejsFunction(scope, 'GlobalDataIngestionFunc', {
      entry: `${EXTENSION_ASSETS_PATH}/cf-global-data-ingestion/index.ts`,
      // L@E does not support NODE14 so use NODE12 instead.
      runtime: lambda.Runtime.NODEJS_12_X,
      bundling: {
        define: {
          'process.env.DELIVERY_STREAM_NAME': jsonStringifiedBundlingDefinition(props.firehoseStreamName),
        },
      },
    });
    func.role?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonKinesisFirehoseFullAccess'));

    super(scope, id, {
      func,
      eventType: cf.LambdaEdgeEventType.VIEWER_REQUEST,
      includeBody: true,
      solutionId: 'SO8133',
      templateDescription: 'Cloudfront extension with AWS CDK - Global Data Ingestion',
    });

    this.lambdaFunction = this.functionVersion;
  }
}

function jsonStringifiedBundlingDefinition(value: any): string {
  return JSON.stringify(value)
    .replace(/"/g, '\\"')
    .replace(/,/g, '\\,');
}
