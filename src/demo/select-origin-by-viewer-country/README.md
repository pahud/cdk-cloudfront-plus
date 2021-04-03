# How to Test

```sh
yarn watch
```
Open a seperate terminal and run:

```sh
AWS_REGION=us-east-1 cdk --app lib/demo/select-origin-by-viewer-country/index.js diff
```

On deploy completed, open the cloudfront URL with


```
http://<CLOUDFRONT_DOMAIN>
```

You should be able to see different website depends on the `countryTable` definition.
