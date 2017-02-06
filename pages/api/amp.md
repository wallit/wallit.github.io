---
title: Using AMP (Accelerated Mobile Pages)
permalink: /api/amp
layout: api
---

_This is a draft of a feature that's not yet publicly available._

# Using AMP (Accelerated Mobile Pages)

The overarching goal of [AMP](https://www.ampproject.org) is to get pages to load faster on mobile devices. Part of the way that's accomplished is by disallowing third-party scripts that might delay rendering. This means that the Wallit JavaScript Library can't be used.

Wallit supports the [amp-access](https://www.ampproject.org/docs/reference/components/amp-access) extension for AMP. This allows you to create valid AMP documents that enforce access control and paywall functionality through Wallit.

## Implementing amp-access

First, you [create a valid AMP page](https://www.ampproject.org/docs/get_started/create.html).

Next, add a reference to the amp-access extension and, depending on your requirements, the amp-mustache extension.

Next, define the amp-access settings. Use your Access API key in the URLs - the example below has an API key of b865156f-9e0d-48b6-a2a0-097456f689ec.

```html
<script async custom-element="amp-access" src="https://cdn.ampproject.org/v0/amp-access-0.1.js"></script>
<script async custom-template="amp-mustache" src="https://cdn.ampproject.org/v0/amp-mustache-0.1.js"></script>

<script id="amp-access" type="application/json">
  {
	"authorization": "https://accessapi.wallit.io/api/AmpResourceAccess/b865156f-9e0d-48b6-a2a0-097456f689ec/Authorization?readerID=READER_ID&resourceURL=CANONICAL_URL&random=RANDOM",
	"pingback": "https://accessapi.wallit.io/api/AmpResourceAccess/b865156f-9e0d-48b6-a2a0-097456f689ec/Pingback?readerID=READER_ID&resourceURL=CANONICAL_URL&random=RANDOM",
	"login": {
		"log-in": "https://accessui.wallit.io/Paywall/AmpIndex?apiKeyID=b865156f-9e0d-48b6-a2a0-097456f689ec&readerID=READER_ID&resourceURL=CANONICAL_URL&referrerURL=DOCUMENT_REFERRER&returnURL=RETURN_URL",
		"log-out": "https://accessui.wallit.io/Paywall/ExternalLogOut?readerID=READER_ID&returnURL=RETURN_URL"
	},
	"authorizationFallbackResponse": {
		"error": true,
		"AccessReason": "Deny",
		"IsAnonymousUser": true
	  }
  }
</script>
```


## Dynamic Resource Creation

## Unsupported Features



