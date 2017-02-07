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

Before integrating Wallit, be sure you've followed the basic guidelines for [creating a valid AMP page](https://www.ampproject.org/docs/get_started/create.html).

### Basic Setup

To use Wallit's paywall, add a reference to the amp-access extension and, depending on your requirements, the amp-mustache extension. Next, define the amp-access settings. Use your Access API key in the URLs - the example below has an API key of `b865156f-9e0d-48b6-a2a0-097456f689ec`. Everything else can be copied verbatim from the example below - AMP will automatically populate the variables like `READER_ID` when it processes the page.

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

### Defining Protected Content

Use the `amp-access` attribute to control which parts of the page are publicly accessible and which are protected. The main thing to check if the `AccessReason` value. If it's set to `Deny`, the user doesn't have access to the resource.

Here's an example:

```html
<div amp-access="AccessReason = 'Deny'" amp-access-hide>
	You do not have access to this content.
</div>
<div amp-access="NOT (AccessReason = 'Deny')" amp-access-hide>
	This is protected content.
</div>
```

To send the user to the paywall, call `tap:amp-access.login-log-in`. To log a user out, call `tap:amp-access.login-log-out`. For instance:

```html
<div amp-access="AccessReason = 'Deny'" amp-access-hide>
  <p>To read more, you must purchase this page.</p>
  <button on="tap:amp-access.login-log-in">Purchase</button>
</div>
```

To display a "Log Out" button if the user is authenticated:

```html
<div amp-access="NOT IsAnonymousUser" amp-access-hide>
  <template amp-access-template type="amp-mustache">
	<button on="tap:amp-access.login-log-out">Log Out</button>
  </template>
</div>
```

### Metering

If you use metered pricing, you can display information about the user's meter by accessing the `Quota` object. For instance:

{% highlight html%}
{% raw %}
<section amp-access="Quota.IsEnabled">
  <template amp-access-template type="amp-mustache">
	You are reading page {% raw %}{{Quota.HitCount}}{% endraw %} out of {% raw %}{{Quota.AllowedHits}}{% endraw %}.
  </template>
</section>
{% endraw %}
{% endhighlight %}

```html
<section amp-access="Quota.IsEnabled">
  <template amp-access-template type="amp-mustache">
	You are reading page {% raw %}{{Quota.HitCount}}{% endraw %} out of {% raw %}{{Quota.AllowedHits}}{% endraw %}.
  </template>
</section>
```

## External Keys and Canonical URLs

Wallit's access control mechanisms assume every resource has an API key and a resource/external key associated with it. This combination of keys uniquely identifies a resource, which allows Wallit to determine access rights.

With AMP, there's no way to specify an external key from the client-side (as there is with Wallit's JavaScript Library). Instead, Wallit uses the canonical URL of the document as an identifier, looking for an existing resource with that same URL. If there is more than one resource defined with that URL, Wallit will pick one to use. Note that the canonical URL must exactly match the URL stored for a resource.

Wallit's dynamic resource creation relies on using a `script` tag to convey detailed metadata, which isn't allowed on AMP pages. When dynamic resource creation occurs for an AMP page, the canonical page will be spidered, if provided. This means that additional metadata can be provided on the canonical page. It also means that the canonical page and the AMP page will be treated as a single resource.

## Unsupported Wallit Features When Using AMP

Some Wallit features are not compatible with or are ignored on AMP pages:

Embedded paywall

Embedded wallet

Embedded confirmation

Ad blocker detection, ad blocker metering, and ad blocker pricing

