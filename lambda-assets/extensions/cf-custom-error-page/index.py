#!/usr/bin/python
# -*- coding: utf-8 -*-
import json


# source from https://aws.amazon.com/blogs/networking-and-content-delivery/customize-403-error-pages-from-amazon-cloudfront-origin-with-lambdaedge/
def handler(event, context):
    
    print(event)

    response = event['Records'][0]['cf']['response']
    request = event['Records'][0]['cf']['request']

    '''
    This function updates your HTTP status code in the response to a 404, redirecting it to another path (cache behavior) that has a different origin configured. Note the following:
    1. The function is triggered by an origin response
    2. The response status from the origin server is an error status code (4xx)
    '''

    if int(response['status']) >= 400 and int(response['status']) <= 499:
    
        redirect_path = '/404.html'

        response['status'] = 302
        response['statusDescription'] = 'Found'

        # Drop the body as it is not required for redirects
        response['body'] = ''
        response['headers']['location'] = [{'key': 'Location', 'value': redirect_path}]

    print(response)
    return response