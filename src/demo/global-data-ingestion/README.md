# How to Test

```sh
$ yarn watch
12:20:39 AM - File change detected. Starting incremental compilation...
12:20:41 AM - Found 0 errors. Watching for file changes.
...
```

Open a seperate terminal and run:

```sh
$ AWS_REGION=us-east-1 cdk --app lib/demo/global-data-ingestion/index.js diff
$ AWS_REGION=us-east-1 cdk --app lib/demo/global-data-ingestion/index.js deploy
```

On deploy completed, run the demo.sh

```sh
$ sh demo.sh
URL: https://d21o0123456789.cloudfront.net/

Ingest 'This is data 0' to cloudfront
Ingest 'This is data 1' to cloudfront
Ingest 'This is data 2' to cloudfront
Ingest 'This is data 3' to cloudfront
Ingest 'This is data 4' to cloudfront
Ingest 'This is data 5' to cloudfront
Ingest 'This is data 6' to cloudfront
Ingest 'This is data 7' to cloudfront
Ingest 'This is data 8' to cloudfront
Ingest 'This is data 9' to cloudfront

Please open S3 bucket 'global-data-ingestion' to see the results
```