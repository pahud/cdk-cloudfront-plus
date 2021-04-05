#!/usr/bin/python
# -*- coding: utf-8 -*-
import os
from typing import Any, Dict
from urllib.parse import parse_qs, urlencode

needed_keys = {}
with open("needed_keys.txt") as f:
    for line in f:
        (key, val) = line.split()
        needed_keys[key] = val


# source from https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-examples.html#lambda-examples-header-based-on-query-string
def lambda_handler(event, context):
    print(event)
    request = event["Records"][0]["cf"]["request"]
    before_headers = request["headers"]
    before_querystring = request["querystring"]

    # Parse request querystring to get dictionary/json
    params = {k: v[0] for k, v in parse_qs(request["querystring"]).items()}

    print(f"Before processing, the content of headers:{before_headers}")
    print(f"Before processing, the content of querystring:{before_querystring}")
    if params:
        # Add headers according to a query string
        for key in needed_keys.keys():
            _add_header(needed_keys[key], params, request)

        # Update request querystring
        request["querystring"] = urlencode(params)
    after_header = request["headers"]
    after_querystring = request["querystring"]
    print(f"After processing, the content of headers:{after_header}")
    print(f"After processing, the content of querystring:{after_querystring}")

    print(request)
    return request


def _add_header(header_name: str, params: Dict[str, str], request: Dict[str, Any]) -> None:
    request["headers"][header_name.lower()] = [
        {"key": header_name, "value": params[header_name]}]
    del params[header_name]
