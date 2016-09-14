# Overview of User Interfaces

**Should you read this?** Read this if you want to know what kind of interfaces we have, and why you might want to use
them.  Nothing worse than hearing "I was on the Access UI screen" from a customer and not knowing what they were talking about!

As a developer, it's easy to fall into the habit of considering user interfaces as only the screens we can see.  However, 
we consider user interfaces as both our web pages, APIs and SDKs. It's important to get an overview of all the user interfaces
that Wallit provides so that you can not only use and manage your Wallit account, but make the most intelligent choice for
your integration as well.  Stop reading this paragraph now and start scrolling and looking at headlines already.

## Manage UI

This is the main website to the Wallit user and merchant.  You can visit this at [manageui.wallit.io](https://manageui.wallit.io) - 
 or basically from any sign up or login link on [wallit.io](https://wallit.io).  This is split into two parts: consumer and merchant.

**Consumer** The consumer uses this interface the sign up for Wallit and fund their Wallit account.  They can view their 
purchases, subscriptions and account balance.  This is generally the only interface that the consumer is aware of - but
it's not the only one they may interact with in the lifecycle of using the Wallit software.

**Merchant** As you've probably figured out, this role is the one you're most likely playing right now.  The merchant side 
of the web page allows access to the API keys, paywall instances and configuration of the property settings.  In addition,
this exposes reports, subscription data and transaction history.  You will use this interface to configure your property,
set up pricing groups or subscription groups, and verify resource creation and access.

## Access UI

This is a speed-optimized set of web pages that are used to serve the paywall.  Pages from this user interface are served 
from the [accessui.wallit.io](https://accessui.wallit.io) domain.  There is no need ever to surf here directly.  It will 
always be used as part of a different, managed workflow involving the paywall.  There are two ways that a user might 
interact with this interface.  

The embedded paywall (and smart wallet) is served from this user interface.  Since the embedded paywall is loaded through an iframe, though,
this URL will not be visible.

The second way a user may interact with this interface is when a paywall is set to use redirection.  The user is sent to
this interface to finish their authentication, authorization or purchase.  In this case, the user would see the URL.

As a developer, you will most likely never interact directly with this interface either.

## REST API

For programmatic and back-end access, Wallit exposes two REST APIs.  Depending on your needs, you may use one or both of
these APIs.

**Access API** This API is used only for determining access to specific resources. It resides at [accessapi.wallit.io](https://accessapi.wallit.io) and 
is optimized for speed.  This API is used behind the scenes with our javascript library (explained later) as well as for 
server-side access control.  Basically, can the current visitor get at this resource; true or false?  That's what this API does.  
It's black and white - kind of like what we assume one of our engineers sees daily - although he swears it's just a red/green "deficiency."

**Manage API** The manage API contains a subset of the functionality found in the Manage UI.  This API interface will 
allow you to automatically create resources, edit them, manage pricing and subscription groups, and more.  This API is
most likely implemented in some sort of back-end system in your application.  For example, you might have users create
content through a WYSIWYG type interface on your system, and when it's published, issue a request to this API to create 
an associated resource with the proper access and pricing information.  This API is the real powerhouse of any automation.

## Callbacks

Certain Wallit events will trigger a POST to an external URL.  This system is referred to as the callback system.  Currently,
the callback system is limited to a few events surrounding external subscriber import, export, linking and purchases.  The 
callback system issues a callback POST to your URL in the form of an event type and a token.  Then, you may retrieve the data
from the Manage API using this event name and token.  

## Javascript Library

The Javascript library is responsible for the client-side or browser-based functionality.  This library allows you to do various
integrations with Wallit data to customize your user experience, can create the embedded paywall, can issue a redirect or modal
paywall, handles the smart wallet, and any number of other things.  There's a whole lengthy section of the documentation for
this particular library.

As we covered earlier, there are a number of ways to do resource protection and access control with Wallit.  All methods use
the Javascript library except for a server-side only redirect option.  Client-side and hybrid approaches still require the 
javascript library.  

## SDKs

Without a doubt, programmers always love trying to figure out how to use a new API.  The challenges, the research, the
trial and error - oh man!  So delightful!

Although the previous statement is meant to be a joke, we do take our APIs very seriously.  We hope that they're easy to use 
and you have no problems implementing them.  (If you do, make sure to let us know!)  But sometimes, it's just nice to 
save time and use a Software Development Kit that abstracts the API calls for you.  We provide a SDK in two different languages
to help you jump start your Wallit integration.  What makes this so cool is that you don't have to know the exact API 
end points to use, which parameters to send, or even understand the tokenization and authentication scheme  It's all handled
for you.  Simply pass in some API keys and you're good to go.

**PHP SDK** Our [PHP SDK](https://github.com/wallit/wallit-php-api) allows you to integrate your Access API and Manage API
calls into your application by configuring a service and using PHP objects and classes.  You send in a known data request object
and receive a known data response object.

**NodeJS SDK** The [NodeJS SDK](https://github.com/nodejs) makes integration with NodeJS easier.  Just like the PHP SDK, this
abstracts calls to the Access API and the Manage API by using a javascript service object and data class.  The response is
returned to a callback function in the form of a plain JSON object.

## What's Next?

Now that you have an idea of the main interfaces and concepts, it's time to move on to some of the common scenarios - basically
the tldr; version of the documentation.

[Go to Common Scenarios](./common-scenarios.md)
