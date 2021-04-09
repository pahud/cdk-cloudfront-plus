# How to Test

```sh
yarn watch
```
Open a seperate terminal and run:

```sh
AWS_REGION=us-east-1 cdk --app lib/demo/http302-from-origin/index.js diff

AWS_REGION=us-east-1 cdk --app lib/demo/http302-from-origin/index.js deploy --require-approval never
```

When the CDK deployment completed, you will see the URL on the terminal.
