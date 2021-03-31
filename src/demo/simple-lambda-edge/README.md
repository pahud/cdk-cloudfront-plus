# How to Test

```sh
yarn watch
```
Open a seperate terminal and run:

```sh
AWS_REGION=us-east-1 cdk --app lib/demo/simple-lambda-edge/index.js diff
```

On deploy completed, open the cloudfront URL with


```
http://<CLOUDFRONT_DOMAIN>
```

You should be able to see `Hello from Lambda@Edge!`.
