import * as fs from 'fs';
import * as path from 'path';
import * as cf from '@aws-cdk/aws-cloudfront';
import { S3Origin } from '@aws-cdk/aws-cloudfront-origins';
import * as s3 from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import * as extensions from '../../extensions';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'convert-query-string-demo');

// create a cloudfront distribution with an extension (L@E)
const convertQueryString = new extensions.ConvertQueryString(stack, 'ConvertQueryStringExtension');

// create a demo S3 Bucket.
const bucket = new s3.Bucket(convertQueryString, 'DemoConvertStringBucket', {
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  websiteIndexDocument: 'index.html',
  websiteErrorDocument: 'index.html',
});

// create an index.html in the demo folder
fs.writeFileSync(path.join(__dirname, 'index.html'),
  `
<html>
<body>
<h2>Information Submission</h2>
<form action="./index.html">
  <label for="fname">Name:</label><br>
  <input type="text" id="name" name="name" value="Your Name"><br>
  <label for="language">Language:</label><br>
  <select id="language" name="language">
    <option value="traditionalchinese">語言</option>
    <option value="english">Language</option>
    <option value="french">Langue</option>
    <option value="greece">Γλώσσα</option>
  </select><br><br>
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

// An S3 origin with its corresponding CloudFront OAI
const demoOrigin = new S3Origin(bucket, {
  originAccessIdentity: new cf.OriginAccessIdentity(convertQueryString, 'OriginAccessIdentity', {
    comment: `The origin access identity (OAI) for the CloudFront distribution related to ${bucket.bucketName}`,
  }),
});

/*
 * If you deploy this demonstration in another region other than us-east-1, your
 * closest edge location might not be what you expect. Change the price class
 * accordingly based on your anticipation.
 *
 */
// A CloudFront distribution
const cloudFrontDistribution = new cf.Distribution(stack, 'CloudFrontWebDistribution', {
  defaultBehavior: {
    origin: demoOrigin,
    edgeLambdas: [convertQueryString],
    cachePolicy: new cf.CachePolicy(stack, 'DefaultCachePolicy', {
      cachePolicyName: 'ConvertQueryString-Default-Cache-Policy',
      queryStringBehavior: cf.CacheQueryStringBehavior.none(),
    }),
    originRequestPolicy: new cf.OriginRequestPolicy(stack, 'RequestPolicy', {
      originRequestPolicyName: 'ConvertQueryString-Request-Policy',
      queryStringBehavior: cf.OriginRequestQueryStringBehavior.none(),
      headerBehavior: cf.OriginRequestHeaderBehavior.allowList(
        'hakunamatata',
      ),
      comment: 'just for demonstration.',
    }),
  },
  comment: `The CloudFront distribution for ${bucket.bucketName}`,
  priceClass: cf.PriceClass.PRICE_CLASS_200,
});

new cdk.CfnOutput(stack, 'DistributionDomainName', {
  value: cloudFrontDistribution.distributionDomainName,
});
