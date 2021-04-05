import { URLSearchParams } from 'url'
export async function lambdaHandler(event: any) {
    const neededKeys = process.env.NEEDED_KEYS

    let request = event.Records[0].cf.request;
    let beforeHeaders = request.headers;
    let beforeQueryString = request.querystring;

    // Parse request querystring to get dictionary/json
    let params = new URLSearchParams(request.querystring);

    console.log(`Before processing, the content of headers:${JSON.stringify(beforeHeaders, null, '\t')}`);
    console.log(`Before processing, the content of querystring:${JSON.stringify(beforeQueryString, null, '\t')}`);
    if (params != null) {
        // Add headers according to a query string
        for (let key of Object.keys(neededKeys)) {
            _add_header(neededKeys[key], params, request);
        }
        // Update request querystring
        request['querystring'] = encodeURI(params.toString());
    }
    let afterHeader = request.headers;
    let afterQueryString = request.querystring;
    console.log(`After processing, the content of headers:${JSON.stringify(afterHeader, null, '\t')}`);
    console.log(`After processing, the content of querystring:${JSON.stringify(afterQueryString, null, '\t')}`);

    console.log(JSON.stringify(request, null, '\t'));
    return request;
}

function _add_header(headerName: string, params: any, request: any): void {
    request.headers[headerName.toLowerCase()] = [
        { "key": headerName, "value": params.get(headerName) }]
    params.delete(headerName);
}