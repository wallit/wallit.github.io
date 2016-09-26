---
title: Javascript Library
permalink: /api/js
---
# Javascript Library and API

***Should you read this?** This is all about the javascript library and API.  If you're using the embedded paywall or 
any other client-side features, then yes, yes you should read this.  If not, you don't NEED to read it - but you might still
enjoy it. I mean, people enjoy long technical documentation, right?*

## Configuration of the Access API Key

In order to use the Javascript library, you must have a public "Access API" key.  You can create that by following
[these instructions](https://wallit.desk.com/customer/portal/articles/2577381-creating-or-updating-your-access-api-key). 
Remember to add your domain in the "Allowed Origins" field otherwise the browser security will
restrict the Wallit javascript from executing.  If you have multiple paywalls for different portions of your site, you 
will need to use the corresponding Access API Key for that paywall.

## Adding the Javascript Library to Your Page

The javascript library should be added on each individual page that you want tracked and managed by Wallit.  (Even if a 
page is not a resource you might charge for, then add the Free pricing model to it.  This will make your analytics and 
reports the most accurate.)  If you're unsure if a page should have the Wallit javascript on it, you can contact us and 
we can help direct your efforts.  Adding this javascript library to your pages is not necessary if you're using server-side
protection only.

Insert the script `https://cdn.wallit.io/paywall.min.js` in the `<head>` of your page.  Immediately following it, add
the initialization and any other configuration options in another script block.  **It's important to add these to the head
element of your page.** We do some asynchronous requests that should be kicked off as soon as possible.  If you put this 
code further down in the body of the page, your user experience may suffer and the execution may not be predictable.

> When using some automated tools to analyze your page speed and performance, Wallit might be the target of a negative
marking. We understand - but we're not all that evil!  Every rule for performance has some exceptions, and proper protection
of content using Wallit is one of them. We care about performance and keep an eye on it; we don't want to slow down your site.

Enough of this talk! Show me the code!!

```html
<head>
  <title>Our Website</title>
  <script src="https://cdn.wallit.com/paywall.min.js"></script>
  <script type="text/javascript">
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec');
  </script>
</head>
```

The only exciting thing here is the call to `wallit.paywall.init()` - so we'll talk about that next.

## Javascript Library Initialization

All of the configuration options that you want to specify are passed in as a second parameter of the `init()` method call as
a standard javascript object.  For example:

```javascript
wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
    "mobileMaxWidth": 300
});
```

**Important** While most of the configuration options for this paywall can be specified in the Manage UI, any options sent 
using the configuration parameter override them.  This is cool for you, dear developer - but don't forget about any people 
in your company that might be making changes to the Manage UI, and expecting things to change in the paywall. If you override 
them with the code, they might not get their desired results.  Because of this, we suggest applying your changes to the paywall
settings in the Manage UI solely - unless it's absolutely necessary to override them in the code.

So, let's take a look at all the key/value pairs of this configuration object!

### Javascript Library Initialization Options

The following section illustrates the options to the javascript configuration object for the second parameter of the `init()` method call.

#### `init()` Top Level Object

{% include option-description.html 
    key="resourceKey" 
    description="The external key or resource key used to identify this resource in Wallit."
    default="The right-most 50 characters of the current URL.  Non-supported characters will be replaced with a dash (-)."
    requirements="<= 50 characters;;allowed characters: <code>a-z</code>, <code>A-Z</code>, <code>0-9</code>, <code>-</code>" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        resourceKey: '52458' // perhaps the internal ID of your content
    });
    "
%}

{% include option-description.html 
    key="resourceURL" 
    description="The full URL for this resource."
    default="The current URL"
    requirements="RFC 1738 valid full URL" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        resourceURL: 'https://my-domain.com/my-article.html'
    });
    "
%}

{% include option-description.html 
    key="desktopPaywallType" 
    description="The type of paywall to display at desktop resolutions, basically sizes larger than the `mobileMaxWidth`"
    default="The setting specified in Manage UI for this paywall."
    requirements="Must be exactly one of the three available values."
    enum="Modal;;Redirect;;Embedded"
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        desktopPaywallType: 'Redirect'
    });
    "
%}

{% include option-description.html 
    key="mobilePaywallType" 
    description="The type of paywall to display at mobile resolutions, basically sizes smaller and equal to `mobileMaxWidth`"
    default="The setting specified in Manage UI for this paywall."
    requirements="Must be exactly one of the three available values."
    enum="Modal;;Redirect;;Embedded"
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        mobilePaywallType: 'Redirect'
    });
    "
%}

