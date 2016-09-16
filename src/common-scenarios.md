# Common Scenarios

**Should you read this?** Yup.

Chances are, if this is your first time here, you've skipped right to this page.  Good choice!  We're going to show you
some common scenarios and the Wallit integrations needed to achieve them.  A good ol' copy+paste of one of these 
examples should get you 90% of the way to your end goal in most cases.  If you have questions or wonder how/why one of
these examples work, that's the sign that you need to move on to the real meat of our documentation!

## Client-side Protection, Dynamically Create Resources

**Scenario** You are going to protect all of your content with a javascript solution.  When new content is added to your
site, a resource is automatically created in Wallit using your default settings.

**Solution** To do this, there are two steps.  First, you'll have to confirm that "Automatically Create Resources" is enabled
for your property.  Then, using your desired paywall API key for your property, insert the Wallit javascript in the head
of your HTML.

### Confirm Setting for Automatically Create Resources

In order to do this, you'll need to go to the Manage UI and verify this setting.  For instructions on how to do that,
visit [this support document](https://wallit.desk.com/customer/portal/articles/2572099-automatically-add-your-content-to-wallit).

### Insert Javascript Into Head of Document

Here's an example of an HTML document with the javascript library in use for this particular scenario:

```html
<html>
    <head>
        <title>My Amazing Article | Publisher Times</title>
        <script src="https://cdn.wallit.io/paywall.min.js"></script>
          <script type="text/javascript">
            Wallit.paywall.init('b865156f-9e0d-48b6-a2a0-097456f689ec');
          </script>
        <!-- other content here -->
    </head>
    <body>
        <!-- your main website code -->
    </body>
</html>
```

In this example, `b865156f-9e0d-48b6-a2a0-097456f689ec` is your API key and there are no options passed to the library for
customization.

