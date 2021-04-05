import { URLSearchParams } from 'url'
export async function lambdaHandler(event: any) {
    /**
     * Whitelisted request arguments that will be converted into additional headers
     * `NEEDED_KEYS` is the placeholder for `args` that will be bundled and injected by esbuild.
     * */
    const neededKeys = NEEDED_KEYS

    let request = event.Records[0].cf.request;
    let beforeHeaders = request.headers;
    let beforeQueryString = request.querystring;

    // Parse request querystring to get dictionary/json
    let params = new URLSearchParams(request.querystring);

    console.log(`Before processing, the content of headers:${JSON.stringify(beforeHeaders, null, '\t')}`);
    console.log(`Before processing, the content of querystring:${JSON.stringify(beforeQueryString, null, '\t')}`);
    if (params != null) {
        // Add headers according to a query string
        for (let key of neededKeys) {
            _add_header(key, params, request);
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
    request.headers['x-'.concat(headerName.toLowerCase())] = [
        { "key": headerName, "value": params.get(headerName) }]
    params.delete(headerName);
}