{% include option-description.html 
    key="mobileMaxWidth" 
    description="Resolutions in pixels less than or equal to this will be considered mobile."
    default="The setting specified in Manage UI for this paywall."
    requirements="Positive integer;;Do not include px suffix"
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        mobileMaxWidth: 450
    });
    "
%}

{% include option-description.html 
    key="closeURL" 
    description="The URL that the user will be redirected to if they close a paywall of type `Modal` or `Redirect`"
    default="The previous page in their browser's history."
    requirements="RFC 1738 valid full URL" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        closeURL: 'https://your-site.com/canceled-paywall.html'
    });
    "
%}

{% include option-description.html 
    key="accessGranted" 
    description="This function is called when the user is granted access to the current resource."
    requirements="function signature: `function(resourceAccessData)`"
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        // update our custom text box with the reason information
        accessGranted: function(resourceAccessData) {
            var text = '';
            switch (resourceAccessData.AccessReason) {
              case 'Quota':
                var used = resourceAccessData.Quota.HitCount,
                    allowed = resourceAccessData.Quota.AllowedHits;
                text = 'You have viewed ' + used + ' of your ' + allowed + ' pages.';
                break;
              case 'Subscription':
                text = 'Your subscription expires on ' + resourceAccessData.ExpirationDate + '.';
                break;
              case 'Purchase':
                text = 'You purchased unlimited access to this page.';
                break;
              case 'Free':
                text = 'This page is available for free.'
                break;
              case 'PropertyUser':
                text = 'You are an admin, manager, or guest of this property.'
                break;
            }
            document.querySelector('#iMonezaAccess').textContent = text;
        }
    });
    "
%}

{% include option-description.html 
    key="accessDenied" 
    description="This function is called when the user is denied access to the current resource."
    requirements="function signature: `function(resourceAccessData)`"
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        // Update a message with a friendly message.
        accessDenied: function(resourceAccessData) {
            var salutation = resourceAccessData.IsAnonymousUser ? 'friend' : resourceAccessData.FirstName;
            var text = 'Hello ' + salutation + '! It looks like you don't have access to this page. ';
                text += 'Never fear! We have some great subscription and purchase options available.';
            document.querySelector('#friendlyUpsellIndication').textContent = text;
        }
    });
    "
%}

{% include option-description.html 
    key="getOriginalURL" 
    description="This function returns a full URL that points to this resource.  This is used when redirection occurs (to return a user to a resource after purchase)."
    default="The current URL using `document.URL`"
    requirements="function signature: `function()`"
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        // Update a message with a friendly message.
        getOriginalURL: function() {
            // return the URL, but make the page scroll to the success message ID/anchor
            return document.URL + '#successMessage';
        }
    });
    "
%}

{% include option-description.html 
    key="getAccessMessage" 
    description="This function replaces the embedded wallet's logic to determine the text of the access method displayed near the lock element.  See [embeddedWallet](#embeddedWallet-object) for other customization options."
    default="Built-in logic that uses the values of the `embeddedWallet` options."
    requirements="function signature: `function(resourceAccessData)`"
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        // You do not want to update the embedded wallet with a message
        getAccessMessage: function(resourceAccessData) {
            return ''; // empty message
        }
    });
    "
%}

{% include option-description.html 
    key="embeddedAdBlockerDetection" 
    description="An object that contains settings for the adblock detection service."
    default="The setting specified in Manage UI for this paywall."
    requirements="Please see the [embeddedAdBlockerDetection](#embeddedadblockerdetection-object) object below." 
%}

{% include option-description.html 
    key="embeddedPaywall" 
    description="An object that contains settings for the embedded paywall."
    default="The setting specified in Manage UI for this paywall."
    requirements="Please see the [embeddedPaywall](#embeddedpaywall-object) object below." 
%}

{% include option-description.html 
    key="embeddedWallet" 
    description="An object that contains settings for the embedded wallet."
    default="The setting specified in Manage UI for this paywall."
    requirements="Please see the [embeddedWallet](#embeddedwallet-object) object below." 
%}

{% include option-description.html 
    key="embeddedConfirmation" 
    description="An object that contains settings for the embedded success message."
    default="The setting specified in Manage UI for this paywall."
    requirements="Please see the [embeddedConfirmation](#embeddedconfirmation-object) object below." 
%}

{% include option-description.html 
    key="modalFrame" 
    description="An object that contains settings for the modal paywall display."
    requirements="Please see the [modalFrame](#modalframe-object) object below." 
%}

{% include option-description.html 
    key="modalPaywall" 
    description="An object that contains settings for the modal paywall actions."
    requirements="Please see the [modalPaywall](#modalpaywall-object) object below." 
%}




