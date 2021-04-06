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
  echo "Ingest '${data}' to cloudfront"
  curl $URL --request POST --data "${data}"
  sleep 1
done

echo
BUCKET=$(aws cloudformation describe-stacks \
        --stack-name global-data-ingestion \
        --query "Stacks[0].Outputs[?starts_with(OutputKey, 'firehoseDataBucket')].OutputValue" \
        --output text)
echo "Please open S3 bucket '${BUCKET}' to see the results"