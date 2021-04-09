import * as path from 'path';
import * as cf from '@aws-cdk/aws-cloudfront';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { IExtensions } from './extensions';

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
  /**
   * Allows a Lambda function to have read access to the body content.
   * Only valid for "request" event types (ORIGIN_REQUEST or VIEWER_REQUEST).
   *
   * @stability stable
   *
   * @default false
   */
  readonly includeBody?: boolean;
  /**
   * The solution identifier
   *
   * @default - no identifier
   */
  readonly solutionId?: string;
  /**
   * The template description
   *
   * @default ''
   */
  readonly templateDescription?: string;
}
/**
 * Custom extension sample
 */
export class Custom extends cdk.NestedStack implements IExtensions {
  readonly functionArn: string;
  readonly functionVersion: lambda.Version;
  readonly eventType: cf.LambdaEdgeEventType;
  readonly includeBody?: boolean;
  readonly props: CustomProps;
  constructor(scope: cdk.Construct, id: string, props: CustomProps) {
    super(scope, id, props);

    this.props = props;

    const func = props?.func ?? new lambda.Function(this, 'CustomFunc', {
      code: props?.code ?? lambda.Code.fromAsset(path.join(__dirname, '../lambda/function')),
      runtime: props?.runtime ?? lambda.Runtime.PYTHON_3_8,
      handler: props?.handler ?? 'index.lambda_handler',
      timeout: props?.timeout ?? cdk.Duration.seconds(5),
    });
    this.functionArn = func.functionArn;
    this.functionVersion = func.currentVersion;
    this.eventType = props?.eventType ?? cf.LambdaEdgeEventType.ORIGIN_RESPONSE;
    this.includeBody = props?.includeBody ?? false;
    this._addDescription();
    this._outputSolutionId();
  }
  private _addDescription() {
    this.templateOptions.description = `(${this.props.solutionId}) ${this.props.templateDescription}`;
  }
  private _outputSolutionId() {
    if (this.props.solutionId) {
      new cdk.CfnOutput(this, 'SolutionId', {
        value: this.props.solutionId,
        description: 'Solution ID',
      });
    }
  }
}
