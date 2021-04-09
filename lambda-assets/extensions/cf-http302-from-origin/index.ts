import axios, { AxiosResponse } from 'axios';

export interface HttpResponse {
  readonly status: number;
  readonly statusDescription: string;
  readonly headers: { [key: string]: {[key: string]: string}[] },
  readonly body: string,
}

export async function HttpGet(url: string): Promise<AxiosResponse> {
  const client = axios.create();
  const response: AxiosResponse<any> = await client.get(url)
  return response
}

export async function handler(event: any) {
  const response = event.Records[0].cf.response;
  console.log('response: %j', response)
  if (response.status === '302' && response.headers['location'].length != 0) {
    const locationUrl = response.headers['location'][0].value;
    const newResponse = await HttpGet(locationUrl)
    const responseObject: HttpResponse = {
      headers: {},
      status: newResponse.status,
      statusDescription: newResponse.statusText,
      body: newResponse.data,
    }
    return cacheControl(responseObject, '10')
  } else {
    return response;
  }
};

/**
 * set the cache control header
 * @param responseObject 
 * @param maxAge 
 * @returns 
 */
function cacheControl(responseObject: HttpResponse,  maxAge: string): HttpResponse {
  responseObject['headers']['cache-control'] = [
    {
      key: 'Cache-Control',
      value: `max-age=${maxAge}`,
    }
  ]
  return responseObject
}
