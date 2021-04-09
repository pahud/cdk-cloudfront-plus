import { SynthUtils } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as apigw from '@aws-cdk/aws-apigatewayv2';
import * as integrations from '@aws-cdk/aws-apigatewayv2-integrations';
import * as cf from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as extensions from '../extensions';

export class Http302Backend extends cdk.Construct {
  readonly endpoint: string;
  readonly domainName: string;
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const api = new apigw.HttpApi(this, 'Api', {
      defaultIntegration: new integrations.LambdaProxyIntegration({
        handler: new lambda.Function(this, 'ApiHandler', {
          runtime: lambda.Runtime.PYTHON_3_7,
          handler: 'index.handler',
          code: new lambda.InlineCode(`
def handler(event, context):
      return {
        'statusCode': 302,
        'headers': {
          'location': 'https://www.google.com',
        },
      }`),
        }),
      }),
    });

    this.endpoint = api.apiEndpoint!;
    const stack = cdk.Stack.of(this);
    this.domainName = `${api.apiId}.execute-api.${stack.region}.${stack.urlSuffix}`;
  }
}

test('basic minimal setting', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'http302-integ');

  // WHEN
  // create the cloudfront distribution with extension(s)
  const ext = new extensions.HTTP302FromOrigin(stack, 'http302');
  const backend = new Http302Backend(stack, 'Http302Backend');

  // create the cloudfront distribution with extension(s)
  new cf.Distribution(stack, 'dist', {
    defaultBehavior: {
      origin: new origins.HttpOrigin(backend.domainName),
      cachePolicy: cf.CachePolicy.CACHING_DISABLED,
      edgeLambdas: [ext],
    },
  });

  // THEN
  // match snapshot
  expect(SynthUtils.synthesize(stack).template).toMatchSnapshot();

  // match custom lambda function version
  expect(stack).toHaveResourceLike('AWS::Lambda::Version', {
    FunctionName: {
      Ref: 'HTTP302FromOriginFuncFCF29B3D',
    },
  });
});
