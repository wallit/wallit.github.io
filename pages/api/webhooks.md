---
title: Webhooks
permalink: /api/webhooks
layout: api
---
# Callbacks and Web Hooks

***Should you read this?** If you want some insight into the process at Wallit or need to know when events happen, then yes, read this.*

At Wallit, we use the term callback and webhook interchangeably.  Basically, a webhook is our way of letting your system know
that an event has happened.  From a very high level, this is what's up: you add a callback URL to the system and then we GET to that URL
whenever one of a few events happen.  In that GET is a callback type and a token.  Then, you head over to the [REST API]({{system.baseurl}}/api/rest),
send over the token and receive the data that we have available for you.

## The Callback URL / Webhook

The first question you probably have is "How do I specify the callback URL?" It's funny you asked that - that's exactly what this 
section is about.

### URL Usage / Response

First, let's talk about how the URL is used.  There are a number of events that can generate callbacks, as detailed in the section below.
Once you've registered your callback URL, every single event is sent to that callback URL.  You will probably find that you'll
ignore some specific callback types, while processing others.  Callback results are valid for 24 hours from the time they were issued.

#### Our Request Format

Wallit will execute a `GET` request to your callback URL.  The following are the parameters that may accompany the request.

| Parameter | Type | Description |
| --------- | ----------- |
| `CallbackType` | String | Indicates which callback type this is |
| `CallbackToken` | GUID | Needed as part of your request to the REST API for the callback results |
| `ExternalSubscriberImportID` | GUID | Indicates which import has completed, if this is a callback of type `ExternalSubscriberImportCompleted` |
| `ExternalSubscriberExportID` | GUID | Indicates which export has completed, if this is a callback of type `ExternalSubscriberExportCompleted` |
| `ExternalFulfillmentSubscriptionExportID` | GUID | Indicates which export has completed, if this is a callback of type `ExternalFulfillmentSubscriptionExport` |

The following are the types of callbacks that you may receive from Wallit.

| Callback Type | Description |
| ------------- | ----------- |
| `ExternalSubscriberLinked` | An external subscriber is linked to their Wallit account |
| `EligibleSubscriptionPurchased` | A Wallit user purchases a subscription that was available because they have an external subscription as well |
| `ExternalSubscriberImportCompleted` | An external subscriber import has finished |
| `ExternalSubscriberExportCompleted` | An external subscriber export has finished and the download is available |
| `ExternalFulfillmentSubscriptionExport` | An external fulfillment subscriber export has finished and the download is available |

#### Your Response

It is important to return a `200 OK` HTTP response code to the webhook request.  Other status codes will indicate a failure.
If the request fails, Wallit will attempt to make that same request 2 additional times within about 2 minutes.  After 3 total failures,
that particular request callback will fail.  This failure does not stop or cancel any other existing process or webhook.  

We do not expect any body content in your response.  However, you may always send back a [well-formed JSON knock-knock joke](https://github.com/finnp/knock-knock-jokes)
if you like.  Or don't.  Either way, up to you.

### Where to Add the URL

Now that you know how it works, bet you want to try it out, huh?  Adding a callback URL is easy.  

When you create a Management API Key, there is a field to enter a Callback URL.  This is where you can add the URL that you
want to receive Wallit callbacks at.  If you have more than one Management API key, simply use the first one's callback URL field.
If you have multiple systems that handle callbacks, you can add a unique URL into each new management API key.  (Please note, these 
callback URLs are not tied to that specific key's actions.  The association is purely a legacy method of organization.)

Your URL must be a valid SSL URL beginning with `https` and have a valid certificate.


## What's Next?

You're actually done! That's all we have.  But maybe you're looking to start over your amazing documentation journey?  If so, we've got
an idea for you.  Click the button below...

[Magic Button for Starting Over →]({{site.baseurl}}/){: .btn}
