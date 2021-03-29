import * as path from 'path';
import * as cf from '@aws-cdk/aws-cloudfront';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { ServerlessApp } from './';

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

export interface CustomProps {
  /**
   * Specify your Lambda function.
   *
   * You can specify your Lamba function
   * It's implement by lambda.Function, ex: NodejsFunction / PythonFunction or CustomFunction
   */
  readonly func?: lambda.Function;
  /**
     * The source code of your Lambda function.
     *
     * You can point to a file in an
     * Amazon Simple Storage Service (Amazon S3) bucket or specify your source
     * code as inline text.
     *
     * @stability stable
     *
     * @default Code.fromAsset(path.join(__dirname, '../lambda/function'))
  */
  readonly code?: lambda.AssetCode;
  /**
     * The runtime environment for the Lambda function that you are uploading.
     *
     * For valid values, see the Runtime property in the AWS Lambda Developer
     * Guide.
     *
     * Use `Runtime.FROM_IMAGE` when when defining a function from a Docker image.
     *
     * @stability stable
     *
     * @default Runtime.PYTHON_3_8
  */
  readonly runtime?: lambda.Runtime;
  /**
     * The name of the method within your code that Lambda calls to execute your function.
     *
     * The format includes the file name. It can also include
     * namespaces and other qualifiers, depending on the runtime.
     * For more information, see https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-features.html#gettingstarted-features-programmingmodel.
     *
     * Use `Handler.FROM_IMAGE` when defining a function from a Docker image.
     *
     * NOTE: If you specify your source code as inline text by specifying the
     * ZipFile property within the Code property, specify index.function_name as
     * the handler.
     *
     * @stability stable
     *
     * @default index.lambda_handler
  */
  readonly handler?: string;
  /**
     * The function execution time (in seconds) after which Lambda terminates the function.
     *
     * Because the execution time affects cost, set this value
     * based on the function's expected execution time.
     *
     * @default Duration.seconds(5)
     * @stability stable
  */
  readonly timeout?: cdk.Duration;
  /**
     * The type of event in response to which should the function be invoked.
     *
     * @stability stable
     *
     * @default LambdaEdgeEventType.ORIGIN_RESPONSE
  */
  readonly eventType?: cf.LambdaEdgeEventType;
}
/**
 * Custom extension sample
 */
export class Custom implements IExtensions {
  readonly functionArn: string;
  readonly functionVersion: lambda.Version;
  readonly eventType: cf.LambdaEdgeEventType;
  constructor(scope: cdk.Construct, id: string, props: CustomProps) {
    const func = props?.func ?? new lambda.Function(scope, 'CustomFunc', {
      code: props?.code ?? lambda.Code.fromAsset(path.join(__dirname, '../lambda/function')),
      runtime: props?.runtime ?? lambda.Runtime.PYTHON_3_8,
      handler: props?.handler ?? 'index.lambda_handler',
      timeout: props?.timeout ?? cdk.Duration.seconds(5),
    });
    this.functionArn = func.functionArn;
    this.functionVersion = new lambda.Version(scope, `FuncVer${id}`, { lambda: func });
    this.eventType = props?.eventType ?? cf.LambdaEdgeEventType.ORIGIN_RESPONSE;
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
 * Default Directory Indexes in Amazon S3-backed Amazon CloudFront Origins
 *
 *  use case - see https://aws.amazon.com/tw/blogs/compute/implementing-default-directory-indexes-in-amazon-s3-backed-amazon-cloudfront-origins-using-lambdaedge/
 */
export class RewriteUri extends Custom {
  readonly lambdaFunction: lambda.Version;
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id, {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.AssetCode.fromAsset(path.join(__dirname, '../custom-lambda-code')),
      eventType: cf.LambdaEdgeEventType.ORIGIN_REQUEST,
    });
    this.lambdaFunction = this.functionVersion;
  }
};