Below, you'll find the details for each key that contained an object for its configuration.

#### `embeddedAdBlockerDetection` Object

{% include option-description.html 
    key="element" 
    description="The CSS selector of an element to place the AdBlocker title and message."
    default="The setting specified in the Manage UI for this paywall."
    requirements="A valid CSS selector" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        embeddedAdBlockerDetection: {
            element: '#customAdBlockerMessageBox'
        }
    });
    "
%}

{% include option-description.html 
    key="zIndex" 
    description="If you do not use the custom `element` property, use this to specify a different CSS zIndex for the element Wallit uses."
    default="200100"
    requirements="Integer" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        embeddedAdBlockerDetection: {
            zIndex: 300
        }
    });
    "
%}

{% include option-description.html 
    key="openWarning" 
    description="When the Ad Blocker action is set to 'Show Warning', this function executes allowing you to customize the user experience.  Instead of the Wallit dialog box, you can control your own."
    default="Wallit executes an internal function to bind the message to the `element` option."
    requirements="function signature: `function(title, message)`" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        embeddedAdBlockerDetection: {
            openWarning: function(title, message) {
                document.querySelector('#adblockerWarningTitle').textContent = title;
                document.querySelector('#adblockerWarningFullMessage').textContent = message;
            }
        }
    });
    "
%}

{% include option-description.html 
    key="closeWarning" 
    description="When using `openWarning`, this function is used to remove your custom data or close the dialog."
    default="Wallit executes an internal function to remove the warning."
    requirements="function signature: `function()`" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        embeddedAdBlockerDetection: {
            closeWarning: function() {
                document.querySelector('#adblockerWarningTitle').textContent = '';
                document.querySelector('#adblockerWarningFullMessage').textContent = '';
            }
        }
    });
    "
%}

{% include option-description.html 
    key="openDialog" 
    description="When the Ad Blocker action is set to 'Require Disable', this function executes allowing you to customize the user experience.  Instead of the Wallit dialog box, you can control your own."
    default="Wallit executes an internal function to bind the message to the `element` option."
    requirements="function signature: `function(title, message)`" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        embeddedAdBlockerDetection: {
            openDialog: function(title, message) {
                document.querySelector('#adblockerMessageTitle').textContent = title;
                document.querySelector('#adblockerMessageFullMessage').textContent = message;
            }
        }
    });
    "
%}

{% include option-description.html 
    key="closeDialog" 
    description="When using `openDialog`, this function is used to remove your custom data or close the dialog."
    default="Wallit executes an internal function to remove the dialog."
    requirements="function signature: `function()`" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        embeddedAdBlockerDetection: {
            closeDialog: function(title, message) {
                document.querySelector('#adblockerMessageTitle').textContent = '';
                document.querySelector('#adblockerMessageFullMessage').textContent = '';
            }
        }
    });
    "
%}

{% include option-description.html 
    key="onWarningOpened" 
    description="When the Ad Blocker action is set to Show Warning, this function executes after the warning has opened, assuming you haven't overridden `openWarning`"
    requirements="function signature: `function(title, message)`" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        embeddedAdBlockerDetection: {
            onWarningOpened: function(title, message) {
                // send an event to Google Analytics (ga)
                ga('send', 'event', 'Paywall', 'AdBlockerWarning', 'displayed');
            }
        }
    });
    "
%}

{% include option-description.html 
    key="onWarningClosed" 
    description="When the Ad Blocker action is set to Show Warning, this function executes if the user closes the warning, assuming you haven't overridden `openWarning` or `closeWarning`"
    requirements="function signature: `function()`" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        embeddedAdBlockerDetection: {
            onWarningClosed: function() {
                // send an event to Google Analytics (ga)
                ga('send', 'event', 'Paywall', 'AdBlockerWarning', 'closed');
            }
        }
    });
    "
%}

{% include option-description.html 
    key="onDialogOpened" 
    description="When the Ad Blocker action is set to 'Require Disable', this function executes after the dialog has opened, assuming you haven't overridden `openDialog`"
    requirements="function signature: `function(title, message)`" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        embeddedAdBlockerDetection: {
            onDialogOpened: function(title, message) {
                // send an event to Google Analytics (ga)
                ga('send', 'event', 'Paywall', 'AdBlockerWarning', 'displayed');
            }
        }
    });
    "
%}

{% include option-description.html 
    key="onDialogClosed" 
    description="When the Ad Blocker action is set to 'Require Disable', this function executes if the user closes the dialog, assuming you haven't overridden `openDialog` or `closeDialog`"
    requirements="function signature: `function()`" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        embeddedAdBlockerDetection: {
            onWarningClosed: function() {
                // send an event to Google Analytics (ga)
                ga('send', 'event', 'Paywall', 'AdBlockerWarning', 'closed');
            }
        }
    });
    "
