# How to Test

```sh
$ yarn watch
11:50:43 AM - File change detected. Starting incremental compilation...
11:50:45 AM - Found 0 errors. Watching for file changes.
...
...
```

Open a seperate terminal and run:

```sh
$ AWS_REGION=us-east-1 cdk --app lib/demo/redirect-custom-error-page/index.js diff
```

On deploy completed, open the cloudfront URL with

```sh
# access the path with object existed in s3 bucket
$ curl http://<CLOUDFRONT_DOMAIN>
<h1>Hello CDK!</h1>
# access the path with object un-existed in s3 bucket
$ curl -I http://<CLOUDFRONT_DOMAIN>/123
# response with the redirect message
HTTP/2 302 
content-type: application/xml
content-length: 0
date: Fri, 02 Apr 2021 08:40:09 GMT
server: AmazonS3
location: /404.html # the custom error page defined in Lambda@Edge
x-cache: Miss from cloudfront
via: 1.1 xxx.cloudfront.net (CloudFront)
x-amz-cf-pop: SFO53-C1
x-amz-cf-id: xxx
```

There would be 3 path you can access:

* `http://<CLOUDFRONT_DOMAIN>/index.html`
* `http://<CLOUDFRONT_DOMAIN>/error.html`
* `http://<CLOUDFRONT_DOMAIN>/404.html`

Once you access the page caused 4xx error, it will redirect to the 404 error page.
