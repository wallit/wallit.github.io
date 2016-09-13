# Overview of Concepts

**Should you read this?** Read this if you want to understand some of the jargon used later in the documentation or why
things happen the way they do.  

## A Glossary - Kind of

In the rest of the documentation, we're going to use a few terms that you should know. It's probably easier to just read
this section than to guess or make up the definitions of these later ;)

**User Account** Your user account is what you use to log into the system.  Your user account is used to interact with 
the system as a customer.  In addition, your user account can have access to one or more properties through the management
UI.

**Property** The property is the main container for something on the web - most likely your website.  For the most part, 
you probably will have only one property.  However, if your company has many publications - and therefore many distinct
web presences - you might have multiple properties.

**Resource** A resource is something that you may want to track or control access to.  Most often, this is a single 
web page that might contain a piece of content like an article or a collection of photos.

**Unicorn** The realest horse in the entire world.

**Management API** This is the primary API used for accessing property information and managing resources and subscribers.

**Access API** This API is an speed-optimized API that is used only for determining if the current user has access to a resource.

**Paywall** This is almost an generic word used to indicate our access control mechanism.  This might manifest itself transparently,
through an embedded iframe, or with a redirect.

## Property Management

There are two ways to view property settings and information.  You can access some of the property information through
the Management API.  The remaining information can be viewed using the management UI.  To change settings on the property,
you can only use the management UI at this time.

## Resource Management

There are three ways that resources can be created or modified.  (*does [The Count](https://en.wikipedia.org/wiki/Count_von_Count) impression* 3 Ways... ah ah ah!)

**Management API** The Management API can be used to create resources or edit them.  You might use this in conjunction with a 
web application or CMS to create new resources whenever your authors or editors publish resources to the web.

**Management UI** You can create and edit resources through the management UI.

**Dynamic Resource Creation** If this option is turned on for your property, the first time a resource is queried through
Wallit (via the javascript or the REST API), a resource will be created for you automatically.  @todo add a descriptor or link to more details about this

## Resource Access Control

When we say "resource access control" sometimes programmers (or BOFH) will think "resource access restrictions" - but that's not necessarily
the case.  Part of your business model might be to offer a meter (or quota) of free articles before access is restricted.  In order
to restrict premium content directly or to properly invoke the meter, a resource access event must be tracked.  That's what 
we mean when we say "resource access control." 

There are two mechanisms that can be used to do a resource access event query.

**Access API** Using the API directly is useful for back-end security scenarios or redirects.

**Javascript Library** The javascript library performs an access control check as well through a front-end implementation.

## Types of Resource Control

We provide a javascript (front-end) and REST API (back-end) mechanism for content protection.  But no, that's not all! You
can even combine these to implement a hybrid approach.

**Javascript Library / Front End**  The javascript library creates an embedded paywall that restricts access to your content.  
You choose where it's placed in relation to the beginning of your content and it takes care of hiding the rest of it.  The 
content was technically still loaded, but the average user would not be able to access it.  You, dear programmer, probably 
could get around this really quickly though.

**REST API / Back End**  The powerhouse. The workhorse.  The secure source.  The API allows you to make requests for access
entirely away from the user's browser and then issue a redirect to a paywall screen if need be.  This is the most secure 
way of doing it because the user can't bypass the paywall in their browser at all.  But, it doesn't allow you to use the
embedded paywall - which is pretty sweet, and you probably want to use.  So... what's left?

**Hybrid Approach**  The hybrid is a combination between the front and back-end code.  First, the backend checks to see
if the user has access to this resource. If so, provide the entire resource and everyone goes on their merry way.  If the
user needs to have the resource restricted, the back end only sends the 'preview' or teaser content.  Then, the front-end
javascript embedded paywall is displayed.  Once a user authenticates, pays or does some other mechanism for granting access,
the javascript paywall can do an ajax request to get the remaining content. The backend checks to make sure the user *now* has
access - and if so, releases the remaining part of the resource.  Embedded paywall goes away and the full resource is now visible.
If that doesn't make sense, don't worry - we'll have an example later on; hopefully that will clear it up. (If this technical writing 
*does* make sense, we'd like to seize this day to thank our professor, Dr. John Keating, for his extraordinary help!)

## External Subscriber Management/Synchronization

Just like a hot tub, we know you might just be dipping your toe in when it comes to our relationship.  But after we get to know each other better, 
we're confident you'll trust us to take care of your most prized possessions: your subscribers.  Not only can we integrate 
your current subscription base into our system, we can handle all new subscriptions as well.  (Can you imagine? Less systems to maintain and 
only one integration point? Wow! Kazaam!) This is done through our external subscriber management services.  Consider us your subscription butler.

**External Subscriptions** If you have print subscriptions (or any other subscription or access system), you may want to 
give some sort of preferential access to your online content.  This could take the form of free access to premium content
or the option to purchase digital content at a discount.  Wallit can provide options to make this integration
as easy as possible.

**External Fulfillment Subscriptions** If you're anything like us, you love going to three to five different interfaces
to manage your access to a single publication. </sarcasm> But seriously, that would be super annoying.  That's why we
developed a system to integrate with your external fulfillment services and manage your other subscriptions (like print).
It may take a little integration - but we provide a number of callbacks and APIs that can integrate Wallit with your
other subscription service.  This means the customer only has one place to do their dirty work.

## What's Next?

Time to move on to the [overview of user interfaces](./overview-of-interfaces.md) which will give you a better idea of what
user interfaces and programmer interfaces we have - and why you should care.

[Go to Overview of User Interfaces](./overview-of-interfaces.md)
