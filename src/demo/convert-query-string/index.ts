import * as fs from 'fs';
import * as path from 'path';
import * as cf from '@aws-cdk/aws-cloudfront';
import { S3Origin } from '@aws-cdk/aws-cloudfront-origins';
import * as s3 from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import * as extensions from '../../extensions';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'convert-query-string-demo', {
  env: { account: cdk.Aws.ACCOUNT_ID, region: 'us-east-1' },
});

/**
 * create an extension (L@E)
 * keys defined in a whitelist, or `ConvertQueryStringProps`, will become
 * custom headers with 'x-' prefixed.
 */
const convertQueryStringProsp: extensions.ConvertQueryStringProps = { args: ['language', 'name'] };
const convertQueryString = new extensions.ConvertQueryString(stack, 'LambdaEdge', convertQueryStringProsp);

// create a demo S3 Bucket.
const bucket = new s3.Bucket(convertQueryString, 'DemoBucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  websiteIndexDocument: 'index.html',
  publicReadAccess: true,
});

// create an index.html and 2 htmls in the demo folder
fs.writeFileSync(path.join(__dirname, 'index.html'),
  `
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
</head>
<body>
<h2>Information Submission</h2>
<form action="./index.html" method="get">
  <label for="fname">Name:</label><br>
  <input type="text" id="name" name="name" value="Your Name"><br>
  <label for="language">Language:</label><br>
  <select id="language" name="language">
    <option value="traditionalchinese">語言</option>
    <option value="english">Language</option>
    <option value="french">Langue</option>
    <option value="greece">Γλώσσα</option>
  </select><br><br>
  <label for="extra">Extra:</label><br>
  <input type="text" id="extra" name="extra"><br>
  <input type="submit" value="Submit">
</form> 
<p>If you click the "Submit" button, the form-data will be sent to the server. ^.<</p>
</body>
</html>`);
// Put demo Object to Bucket.
new BucketDeployment(convertQueryString, 'Deployment', {
  sources: [Source.asset(path.join(__dirname, './'))],
  destinationBucket: bucket,
  retainOnDelete: false,
});

/*
 * If you deploy this demonstration in another region other than us-east-1, your
 * closest edge location might not be what you expect. Change the price class
 * accordingly based on your anticipation.
 *
 */
// A CloudFront distribution with the L@E
const cloudFrontDistribution = new cf.Distribution(stack, 'CloudFrontDistribution', {
  defaultBehavior: {
    origin: new S3Origin(bucket),
    edgeLambdas: [convertQueryString],
    cachePolicy: new cf.CachePolicy(stack, 'DefaultCachePolicy', {
      cachePolicyName: 'ConvertQueryString-Cache-Policy',
      queryStringBehavior: cf.CacheQueryStringBehavior.all(),
    }),
    originRequestPolicy: new cf.OriginRequestPolicy(stack, 'RequestPolicy', {
      originRequestPolicyName: 'ConvertQueryString-Request-Policy',
      queryStringBehavior: cf.OriginRequestQueryStringBehavior.all(),
      comment: 'just for demonstration.',
    }),
  },
  comment: `The CloudFront distribution based on ${bucket.bucketName}`,
  priceClass: cf.PriceClass.PRICE_CLASS_200,
});

new cdk.CfnOutput(stack, 'DistributionDomainName', {
  value: cloudFrontDistribution.distributionDomainName,
});
