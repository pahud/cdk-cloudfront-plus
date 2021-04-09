# API Reference

**Classes**

Name|Description
----|-----------
[AccessOriginByGeolocation](#cdk-cloudfront-plus-accessoriginbygeolocation)|(SO8118)Access Origin by Geolocation.
[AntiHotlinking](#cdk-cloudfront-plus-antihotlinking)|The Anti-Hotlinking extension.
[ConvertQueryString](#cdk-cloudfront-plus-convertquerystring)|Convert a query string to key-value pairs and add them into header.
[Custom](#cdk-cloudfront-plus-custom)|Custom extension sample.
[CustomErrorPage](#cdk-cloudfront-plus-customerrorpage)|Display customized error pages, or mask 4XX error pages, based on where the error originated.
[DefaultDirIndex](#cdk-cloudfront-plus-defaultdirindex)|Default Directory Indexes in Amazon S3-backed Amazon CloudFront Origins.
[Distribution](#cdk-cloudfront-plus-distribution)|*No description*
[GlobalDataIngestion](#cdk-cloudfront-plus-globaldataingestion)|Ingest data to Kinesis Firehose by nearest cloudfront edge.
[HTTP302FromOrigin](#cdk-cloudfront-plus-http302fromorigin)|The HTTP[302] from origin extension.
[ModifyResponseHeader](#cdk-cloudfront-plus-modifyresponseheader)|The modify response header extension.
[MultipleOriginIpRetry](#cdk-cloudfront-plus-multipleoriginipretry)|Multiple Origin IP Retry extension.
[NormalizeQueryString](#cdk-cloudfront-plus-normalizequerystring)|Normalize Query String extension.
[OAuth2AuthorizationCodeGrant](#cdk-cloudfront-plus-oauth2authorizationcodegrant)|OAuth2 Authentication - Authorization Code Grant.
[RedirectByGeolocation](#cdk-cloudfront-plus-redirectbygeolocation)|Forward request to the nearest PoP as per geolocation.
[SecurtyHeaders](#cdk-cloudfront-plus-securtyheaders)|Security Headers extension.
[ServerlessApp](#cdk-cloudfront-plus-serverlessapp)|*No description*
[SimpleLambdaEdge](#cdk-cloudfront-plus-simplelambdaedge)|Simple content generation.


**Structs**

Name|Description
----|-----------
[AccessOriginByGeolocationProps](#cdk-cloudfront-plus-accessoriginbygeolocationprops)|*No description*
[AntiHotlinkingProps](#cdk-cloudfront-plus-antihotlinkingprops)|Construct properties for AntiHotlinking.
[ConvertQueryStringProps](#cdk-cloudfront-plus-convertquerystringprops)|keys options.
[CustomProps](#cdk-cloudfront-plus-customprops)|*No description*
[DistributionProps](#cdk-cloudfront-plus-distributionprops)|*No description*
[GlobalDataIngestionProps](#cdk-cloudfront-plus-globaldataingestionprops)|*No description*
[MultipleOriginIpRetryProps](#cdk-cloudfront-plus-multipleoriginipretryprops)|Construct properties for MultipleOriginIpRetry.
[OAuth2AuthorizationCodeGrantProps](#cdk-cloudfront-plus-oauth2authorizationcodegrantprops)|*No description*
[RedirectByGeolocationProps](#cdk-cloudfront-plus-redirectbygeolocationprops)|*No description*
[ServerlessAppProps](#cdk-cloudfront-plus-serverlessappprops)|Construct properties for ServerlessApp.


**Interfaces**

Name|Description
----|-----------
[IExtensions](#cdk-cloudfront-plus-iextensions)|The Extension interface.



## class AccessOriginByGeolocation  <a id="cdk-cloudfront-plus-accessoriginbygeolocation"></a>

(SO8118)Access Origin by Geolocation.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [ITaggable](#aws-cdk-core-itaggable), [IExtensions](#cdk-cloudfront-plus-iextensions)
__Extends__: [Custom](#cdk-cloudfront-plus-custom)

### Initializer




```ts
new AccessOriginByGeolocation(scope: Construct, id: string, props: AccessOriginByGeolocationProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[AccessOriginByGeolocationProps](#cdk-cloudfront-plus-accessoriginbygeolocationprops)</code>)  *No description*
  * **countryTable** (<code>Map<string, string></code>)  The pre-defined country code table. 




## class AntiHotlinking  <a id="cdk-cloudfront-plus-antihotlinking"></a>

The Anti-Hotlinking extension.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IExtensions](#cdk-cloudfront-plus-iextensions)
__Extends__: [ServerlessApp](#cdk-cloudfront-plus-serverlessapp)

### Initializer




```ts
new AntiHotlinking(scope: Construct, id: string, props: AntiHotlinkingProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[AntiHotlinkingProps](#cdk-cloudfront-plus-antihotlinkingprops)</code>)  *No description*
  * **referer** (<code>Array<string></code>)  Referer allow list with wildcard(* and ?) support i.e. `example.com` or `exa?ple.*`. 



### Properties


Name | Type | Description 
-----|------|-------------
**eventType** | <code>[LambdaEdgeEventType](#aws-cdk-aws-cloudfront-lambdaedgeeventtype)</code> | The Lambda edge event type for this extension.
**functionArn** | <code>string</code> | Lambda function ARN for this extension.
**functionVersion** | <code>[Version](#aws-cdk-aws-lambda-version)</code> | Lambda function version for the function.



## class ConvertQueryString  <a id="cdk-cloudfront-plus-convertquerystring"></a>

Convert a query string to key-value pairs and add them into header.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [ITaggable](#aws-cdk-core-itaggable), [IExtensions](#cdk-cloudfront-plus-iextensions)
__Extends__: [Custom](#cdk-cloudfront-plus-custom)

### Initializer




```ts
new ConvertQueryString(scope: Construct, id: string, props: ConvertQueryStringProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[ConvertQueryStringProps](#cdk-cloudfront-plus-convertquerystringprops)</code>)  *No description*
  * **args** (<code>Array<string></code>)  The request arguments that will be converted to additional request headers. 



### Properties


Name | Type | Description 
-----|------|-------------
**lambdaFunction** | <code>[Version](#aws-cdk-aws-lambda-version)</code> | <span></span>



## class Custom  <a id="cdk-cloudfront-plus-custom"></a>

Custom extension sample.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [ITaggable](#aws-cdk-core-itaggable), [IExtensions](#cdk-cloudfront-plus-iextensions)
__Extends__: [NestedStack](#aws-cdk-core-nestedstack)

### Initializer




```ts
new Custom(scope: Construct, id: string, props: CustomProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[CustomProps](#cdk-cloudfront-plus-customprops)</code>)  *No description*
  * **code** (<code>[AssetCode](#aws-cdk-aws-lambda-assetcode)</code>)  The source code of your Lambda function. __*Default*__: Code.fromAsset(path.join(__dirname, '../lambda/function'))
  * **eventType** (<code>[LambdaEdgeEventType](#aws-cdk-aws-cloudfront-lambdaedgeeventtype)</code>)  The type of event in response to which should the function be invoked. __*Default*__: LambdaEdgeEventType.ORIGIN_RESPONSE
  * **func** (<code>[Function](#aws-cdk-aws-lambda-function)</code>)  Specify your Lambda function. __*Optional*__
  * **handler** (<code>string</code>)  The name of the method within your code that Lambda calls to execute your function. __*Default*__: index.lambda_handler
  * **includeBody** (<code>boolean</code>)  Allows a Lambda function to have read access to the body content. __*Default*__: false
  * **runtime** (<code>[Runtime](#aws-cdk-aws-lambda-runtime)</code>)  The runtime environment for the Lambda function that you are uploading. __*Default*__: Runtime.PYTHON_3_8
  * **solutionId** (<code>string</code>)  The solution identifier. __*Default*__: no identifier
  * **templateDescription** (<code>string</code>)  The template description. __*Default*__: ''
  * **timeout** (<code>[Duration](#aws-cdk-core-duration)</code>)  The function execution time (in seconds) after which Lambda terminates the function. __*Default*__: Duration.seconds(5)



### Properties


Name | Type | Description 
-----|------|-------------
**eventType** | <code>[LambdaEdgeEventType](#aws-cdk-aws-cloudfront-lambdaedgeeventtype)</code> | The Lambda edge event type for this extension.
**functionArn** | <code>string</code> | Lambda function ARN for this extension.
**functionVersion** | <code>[Version](#aws-cdk-aws-lambda-version)</code> | Lambda function version for the function.
**props** | <code>[CustomProps](#cdk-cloudfront-plus-customprops)</code> | <span></span>
**includeBody**? | <code>boolean</code> | Allows a Lambda function to have read access to the body content.<br/>__*Optional*__



## class CustomErrorPage  <a id="cdk-cloudfront-plus-customerrorpage"></a>

Display customized error pages, or mask 4XX error pages, based on where the error originated.

use case - see https://aws.amazon.com/blogs/networking-and-content-delivery/customize-403-error-pages-from-amazon-cloudfront-origin-with-lambdaedge/

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [ITaggable](#aws-cdk-core-itaggable), [IExtensions](#cdk-cloudfront-plus-iextensions)
__Extends__: [Custom](#cdk-cloudfront-plus-custom)

### Initializer




```ts
new CustomErrorPage(scope: Construct, id: string)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*



### Properties


Name | Type | Description 
-----|------|-------------
**lambdaFunction** | <code>[Version](#aws-cdk-aws-lambda-version)</code> | <span></span>



## class DefaultDirIndex  <a id="cdk-cloudfront-plus-defaultdirindex"></a>

Default Directory Indexes in Amazon S3-backed Amazon CloudFront Origins.

use case - see https://aws.amazon.com/tw/blogs/compute/implementing-default-directory-indexes-in-amazon-s3-backed-amazon-cloudfront-origins-using-lambdaedge/

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [ITaggable](#aws-cdk-core-itaggable), [IExtensions](#cdk-cloudfront-plus-iextensions)
__Extends__: [Custom](#cdk-cloudfront-plus-custom)

### Initializer




```ts
new DefaultDirIndex(scope: Construct, id: string)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*



### Properties


Name | Type | Description 
-----|------|-------------
**lambdaFunction** | <code>[Version](#aws-cdk-aws-lambda-version)</code> | <span></span>



## class Distribution  <a id="cdk-cloudfront-plus-distribution"></a>



__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new Distribution(scope: Construct, id: string, props: DistributionProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[DistributionProps](#cdk-cloudfront-plus-distributionprops)</code>)  *No description*
  * **defaultBehavior** (<code>[BehaviorOptions](#aws-cdk-aws-cloudfront-behavioroptions)</code>)  The default behavior for the distribution. 
  * **additionalBehaviors** (<code>Map<string, [BehaviorOptions](#aws-cdk-aws-cloudfront-behavioroptions)></code>)  Additional behaviors for the distribution, mapped by the pathPattern that specifies which requests to apply the behavior to. __*Default*__: no additional behaviors are added.
  * **certificate** (<code>[ICertificate](#aws-cdk-aws-certificatemanager-icertificate)</code>)  A certificate to associate with the distribution. __*Default*__: the CloudFront wildcard certificate (*.cloudfront.net) will be used.
  * **comment** (<code>string</code>)  Any comments you want to include about the distribution. __*Default*__: no comment
  * **defaultRootObject** (<code>string</code>)  The object that you want CloudFront to request from your origin (for example, index.html) when a viewer requests the root URL for your distribution. If no default object is set, the request goes to the origin's root (e.g., example.com/). __*Default*__: no default root object
  * **domainNames** (<code>Array<string></code>)  Alternative domain names for this distribution. __*Default*__: The distribution will only support the default generated name (e.g., d111111abcdef8.cloudfront.net)
  * **enabled** (<code>boolean</code>)  Enable or disable the distribution. __*Default*__: true
  * **enableIpv6** (<code>boolean</code>)  Whether CloudFront will respond to IPv6 DNS requests with an IPv6 address. __*Default*__: true
  * **enableLogging** (<code>boolean</code>)  Enable access logging for the distribution. __*Default*__: false, unless `logBucket` is specified.
  * **errorResponses** (<code>Array<[ErrorResponse](#aws-cdk-aws-cloudfront-errorresponse)></code>)  How CloudFront should handle requests that are not successful (e.g., PageNotFound). __*Default*__: No custom error responses.
  * **geoRestriction** (<code>[GeoRestriction](#aws-cdk-aws-cloudfront-georestriction)</code>)  Controls the countries in which your content is distributed. __*Default*__: No geographic restrictions
  * **httpVersion** (<code>[HttpVersion](#aws-cdk-aws-cloudfront-httpversion)</code>)  Specify the maximum HTTP version that you want viewers to use to communicate with CloudFront. __*Default*__: HttpVersion.HTTP2
  * **logBucket** (<code>[IBucket](#aws-cdk-aws-s3-ibucket)</code>)  The Amazon S3 bucket to store the access logs in. __*Default*__: A bucket is created if `enableLogging` is true
  * **logFilePrefix** (<code>string</code>)  An optional string that you want CloudFront to prefix to the access log filenames for this distribution. __*Default*__: no prefix
  * **logIncludesCookies** (<code>boolean</code>)  Specifies whether you want CloudFront to include cookies in access logs. __*Default*__: false
  * **minimumProtocolVersion** (<code>[SecurityPolicyProtocol](#aws-cdk-aws-cloudfront-securitypolicyprotocol)</code>)  The minimum version of the SSL protocol that you want CloudFront to use for HTTPS connections. __*Default*__: SecurityPolicyProtocol.TLS_V1_2_2019
  * **priceClass** (<code>[PriceClass](#aws-cdk-aws-cloudfront-priceclass)</code>)  The price class that corresponds with the maximum price that you want to pay for CloudFront service. __*Default*__: PriceClass.PRICE_CLASS_ALL
  * **webAclId** (<code>string</code>)  Unique identifier that specifies the AWS WAF web ACL to associate with this CloudFront distribution. __*Default*__: No AWS Web Application Firewall web access control list (web ACL).



### Properties


Name | Type | Description 
-----|------|-------------
**extensions** | <code>Array<[IExtensions](#cdk-cloudfront-plus-iextensions)></code> | <span></span>



## class GlobalDataIngestion  <a id="cdk-cloudfront-plus-globaldataingestion"></a>

Ingest data to Kinesis Firehose by nearest cloudfront edge.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [ITaggable](#aws-cdk-core-itaggable), [IExtensions](#cdk-cloudfront-plus-iextensions)
__Extends__: [Custom](#cdk-cloudfront-plus-custom)

### Initializer




```ts
new GlobalDataIngestion(scope: Construct, id: string, props: GlobalDataIngestionProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[GlobalDataIngestionProps](#cdk-cloudfront-plus-globaldataingestionprops)</code>)  *No description*
  * **firehoseStreamName** (<code>string</code>)  Kinesis Firehose DeliveryStreamName. 



### Properties


Name | Type | Description 
-----|------|-------------
**lambdaFunction** | <code>[Version](#aws-cdk-aws-lambda-version)</code> | <span></span>



## class HTTP302FromOrigin  <a id="cdk-cloudfront-plus-http302fromorigin"></a>

The HTTP[302] from origin extension.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [ITaggable](#aws-cdk-core-itaggable), [IExtensions](#cdk-cloudfront-plus-iextensions)
__Extends__: [Custom](#cdk-cloudfront-plus-custom)

### Initializer




```ts
new HTTP302FromOrigin(scope: Construct, id: string)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*



### Properties


Name | Type | Description 
-----|------|-------------
**lambdaFunction** | <code>[Version](#aws-cdk-aws-lambda-version)</code> | <span></span>



## class ModifyResponseHeader  <a id="cdk-cloudfront-plus-modifyresponseheader"></a>

The modify response header extension.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IExtensions](#cdk-cloudfront-plus-iextensions)
__Extends__: [ServerlessApp](#cdk-cloudfront-plus-serverlessapp)

### Initializer




```ts
new ModifyResponseHeader(scope: Construct, id: string)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*



### Properties


Name | Type | Description 
-----|------|-------------
**eventType** | <code>[LambdaEdgeEventType](#aws-cdk-aws-cloudfront-lambdaedgeeventtype)</code> | The Lambda edge event type for this extension.
**functionArn** | <code>string</code> | Lambda function ARN for this extension.
**functionVersion** | <code>[Version](#aws-cdk-aws-lambda-version)</code> | Lambda function version for the function.



## class MultipleOriginIpRetry  <a id="cdk-cloudfront-plus-multipleoriginipretry"></a>

Multiple Origin IP Retry extension.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IExtensions](#cdk-cloudfront-plus-iextensions)
__Extends__: [ServerlessApp](#cdk-cloudfront-plus-serverlessapp)

### Initializer




```ts
new MultipleOriginIpRetry(scope: Construct, id: string, props: MultipleOriginIpRetryProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[MultipleOriginIpRetryProps](#cdk-cloudfront-plus-multipleoriginipretryprops)</code>)  *No description*
  * **originIp** (<code>Array<string></code>)  Origin IP list for retry, use semicolon to separate multiple IP addresses. 
  * **originProtocol** (<code>string</code>)  Origin IP list for retry, use semicolon to separate multiple IP addresses. 



### Properties


Name | Type | Description 
-----|------|-------------
**eventType** | <code>[LambdaEdgeEventType](#aws-cdk-aws-cloudfront-lambdaedgeeventtype)</code> | The Lambda edge event type for this extension.
**functionArn** | <code>string</code> | Lambda function ARN for this extension.
**functionVersion** | <code>[Version](#aws-cdk-aws-lambda-version)</code> | Lambda function version for the function.



## class NormalizeQueryString  <a id="cdk-cloudfront-plus-normalizequerystring"></a>

Normalize Query String extension.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IExtensions](#cdk-cloudfront-plus-iextensions)
__Extends__: [ServerlessApp](#cdk-cloudfront-plus-serverlessapp)

### Initializer




```ts
new NormalizeQueryString(scope: Construct, id: string)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*



### Properties


Name | Type | Description 
-----|------|-------------
**eventType** | <code>[LambdaEdgeEventType](#aws-cdk-aws-cloudfront-lambdaedgeeventtype)</code> | The Lambda edge event type for this extension.
**functionArn** | <code>string</code> | Lambda function ARN for this extension.
**functionVersion** | <code>[Version](#aws-cdk-aws-lambda-version)</code> | Lambda function version for the function.



## class OAuth2AuthorizationCodeGrant  <a id="cdk-cloudfront-plus-oauth2authorizationcodegrant"></a>

OAuth2 Authentication - Authorization Code Grant.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [ITaggable](#aws-cdk-core-itaggable), [IExtensions](#cdk-cloudfront-plus-iextensions)
__Extends__: [Custom](#cdk-cloudfront-plus-custom)

### Initializer




```ts
new OAuth2AuthorizationCodeGrant(scope: Construct, id: string, props: OAuth2AuthorizationCodeGrantProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[OAuth2AuthorizationCodeGrantProps](#cdk-cloudfront-plus-oauth2authorizationcodegrantprops)</code>)  *No description*
  * **authorizeParams** (<code>string</code>)  *No description* 
  * **authorizeUrl** (<code>string</code>)  *No description* 
  * **callbackPath** (<code>string</code>)  *No description* 
  * **clientDomain** (<code>string</code>)  *No description* 
  * **clientId** (<code>string</code>)  *No description* 
  * **clientPublicKey** (<code>string</code>)  *No description* 
  * **clientSecret** (<code>string</code>)  *No description* 
  * **debugEnable** (<code>boolean</code>)  *No description* 
  * **jwtArgorithm** (<code>string</code>)  *No description* 



### Properties


Name | Type | Description 
-----|------|-------------
**lambdaFunction** | <code>[Version](#aws-cdk-aws-lambda-version)</code> | <span></span>



## class RedirectByGeolocation  <a id="cdk-cloudfront-plus-redirectbygeolocation"></a>

Forward request to the nearest PoP as per geolocation.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [ITaggable](#aws-cdk-core-itaggable), [IExtensions](#cdk-cloudfront-plus-iextensions)
__Extends__: [Custom](#cdk-cloudfront-plus-custom)

### Initializer




```ts
new RedirectByGeolocation(scope: Construct, id: string, props: RedirectByGeolocationProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[RedirectByGeolocationProps](#cdk-cloudfront-plus-redirectbygeolocationprops)</code>)  *No description*
  * **countryTable** (<code>Map<string, string></code>)  The pre-defined country code table. 




## class SecurtyHeaders  <a id="cdk-cloudfront-plus-securtyheaders"></a>

Security Headers extension.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IExtensions](#cdk-cloudfront-plus-iextensions)
__Extends__: [ServerlessApp](#cdk-cloudfront-plus-serverlessapp)

### Initializer




```ts
new SecurtyHeaders(scope: Construct, id: string)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*



### Properties


Name | Type | Description 
-----|------|-------------
**eventType** | <code>[LambdaEdgeEventType](#aws-cdk-aws-cloudfront-lambdaedgeeventtype)</code> | The Lambda edge event type for this extension.
**functionArn** | <code>string</code> | Lambda function ARN for this extension.
**functionVersion** | <code>[Version](#aws-cdk-aws-lambda-version)</code> | Lambda function version for the function.



## class ServerlessApp  <a id="cdk-cloudfront-plus-serverlessapp"></a>



__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new ServerlessApp(scope: Construct, id: string, props: ServerlessAppProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[ServerlessAppProps](#cdk-cloudfront-plus-serverlessappprops)</code>)  *No description*
  * **applicationId** (<code>string</code>)  *No description* 
  * **semanticVersion** (<code>string</code>)  *No description* 
  * **parameters** (<code>Map<string, string></code>)  The parameters for the ServerlessApp. __*Optional*__



### Properties


Name | Type | Description 
-----|------|-------------
**resource** | <code>[CfnResource](#aws-cdk-core-cfnresource)</code> | <span></span>



## class SimpleLambdaEdge  <a id="cdk-cloudfront-plus-simplelambdaedge"></a>

Simple content generation.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [ITaggable](#aws-cdk-core-itaggable), [IExtensions](#cdk-cloudfront-plus-iextensions)
__Extends__: [Custom](#cdk-cloudfront-plus-custom)

### Initializer




```ts
new SimpleLambdaEdge(scope: Construct, id: string)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*




## struct AccessOriginByGeolocationProps  <a id="cdk-cloudfront-plus-accessoriginbygeolocationprops"></a>






Name | Type | Description 
-----|------|-------------
**countryTable** | <code>Map<string, string></code> | The pre-defined country code table.



## struct AntiHotlinkingProps  <a id="cdk-cloudfront-plus-antihotlinkingprops"></a>


Construct properties for AntiHotlinking.



Name | Type | Description 
-----|------|-------------
**referer** | <code>Array<string></code> | Referer allow list with wildcard(* and ?) support i.e. `example.com` or `exa?ple.*`.



## struct ConvertQueryStringProps  <a id="cdk-cloudfront-plus-convertquerystringprops"></a>


keys options.



Name | Type | Description 
-----|------|-------------
**args** | <code>Array<string></code> | The request arguments that will be converted to additional request headers.



## struct CustomProps  <a id="cdk-cloudfront-plus-customprops"></a>






Name | Type | Description 
-----|------|-------------
**code**? | <code>[AssetCode](#aws-cdk-aws-lambda-assetcode)</code> | The source code of your Lambda function.<br/>__*Default*__: Code.fromAsset(path.join(__dirname, '../lambda/function'))
**eventType**? | <code>[LambdaEdgeEventType](#aws-cdk-aws-cloudfront-lambdaedgeeventtype)</code> | The type of event in response to which should the function be invoked.<br/>__*Default*__: LambdaEdgeEventType.ORIGIN_RESPONSE
**func**? | <code>[Function](#aws-cdk-aws-lambda-function)</code> | Specify your Lambda function.<br/>__*Optional*__
**handler**? | <code>string</code> | The name of the method within your code that Lambda calls to execute your function.<br/>__*Default*__: index.lambda_handler
**includeBody**? | <code>boolean</code> | Allows a Lambda function to have read access to the body content.<br/>__*Default*__: false
**runtime**? | <code>[Runtime](#aws-cdk-aws-lambda-runtime)</code> | The runtime environment for the Lambda function that you are uploading.<br/>__*Default*__: Runtime.PYTHON_3_8
**solutionId**? | <code>string</code> | The solution identifier.<br/>__*Default*__: no identifier
**templateDescription**? | <code>string</code> | The template description.<br/>__*Default*__: ''
**timeout**? | <code>[Duration](#aws-cdk-core-duration)</code> | The function execution time (in seconds) after which Lambda terminates the function.<br/>__*Default*__: Duration.seconds(5)



## struct DistributionProps  <a id="cdk-cloudfront-plus-distributionprops"></a>






Name | Type | Description 
-----|------|-------------
**defaultBehavior** | <code>[BehaviorOptions](#aws-cdk-aws-cloudfront-behavioroptions)</code> | The default behavior for the distribution.
**additionalBehaviors**? | <code>Map<string, [BehaviorOptions](#aws-cdk-aws-cloudfront-behavioroptions)></code> | Additional behaviors for the distribution, mapped by the pathPattern that specifies which requests to apply the behavior to.<br/>__*Default*__: no additional behaviors are added.
**certificate**? | <code>[ICertificate](#aws-cdk-aws-certificatemanager-icertificate)</code> | A certificate to associate with the distribution.<br/>__*Default*__: the CloudFront wildcard certificate (*.cloudfront.net) will be used.
**comment**? | <code>string</code> | Any comments you want to include about the distribution.<br/>__*Default*__: no comment
**defaultRootObject**? | <code>string</code> | The object that you want CloudFront to request from your origin (for example, index.html) when a viewer requests the root URL for your distribution. If no default object is set, the request goes to the origin's root (e.g., example.com/).<br/>__*Default*__: no default root object
**domainNames**? | <code>Array<string></code> | Alternative domain names for this distribution.<br/>__*Default*__: The distribution will only support the default generated name (e.g., d111111abcdef8.cloudfront.net)
**enableIpv6**? | <code>boolean</code> | Whether CloudFront will respond to IPv6 DNS requests with an IPv6 address.<br/>__*Default*__: true
**enableLogging**? | <code>boolean</code> | Enable access logging for the distribution.<br/>__*Default*__: false, unless `logBucket` is specified.
**enabled**? | <code>boolean</code> | Enable or disable the distribution.<br/>__*Default*__: true
**errorResponses**? | <code>Array<[ErrorResponse](#aws-cdk-aws-cloudfront-errorresponse)></code> | How CloudFront should handle requests that are not successful (e.g., PageNotFound).<br/>__*Default*__: No custom error responses.
**geoRestriction**? | <code>[GeoRestriction](#aws-cdk-aws-cloudfront-georestriction)</code> | Controls the countries in which your content is distributed.<br/>__*Default*__: No geographic restrictions
**httpVersion**? | <code>[HttpVersion](#aws-cdk-aws-cloudfront-httpversion)</code> | Specify the maximum HTTP version that you want viewers to use to communicate with CloudFront.<br/>__*Default*__: HttpVersion.HTTP2
**logBucket**? | <code>[IBucket](#aws-cdk-aws-s3-ibucket)</code> | The Amazon S3 bucket to store the access logs in.<br/>__*Default*__: A bucket is created if `enableLogging` is true
**logFilePrefix**? | <code>string</code> | An optional string that you want CloudFront to prefix to the access log filenames for this distribution.<br/>__*Default*__: no prefix
**logIncludesCookies**? | <code>boolean</code> | Specifies whether you want CloudFront to include cookies in access logs.<br/>__*Default*__: false
**minimumProtocolVersion**? | <code>[SecurityPolicyProtocol](#aws-cdk-aws-cloudfront-securitypolicyprotocol)</code> | The minimum version of the SSL protocol that you want CloudFront to use for HTTPS connections.<br/>__*Default*__: SecurityPolicyProtocol.TLS_V1_2_2019
**priceClass**? | <code>[PriceClass](#aws-cdk-aws-cloudfront-priceclass)</code> | The price class that corresponds with the maximum price that you want to pay for CloudFront service.<br/>__*Default*__: PriceClass.PRICE_CLASS_ALL
**webAclId**? | <code>string</code> | Unique identifier that specifies the AWS WAF web ACL to associate with this CloudFront distribution.<br/>__*Default*__: No AWS Web Application Firewall web access control list (web ACL).



## struct GlobalDataIngestionProps  <a id="cdk-cloudfront-plus-globaldataingestionprops"></a>






Name | Type | Description 
-----|------|-------------
**firehoseStreamName** | <code>string</code> | Kinesis Firehose DeliveryStreamName.



## interface IExtensions  <a id="cdk-cloudfront-plus-iextensions"></a>

__Implemented by__: [AccessOriginByGeolocation](#cdk-cloudfront-plus-accessoriginbygeolocation), [AntiHotlinking](#cdk-cloudfront-plus-antihotlinking), [ConvertQueryString](#cdk-cloudfront-plus-convertquerystring), [Custom](#cdk-cloudfront-plus-custom), [CustomErrorPage](#cdk-cloudfront-plus-customerrorpage), [DefaultDirIndex](#cdk-cloudfront-plus-defaultdirindex), [GlobalDataIngestion](#cdk-cloudfront-plus-globaldataingestion), [HTTP302FromOrigin](#cdk-cloudfront-plus-http302fromorigin), [ModifyResponseHeader](#cdk-cloudfront-plus-modifyresponseheader), [MultipleOriginIpRetry](#cdk-cloudfront-plus-multipleoriginipretry), [NormalizeQueryString](#cdk-cloudfront-plus-normalizequerystring), [OAuth2AuthorizationCodeGrant](#cdk-cloudfront-plus-oauth2authorizationcodegrant), [RedirectByGeolocation](#cdk-cloudfront-plus-redirectbygeolocation), [SecurtyHeaders](#cdk-cloudfront-plus-securtyheaders), [SimpleLambdaEdge](#cdk-cloudfront-plus-simplelambdaedge)

The Extension interface.

### Properties


Name | Type | Description 
-----|------|-------------
**eventType** | <code>[LambdaEdgeEventType](#aws-cdk-aws-cloudfront-lambdaedgeeventtype)</code> | The Lambda edge event type for this extension.
**functionArn** | <code>string</code> | Lambda function ARN for this extension.
**functionVersion** | <code>[Version](#aws-cdk-aws-lambda-version)</code> | Lambda function version for the function.
**includeBody**? | <code>boolean</code> | Allows a Lambda function to have read access to the body content.<br/>__*Default*__: false



## struct MultipleOriginIpRetryProps  <a id="cdk-cloudfront-plus-multipleoriginipretryprops"></a>


Construct properties for MultipleOriginIpRetry.



Name | Type | Description 
-----|------|-------------
**originIp** | <code>Array<string></code> | Origin IP list for retry, use semicolon to separate multiple IP addresses.
**originProtocol** | <code>string</code> | Origin IP list for retry, use semicolon to separate multiple IP addresses.



## struct OAuth2AuthorizationCodeGrantProps  <a id="cdk-cloudfront-plus-oauth2authorizationcodegrantprops"></a>






Name | Type | Description 
-----|------|-------------
**authorizeParams** | <code>string</code> | <span></span>
**authorizeUrl** | <code>string</code> | <span></span>
**callbackPath** | <code>string</code> | <span></span>
**clientDomain** | <code>string</code> | <span></span>
**clientId** | <code>string</code> | <span></span>
**clientPublicKey** | <code>string</code> | <span></span>
**clientSecret** | <code>string</code> | <span></span>
**debugEnable** | <code>boolean</code> | <span></span>
**jwtArgorithm** | <code>string</code> | <span></span>



## struct RedirectByGeolocationProps  <a id="cdk-cloudfront-plus-redirectbygeolocationprops"></a>






Name | Type | Description 
-----|------|-------------
**countryTable** | <code>Map<string, string></code> | The pre-defined country code table.



## struct ServerlessAppProps  <a id="cdk-cloudfront-plus-serverlessappprops"></a>


Construct properties for ServerlessApp.



Name | Type | Description 
-----|------|-------------
**applicationId** | <code>string</code> | <span></span>
**semanticVersion** | <code>string</code> | <span></span>
**parameters**? | <code>Map<string, string></code> | The parameters for the ServerlessApp.<br/>__*Optional*__



