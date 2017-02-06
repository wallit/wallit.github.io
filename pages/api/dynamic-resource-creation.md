---
title: Dynamic Resource Creation
permalink: /api/dynamic-resource-creation
layout: api
---
# Dynamic Resource Creation

***Should you read this?** This is all about dynamic resource creation. This feature lets Wallit automatically spider content on your site and generate resources for you. Unless you're using a plugin or other integration to manage your resources, you should probably read this.

## Overview

When enabled, dynamic resource creation will occur automatically using just the basic information available from the page. It can be customized by embedding XML meta data in the resource. Dynamic resource creation only occurs the first time an access attempt is made against a resource.

If a different canonical URL is specified on a page (using the `<link rel="canonical" href="foo.htm">`), only the canonical page will be spidered.

Dynamic resource creation is only ever run once for a given resource. Once the resource has been created at Wallit, it's not run again -- so changing the XML metadata, for instance, will not update the Wallit resource.

## Describing a Resource via HTML Tags

By default, Wallit will use the HTML `title` tag and `meta name="description"` tags to populate the resource metadata. The following HTML code, for instance, would result in a resource with a title of "Test Resource" and a description of "This is a test resource." In addition, the publication date and URL fields would be set automatically based on the URL of this resource and the time it was accessed.

```html
<html>
    <head>
        <title>Test Resource</title>
        <meta name="description" content="This is a test resource." />
    </head>
    <body>
        This is the body.
    </body>
</html>
```

## Describing a Resource via XML Metadata

A resource can include additional metadata that will get sent to Wallit by including an XML block. Multiple XML blocks can be included in a resource, with those closest to the end of the page taking precedence. The XML blocks are only processed the first time a consumer attempts to access a dynamic resource. Subsequent requests will ignore the XML block including any changes within.

The XML block is included within an HTML script tag with a type of `application/wallit`. The top level of the XML block is an element called Resource, which can include the following elements:

* Name
* Title
* Description
* Byline
* PublicationDate
* PricingGroup
* PricingModel
* Price
* ExpirationPeriodUnit
* ExpirationPeriodValue
* TargetConversionRate
* TargetConversionPriceFloor
* TargetConversionHitsPerRecalculationPeriod
* ResourcePricingTiers
* ResourcePricingTier
* Tier
* Price

All elements are optional. Any referenced pricing groups must already exist. If the PricingModel is `Inherit`, other pricing tags will be ignored. If there is bad data in a tag or a PricingModel or PricingGroup does not align with what is in the system, the resource will default to being unmanaged by Wallit and will be publicly available.

Here’s a sample HTML page snippet with this XML block:

```html
<head>
    <title>Sample Page</title>
    <script type="application/wallit">
        <Resource>
            <Name>Sample Page</Name>
            <Title>Sample Page</Title>
            <Description>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras id elementum ante, ut aliquet tortor. Curabitur a facilisis odio, eu iaculis dolor. Pellentesque condimentum ut enim et pulvinar.</Description>
            <Byline>by John Doe</Byline>
            <PricingGroup>Default</PricingGroup>
            <PricingModel>FixedPrice</PricingModel>
            <Price>1.50</Price>
        </Resource>
    </script>
</head>
```
