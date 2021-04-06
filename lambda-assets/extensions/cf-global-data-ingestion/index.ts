import * as AWS from 'aws-sdk';

const kinesisFirehose = new AWS.Firehose({region: 'us-east-1'});
const deliveryStreamName = process.env.DELIVERY_STREAM_NAME;

export async function handler(event: any) {
  const request = event.Records[0].cf.request;
  const body = Buffer.from(request.body.data, 'base64').toString('utf-8');

  const params = {
    DeliveryStreamName: deliveryStreamName,
    Record: {
      Data: JSON.stringify({ body }) + '\n',
    },
  };

  await kinesisFirehose.putRecord(params).promise()

  return {
    body: '',
    bodyEncoding: 'text',
    status: '200',
  };
}