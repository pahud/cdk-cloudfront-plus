export async function handler(event: any, context: any, callback: Function) {
  const request = event.Records[0].cf.request;
  const { COUNTRY_CODE_TABLE: countryCodeTable } = process.env;
  let newDomainName: string;
  let viewerCountry: string;
  let response: { [key: string]: any }
  if (request.headers['cloudfront-viewer-country']) {
    viewerCountry = request.headers['cloudfront-viewer-country'][0].value;
    console.log('Got viewer country: %j', viewerCountry)
    newDomainName = countryCodeTable[viewerCountry]
    console.log('new domain name: %j', newDomainName)
    if (newDomainName) {
      response = {
        status: '302',
        statusDescription: 'Found',
        headers: {
            location: [{
                key: 'Location',
                value: newDomainName,
            }],
        },
      };
    }
  }
  return callback(null, response);
}

// this.handler({
//   "Records": [
//       {
//           "cf": {
//               "config": {
//                   "distributionDomainName": "de3adh84lu72o.cloudfront.net",
//                   "distributionId": "EAPMW7NX4X4II",
//                   "eventType": "origin-request",
//                   "requestId": "GukZraZ4PaMb4eBHSf3bsnnZ0j2UnBPKNKtHe-5kSneDbeMk1QtAtw=="
//               },
//               "request": {
//                   "clientIp": "149.154.161.1",
//                   "headers": {
//                       "x-forwarded-for": [
//                           {
//                               "key": "X-Forwarded-For",
//                               "value": "149.154.161.1"
//                           }
//                       ],
//                       "user-agent": [
//                           {
//                               "key": "User-Agent",
//                               "value": "Amazon CloudFront"
//                           }
//                       ],
//                       "via": [
//                           {
//                               "key": "Via",
//                               "value": "1.1 054e3273b1ea8604004af961945df65e.cloudfront.net (CloudFront)"
//                           }
//                       ],
//                       "accept-encoding": [
//                           {
//                               "key": "Accept-Encoding",
//                               "value": "gzip"
//                           }
//                       ],
//                       "cloudfront-viewer-country": [
//                           {
//                               "key": "CloudFront-Viewer-Country",
//                               "value": "AG"
//                           }
//                       ],
//                       "host": [
//                           {
//                               "key": "Host",
//                               "value": "demo-stack-demobucket75802299-448r5yq2tvms.s3.us-east-1.amazonaws.com"
//                           }
//                       ]
//                   },
//                   "method": "GET",
//                   "origin": {
//                       "s3": {
//                           "authMethod": "origin-access-identity",
//                           "customHeaders": {},
//                           "domainName": "demo-stack-demobucket75802299-448r5yq2tvms.s3.us-east-1.amazonaws.com",
//                           "path": "/en",
//                           "region": "us-east-1"
//                       }
//                   },
//                   "querystring": "",
//                   "uri": "/index.html"
//               }
//           }
//       }
//   ]
// }, {}, (error, result) => {
//   console.log(result)
// })