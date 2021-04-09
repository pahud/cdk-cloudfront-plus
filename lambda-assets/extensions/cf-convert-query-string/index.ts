import { URLSearchParams } from 'url'
export async function lambdaHandler(event: any) {
    /**
     * Whitelisted request arguments that will be converted into additional headers
     * `NEEDED_KEYS` is the placeholder for `args` that will be bundled and injected by esbuild.
     * */
    const neededKeys = NEEDED_KEYS

    console.log(`${JSON.stringify(event, null, '\t')}`);

    let request = event.Records[0].cf.request;
    let querystring = request.querystring;

    let beforeHeaders = request.headers;
    let beforeQueryString = querystring;

    // Parse request querystring to get dictionary/json
    let params = new URLSearchParams(querystring);

    console.log(`Before processing, the content of headers:${JSON.stringify(beforeHeaders, null, '\t')}`);
    console.log(`Before processing, the content of querystring:${JSON.stringify(beforeQueryString, null, '\t')}`);
    if (params != null) {
        // Add headers according to a query string
        const capitalizeHeaderOrNot = true
        for (let key of neededKeys) {
            _add_header(key, params, request, capitalizeHeaderOrNot);
        }
    }
    let afterHeader = request.headers;
    let afterQueryString = request.querystring;
    console.log(`After processing, the content of headers:${JSON.stringify(afterHeader, null, '\t')}`);
    console.log(`After processing, the content of querystring:${JSON.stringify(afterQueryString, null, '\t')}`);

    console.log(JSON.stringify(request, null, '\t'));
    return request;
}


function capitalizeFirstLetterForEachTearm(term: string, delimiter: string = '-'): string {
    let components = term.split(delimiter);
    components.forEach((item, index) => components[index] = item.charAt(0).toUpperCase() + item.slice(1));
    let result = components.join(delimiter);
    return result;
}

function _add_header(headerName: string, params: any, request: any, capitalizeOrNot: boolean = false): void {
    const properHeader = (capitalizeOrNot == true) ? capitalizeFirstLetterForEachTearm('x-'.concat(headerName)) : headerName;
    request.headers['x-'.concat(headerName)] = [
        { "key": properHeader, "value": (params.get(headerName) === null) ? '' : params.get(headerName) }]
    params.delete(headerName);
}
