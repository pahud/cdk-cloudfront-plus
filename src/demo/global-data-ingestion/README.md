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
$ sh src/demo/global-data-ingestion/demo.sh
URL: https://d21o0123456789.cloudfront.net/

Ingest 'This is data 0' to cloudfront https://d21o0123456789.cloudfront.net
Ingest 'This is data 1' to cloudfront https://d21o0123456789.cloudfront.net
Ingest 'This is data 2' to cloudfront https://d21o0123456789.cloudfront.net
Ingest 'This is data 3' to cloudfront https://d21o0123456789.cloudfront.net
Ingest 'This is data 4' to cloudfront https://d21o0123456789.cloudfront.net
Ingest 'This is data 5' to cloudfront https://d21o0123456789.cloudfront.net
Ingest 'This is data 6' to cloudfront https://d21o0123456789.cloudfront.net
Ingest 'This is data 7' to cloudfront https://d21o0123456789.cloudfront.net
Ingest 'This is data 8' to cloudfront https://d21o0123456789.cloudfront.net
Ingest 'This is data 9' to cloudfront https://d21o0123456789.cloudfront.net

Please wait 1min and go to s3://global-data-ingestion-firehosedatabucket460aaa87-2tq2xea15hg5 to see the results
```