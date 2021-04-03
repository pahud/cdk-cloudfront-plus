export async function handler(event: any) {
  const request = event.Records[0].cf.request;
  const countryCodeTable = process.env.COUNTRY_CODE_TABLE;
  let newDomainName: string;
  let viewerCountry: string;
  let response: { [key: string]: any } = {}
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
  return response;
}