%}

#### `embeddedPaywall` Object

{% include option-description.html 
    key="element" 
    description="A CSS selector that should contain the embedded paywall.  This is most likely the same place where the majority of your content resides."
    default="The setting specified in the Manage UI for this paywall."
    requirements="A valid CSS selector" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        embeddedPaywall: {
            // an article tag inside of an element with the ID of 'main'
            element: '#main article' 
        }
    });
    "
%}

{% include option-description.html 
    key="cover" 
    description="A configuration object that defines values for the fade/cover effect for the paywall."
    requirements="Please see the [embeddedPaywall.cover](#embeddedpaywallcover-object) object below." 
%}

{% include option-description.html 
    key="frame" 
    description="A configuration object that defines values for the container display of the paywall."
    requirements="Please see the [embeddedPaywall.frame](#embeddedpaywallframe-object) object below." 
%}

{% include option-description.html 
    key="onOpened" 
    description="@todo"
    default="@todo"
    requirements="Function signature: function(url, isAdSupported, adSupportedTitle, adSupportedMessage)" 
    example="
        @todo
    "
%}

{% include option-description.html 
    key="onClosed" 
    description="@todo"
    default="@todo"
    requirements="Function signature: function()" 
    example="
        @todo
    "
%}

{% include option-description.html 
    key="onHeightUpdated" 
    description="@todo"
    default="@todo"
    requirements="Function signature: function(heightData)" 
    example="
        @todo
    "
%}



##### `embeddedPaywall.cover` Object

{% include option-description.html 
    key="backgroundColor" 
    description="@todo"
    default="@todo"
    requirements="" 
    example="
        @todo
    "
%}

{% include option-description.html 
    key="visibleHeight" 
    description="@todo"
    default="@todo"
    requirements="" 
    example="
        @todo
    "
%}

{% include option-description.html 
    key="visibleHeightMode" 
    description="@todo"
    default="@todo"
    requirements="" 
    example="
        @todo
    "
%}

{% include option-description.html 
    key="zIndex" 
    description="@todo"
    default="@todo"
    requirements="" 
    example="
        @todo
    "
%}

##### `embeddedPaywall.frame` Object

{% include option-description.html 
    key="zIndex" 
    description="@todo"
    default="@todo"
    requirements="" 
    example="
        @todo
    "
%}

#### `embeddedWallet` Object

@todo figure out documentation goal

#### `embeddedConfirmation` Object

{% include option-description.html 
    key="element" 
    description="@todo"
    default="@todo"
    requirements="" 
    example="
        @todo
    "
%}

{% include option-description.html 
    key="zIndex" 
    description="@todo"
    default="@todo"
    requirements="" 
    example="
        @todo
    "
%}

{% include option-description.html 
    key="open" 
    description="@todo"
    default="@todo"
    requirements="Function signature: function(title, message)" 
    example="
        @todo
    "
%}

{% include option-description.html 
    key="close" 
    description="@todo"
    default="@todo"
    requirements="Function signature: function()" 
    example="
        @todo
    "
%}

{% include option-description.html 
    key="onOpened" 
    description="@todo"
    default="@todo"
    requirements="Function signature: function(title, message)" 
    example="
        @todo
    "
%}

{% include option-description.html 
    key="onClosed" 
    description="@todo"
    default="@todo"
    requirements="Function signature: function()" 
    example="
        @todo
    "
%}

#### `modalFrame` Object

{% include option-description.html 
    key="zIndex" 
    description="@todo"
    default="@todo"
    requirements="" 
    example="
        @todo
    "
%}

{% include option-description.html 
    key="open" 
    description="@todo"
    default="@todo"
    requirements="Function signature: function(url)" 
    example="
        @todo
    "
%}

{% include option-description.html 
    key="close" 
    description="@todo"
    default="@todo"
    requirements="Function signature: function()" 
    example="
        @todo
    "
%}

{% include option-description.html 
    key="updateHeight" 
    description="@todo"
    default="@todo"
    requirements="Function signature: function(heightData)" 
    example="
        @todo
    "
%}

#### `modalPaywall` Object

{% include option-description.html 
    key="open" 
    description="@todo"
    default="@todo"
    requirements="Function signature: function(url)" 
    example="
        @todo
    "
%}

{% include option-description.html 
    key="close" 
    description="@todo"
    default="@todo"
    requirements="Function signature: function()" 
    example="
        @todo
    "
%}
 