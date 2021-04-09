DOMAIN=$(aws cloudformation describe-stacks \
        --stack-name global-data-ingestion \
        --query "Stacks[0].Outputs[?starts_with(OutputKey, 'distributionDomainName')].OutputValue" \
        --output text)
URL="https://${DOMAIN}/"
echo "URL:" $URL

echo
for i in {0..9}
do
  data="This is data ${i}"
  echo "Ingest '${data}' to cloudfront ${URL}"
  curl $URL --request POST --data "${data}"
  sleep 0.1
done

echo
BUCKET=$(aws cloudformation describe-stacks \
        --stack-name global-data-ingestion \
        --query "Stacks[0].Outputs[?starts_with(OutputKey, 'firehoseDataBucket')].OutputValue" \
        --output text)
echo "Please wait 1min and go to s3://${BUCKET} to see the results"