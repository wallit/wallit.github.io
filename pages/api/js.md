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

#### `init()` Method Object Properties

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
    description="This function is called when the user is granted access to the current resource.  See the [resourceAccessData object](#resourceaccessdata-object) for details about the incoming object properties."
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
    description="This function is called when the user is denied access to the current resource.  See the [resourceAccessData object](#resourceaccessdata-object) for details about the incoming object properties."
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
    description="This function is executed after the embedded paywall has opened on the page."
    requirements="function signature: `function(url, isAdSupported, adSupportedTitle, adSupportedMessage)`" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        embeddedPaywall: {
            /**
             * @param {string} url The URL the embedded paywall is opening in the iFrame
             * @param {boolean} isAdSupported @todo
             * @param {string} adSupportedTitle @todo
             * @param {string} adSupportedMessage @todo
             */
            onOpened: function(url, isAdSupported, adSupportedTitle, adSupportedMessage) {
                // @todo
            }
        }
    });
    "
%}

{% include option-description.html 
    key="onHeightUpdated" 
    description="This function executes when the iFrame adjusts its height based on the content loaded inside of it.  You may want to use this callback if your page design is not responding properly to these size changes."
    requirements="function signature: `function(heightData)`" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        embeddedPaywall: {
            /**
             * @param {object} heightData An object that contains height measurements of the current iframe's box model
            onHeightUpdated: function(heightData) {
                console.log('clientHeight', heightData.clientHeight);
                console.log('offsetHeight', heightData.offsetHeight);
                console.log('scrollHeight', heightData.scrollHeight);
            }
        }
    });
    "
%}

##### `embeddedPaywall.cover` Object

{% include option-description.html 
    key="backgroundColor" 
    description="The base hex HTML color of the element that covers up the protected content."
    default="The Background Color setting in the Manage UI for this paywall."
    requirements="valid HTML hex color including #" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        embeddedPaywall: {
            cover: {
                backgroundColor: '#336699'
            }
        }
    });
    "
%}

{% include option-description.html 
    key="visibleHeight" 
    description="This indicates how much of the visible content will be displayed.  Basically, after this value, the embedded paywall begins.
                 Keep in mind, though, that the cover will fade this content, but it will still be visible to some extent.
                 This number represents pixels or percent, depending on the setting of `embeddedPaywall.cover.visibleHeightMode` 
    "
    default="The Visible Height value in the Manage UI for this paywall."
    requirements="positive integer if indicating pixels;;positive float if indicating percent" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        embeddedPaywall: {
            cover: {
                visibleHeight: 300,
                visibleHeightMode: 'Pixels'
            }
        }
    });
    "
%}

{% include option-description.html 
    key="visibleHeightMode" 
    description="This is the unit of the `embeddedPaywall.cover.visibleHeightMode` value."
    default="The Visible Height Mode value in the Manage UI for this paywall."
    requirements="Must be exactly one of the two available values."
    enum="Pixels;;Percent"
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        embeddedPaywall: {
            cover: {
                visibleHeight: 21.5,
                visibleHeightMode: 'Percent'
            }
        }
    });
    "
%}

{% include option-description.html 
    key="zIndex" 
    description="This is the CSS z-index value that is applied to the content covering object."
    default="The Z-Index value under the Cover section in the Manage UI for this paywall."
    requirements="Integer" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        embeddedPaywall: {
            cover: {
                zIndex: 300000
            }
        }
    });
    "
%}

##### `embeddedPaywall.frame` Object

{% include option-description.html 
    key="zIndex"
    description="This is the CSS z-index value that is applied to the embedded paywall's iframe wrapper." 
    default="The Z-Index value under the Frame section in the Manage UI for this paywall."
    requirements="Integer" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        embeddedPaywall: {
            frame: {
                zIndex: 300001
            }
        }
    });
    "
%}

#### `embeddedConfirmation` Object

{% include option-description.html 
    key="element" 
    description="The CSS selector of an element to place the confirmation or success title and message.  This is used when a visitor has been granted access to a resource after previously seeing a paywall."
    default="The element specified in the Embedded Confirmation section of the Manage UI for this paywall."
    requirements="A valid CSS selector" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        embeddedConfirmation: {
            element: '#successMessage'
        }
    });
    "
%}

{% include option-description.html 
    key="zIndex"
    description="This is the CSS z-index value that is applied to the embedded confirmation object.  If you have control of your own CSS for your `embeddedConfirmation.element` object, you may not need to use this." 
    default="The Z-Index field value in the Embedded Confirmation section of Manage UI for this paywall."
    requirements="Integer" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        embeddedConfirmation: {
            zIndex: 400
        }
    });
    "
%}

{% include option-description.html 
    key="onOpened" 
    description="This function is called after the embedded confirmation has been displayed to the user, assuming a valid selector is used for the element."
    requirements="function signature: `function(title, message)`" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        embeddedConfirmation: {
            onOpened: function(title, message) {
                // perhaps send an event to your Google Analytics
                ga('send', 'event', 'Paywall', 'Purchase', 'completed');
            }
        }
    });
    "
%}

{% include option-description.html 
    key="onClosed" 
    description="This function is called after the embedded confirmation has been closed, assuming a valid selector is used for the element."
    requirements="function signature: `function()`" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        embeddedConfirmation: {
            onClosed: function() {
                // perhaps scroll the user to the beginning of the content
                window.location.href = '#begin-reading';
            }
        }
    });
    "
%}

#### `modalFrame` Object

{% include option-description.html 
    key="zIndex" 
    description="This is the CSS z-index value that is applied to the modal paywall's wrapper."
    default="The Z-Index field of the Modal Placement section of the Manage UI for this paywall."
    requirements="Integer" 
    example="
    wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
        modalFrame: {
            zIndex: 300001
        }
    });
    "
%}

#### `resourceAccessData` Object

This object contains the information about the grant or deny request as it pertains to this resource and this user.  This is an incoming parameter to some functions above.

| Key Name | Type | Description |
| -------- | ---- | ----------- |
| `UserToken` | String | Used internally by Wallit. |
| `PropertyName` | String | The internal name of merchant Property. |
| `ResourceName` | String | The internal name of this resource. |
| `FirstName` | String | If authenticated, the user's first name |
| `IsAnonymousUser` | Boolean | Whether the current user is anonymous (true) or authenticated (false). |
| `WalletBalance` | Decimal (USD) | Current user's account balance. |
| `PictureURL` | String | If user signed in with social media link, the URL to their profile picture. |
| `Quota` | Object | Meter details, [see object below](#resourceaccessdataquota-object). |
| `Subscription` | Object | Subscription details, [see object below](#resourceaccessdatasubscription-object). |
| `Purchase` | Object | Purchase details, [see object below](#resourceaccessdatapurchase-object).  |
| `AccessReason` | String | A value that indicates the reason why the user has access. [See possible values and descriptions](#resourceaccessdataaccessreason-values). |
| `AccessActionURL` | String | The URL that the iframe or paywall is loading. |
| `AdBlockerStatus` | String | Indicates what Wallit has determined about any potential ad-blockers on this page.  [See possible values and descriptions](#resourceaccessdataadblockerstatus-values) |
| `IsNoCost` | Boolean | A true value means that no payment is required (pricing model could be free, price could be $0.00, or content is ad-supported). | 
| `IsAdSupported` | Boolean | A true value means that this resource is Ad Supported. |
| `AdSupportedMessageTitle` | String | The message title that is meant to be displayed if this ad-supported content detects ads are being blocked. |
| `AdSupportedMessage` | String | The message title that is meant to be displayed if this ad-supported content detects ads are being blocked. |

##### `resourceAccessData.Quota` Object

This object contains information about the current meter or quota of views.

| Key Name | Type | Description |
| -------- | ---- | ----------- | 
| `IsEnabled` | Boolean | The property wide setting of whether metering is enabled or not. |
| `HitCount` | Integer | The number of quota-enabled resources this specific user has visited. | 
| `AllowedHits` | Integer | The maximum number of free quota-enabled resources per user, per period. |
| `PeriodStartDate` | String Datetime ISO 8601 | The beginning of the period for this quota or meter. |
| `IsMet` | Boolean | Will be true when the quota is met. |

##### `resourceAccessData.Subscription` Object

This object represents a current subscription that may be applicable to access to this resource.  Even if the subscription
is expired, but previously would have allowed access, it will be defined here.

| Key Name | Type | Description |
| -------- | ---- | ----------- |
| `IsExpired` | Boolean | This indicates whether the current subscription access is expired or not. |
| `ExpirationDate` | String Datetime ISO 8601 | End date of current subscription. |
| `IsCurrent` | Boolean | Whether the current subscription is valid or not, if so, resource access is granted. |
| `SubscriptionGroupID` | GUID | The unique identifier of this subscription. |

##### `resourceAccessData.Purchase` Object

This object contains the details about the current purchase of this content, if applicable.

@todo details coming soon.

##### `resourceAccessData.AccessReason` Values

| Value | Description |
| ----- | ----------- |
| `Deny` | Access not granted. |
| `Quota` | Access granted, quota not reached. |
| `Subscription` | Access granted, valid subscription. |
| `Purchase` | Access granted due to the completion of a purchase. |
| `Free` | Access granted for free resource. |
| `PropertyUser` | Access granted when an authenticated user's role is Property Guest. |
| `AdSupported` | Access granted by ad-supported resource with no ad-blocker detected. |

##### `resourceAccessData.AdBlockerStatus` Values

@todo details coming soon.

## Javascript Library User Log out

The `logOut()` method will log out the current user. During this process, a redirect will be issued in the browser to finish the log out procedure.
After this, the user will be redirected back to the page that the `logOut()` method was called.

#### `logOut()` Top Level Method Signature

{% include option-description.html 
    key="logOut" 
    description="This method logs the user out of Wallit."
    requirements="function signature: `function(url)`" 
    example="
    /**
     * @param {string} url The URL to redirect the user to after log out, otherwise current page.
     */
    wallit.paywall.logOut('https://my.site/logged-out-of-wallit.html');
    "
%}

## Frequently Asked Questions / Scenarios

This section features examples based on some of the Frequently Asked Questions when integrating the Javascript Library.

### My Site Uses Pagination For Long Articles

Perhaps your site uses pagination for long articles.  You do not want to create separate resources for each page.  Instead,
you can override the resourceKey on each page to be the shared one.

Imagine you have the following pages:

* https://my.site/news/long-article/page1
* https://my.site/news/long-article/page2
* https://my.site/news/long-article/page3

You'll want to make a `resourceKey` of just the main part of the URL.

```javascript
wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
    resourceKey: '/news/long-article'
});
```

You can also create a function that returns a string.  Imagine the format is the same as above, where the pagination is
the last section of the string.

```javascript
wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
    resourceKey: function() {
        var urlParts = window.location.pathname.split('/');
        urlParts.pop();
        var newUrl = urlParts.join('/');
        return newUrl.substr(newUrl.length - 50);
    }
});
```

### I Need to Replace My Content on Access Granted With the Full Content

If you're using a system where your site sends a preview of the content to the browser, but not the entire thing, you
will need to load the entire content using an AJAX request.  In this case, we're using jQuery to save some time with the
ajax requests.  The `article` HTML element holds our content to be replaced.

```javascript
wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec', {
    accessGranted: function(data) {
        $.get('/ajax/load-article?id=12345', function(data) {
            $('article').html(data);
        });
    }
});
```