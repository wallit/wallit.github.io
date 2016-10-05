---
title: REST API
permalink: /api/rest
layout: api
---
# REST API

***Should you read this?** You probably will need to at some point.  This is all about server-side API integration.  This 
is useful if you want to create or manage resources on the back-end, or if you want to do server-side access control.*

## What APIs Are Available?

If you haven't had a chance to check out the [REST API Interface Overview]({{site.baseurl}}/overview-of-user-interfaces#rest-api)
you probably should do that right now.  We'll wait.

Ok - now that that's all sorted, let's talk about the APIs or endpoints.  The Wallit REST API is really split into two
main APIs with multiple endpoints on each.  Both Access API and Manage API communicate with the same protocols and message
formats.  The only thing different is the type of API key you use for each.  **Remember, use the proper API Key from the Manage UI
for each of the APIs.**

## API Request Format

There are three headers that are required with each request: `Accept`, `Timestamp` and `Authentication`.  If your request
contains a payload, an additional `Content-Type` header is needed.

### Message Data Format

The APIs support JSON data.  When making an HTTP request to the API, use the following two headers to indicate JSON:

| Header Name | Value |
| ----------- | ----- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

*If your system does not currently support JSON, please contact us for personal assistance and support.*

### Timestamp

Each request requires a `Timestamp` header in UTC [RFC1123](https://tools.ietf.org/html/rfc1123) format. Please make sure that your
server time is correct.  We accept requests that are dated within 5 minutes before or after the current time maximum.  Otherwise,
your request will be rejected with a HTTP 401 or HTTP 403 error.

### Authentication

The `Authentication` header is required on each request.  The format is the current API key, a colon, and then the authentication token.
Requests without an Authentication header, without a token, or with an invalid token, will result in an HTTP 401 error.

Each token is created by a hash calculated for each request.  

To create the token, follow the following steps:

1) Join the four strings [described below](#token-values) and join them with a new line character  
2) Hash the string using Binary SHA-256 HMAC using the secret key associated with the API key you're using  
3) Base64 encode the output

For example, you might see something like this:

`Authentication: BB772A5B-1E7B-461C-8AC6-CA9E6E2FD2B9:y8s48zxCy62NXUFe5699i7vktOpLvDnt2TCifpZDzJw=`

#### Token Values

The following table describes the four pieces of content that are required to create the hash.

| Item | Description | Example |
| ---- | ----------- | ------- |
| HTTP Method | The method used for this request in all caps. | `POST` |
| Timestamp | The timestamp described [above](#timestamp). | `Wed, 05 Oct 2016 15:08:05 GMT` |
| URI of Request | Convert this value to all lower case.  Do not include any query strings. | `/api/property/bb772a5b-1e7b-461c-8ac6-ca9e6e2fd2b9` |
| Query Parameters | Ampersand-joined alphabetically ordered list of parameters used for this request. Both names and values should be lowercase and *not* url-encoded. | `byline=guy smiley&externalkey=1234&name=my article` |

**Looking to validate your token?** Good news - we've built a tool that can help you.  
[Go to the Token Validation Tool]({{site.baseurl}}/token).

## API Endpoint Documentation

This section describes the API URL's and endpoints for Wallit.

### Resource Access API

The Resource Access API is used for access control, validating a user’s access to content.

{% include swagger-block.html baseurl="https://accessapi.wallit.io" swagger=site.data.accessapi %}

### Resource Management API

This API is used for managing resource data, providing merchants access to certain resource-level configuration without needing to use the Management UI.

#### `https://manageapi.wallit.io`

@todo swagger parsing

### API Special Notes

When executing a PUT request on a resource, it will either create or update the item. Any subsequent calls with that 
external ID will update only the parameters sent. For example, if the next request contains only the Title property, 
all other properties will remain the same, only the Title will be changed. The ExternalKey cannot be changed with this request.

To change the pricing group that a resource belongs to, the pricing group ID should be sent. 
All other data sent in a PricingGroup object will be ignored. For instance, the following would change the pricing group:

```json
{
  "PricingGroup": {
    "PricingGroupID": "15bf02c5-d106-e411-acf1-bc305bd0d54e"
  }
}
```

Pricing tiers are stored as an array called ResourcePricingTiers. If that object is null or not-defined, pricing tiers are not updated; 
if that array is present, then all existing pricing tiers are replaced by the array. So if any pricing tiers are set, then all pricing tiers must be set.
For example:

```json
{
  "ExternalKey": "Article1",
  "ResourcePricingTiers": [
    {
      "Tier": 0,
      "Price": 0.00
    },
    {
      "Tier": 2,
      "Price": 0.18
    },
    {
      "Tier": 5,
      "Price": 0.50
    },
    {
      "Tier": 10,
      "Price": 0.72
    }
  ]
}
```

## Example API Request

Sometimes a good example really helps out.  Let's run through a scenario.

@todo example here

## What's Next?

Now that you know how to send and receive information on your own time, what about when we do things?  

[Callbacks and Webhooks →]({{site.baseurl}}/api/webhooks){: .btn}
