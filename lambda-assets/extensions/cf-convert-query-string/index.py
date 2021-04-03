#!/usr/bin/python
# -*- coding: utf-8 -*-
from urllib.parse import parse_qs, urlencode


# source from https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-examples.html#lambda-examples-header-based-on-query-string
def lambda_handler(event, context):
    request = event["Records"][0]["cf"]["request"]

    """
        When a request contains a query string key-value pair but the origin server
        expects the value in a header, you can use this Lambda function to
        convert the key-value pair to a header. Here"s what the function does:
            1. Parses the query string and gets the key-value pair.
            2. Adds a header to the request using the key-value pair that the function got in step 1.
    """

    # Parse request querystring to get dictionary/json
    params = {k: v[0] for k, v in parse_qs(request["querystring"]).items()}

    # Move auth param from querystring to headers
    headerName = "Auth-Header"
    request["headers"][headerName.lower()] = [
        {"key": headerName, "value": params["auth"]}]
    del params["auth"]

    # Update request querystring
    request["querystring"] = urlencode(params)

    return request

