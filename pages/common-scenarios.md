---
title: Common Scenarios
permalink: /common-scenarios
---
# Common Scenarios

***Should you read this?** Yup.*

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

## Server-side Protection using Redirect

**Scenario** Regardless of how your content is created, you want to use server-side code for protection of resources for
the highest level of security.

**Solution** Using server-side code only, you will need to use a redirect to Wallit for users who are not authorized.  In this
solution, we'll use the PHP SDK on a PHP page that is trying to display a resource.

```php
<?php
// get article from your service
$article = $articleService->findOneById('14A33175-51CF-400C-8487-C5C4CEAE93E5');

// create the options for this call to wallit
$options = new \Wallit\Options\Access\GetResourceFromResourceKey();

// ID of article internally = resource key @ Wallit
$options->setResourceKey('14A33175-51CF-400C-8487-C5C4CEAE93E5');

// send something like https://your.site/read/this-article
$options->setResourceURL($article->getFullURL()); 

// create the connection using a logger and your Wallit credentials
$logger = new \Monolog\Logger('Wallit Request');
$connection = new \Wallit\Connection(
    $manageApiKey, 
    $manageSecretKey, 
    $accessApiKey, 
    $accessSecretKey, 
    new \Wallit\Request\Curl(), 
    $logger
);

// get the response object
$responseData = $connection->request($options, $options->getDataObject());

// if it's not 'Grant' - then redirect
if ($responseData->getAccessAction() != \Wallit\Data\ResourceAccess::ACCESS_ACTION_GRANT) {
    die(header('Location: ' . $data->getAccessActionUrl()));
}

// otherwise display the view or do whatever you want next
View::display('read-article', ['article'=>$article]);
```

If the user does not have access to the resource, they'll be redirected to the Wallit Access User Interface.  Otherwise, 
the request will be logged, and then you can display the content.

## Server-side Create Resources After Publication

**Scenario** You want to create an interface that allows users to add content using your website.  They should be able to
choose their pricing group before posting their content.

**Solution** Using the PHP SDK, the pricing groups will be retrieved and added to a form.  This form also is used for creating
the content.  After the form is validated, the content will be created and an identifier will be created.  Then, this identifier
and pricing group will be used to create the resource at Wallit using the PHP SDK.

First, create PHP code that will create a form.

```php
<?php
// create the connection using a logger and your Wallit credentials
$logger = new \Monolog\Logger('Wallit Request');
$connection = new \Wallit\Connection(
    $manageApiKey, 
    $manageSecretKey, 
    $accessApiKey, 
    $accessSecretKey, 
    new \Wallit\Request\Curl(), 
    $logger
);

// get the property info to retrieve the pricing groups
$options = new \Wallit\Options\Management\GetProperty();
$propertyData = $connection->request($options, $options->getDataObject());

// prepare it for our <select><option /></select> box
$pricingGroupOptions = [];
foreach ($propertyData->getPricingGroups() as $pricingGroup) {
    $pricingGroupOptions[$pricingGroup->getPricingGroupID()] = $pricingGroup->getName();
}

// create and populate form
$form = new Form\AddBlog();
$form->getInput('wallit-pricing-group')->setOptions($propertyData);

// send the form to the view
View::display('create-article', ['form'=>$form]);
```

Then, process the posted values. (Remember, this is example code, so your error handling and other parts may be "more-better" than this thing here, ya.)

```php
<?php
// It's important to do this whole process again to validate that the pricing group is
// still valid. You'd hate to run into a race condition where someone removed a pricing group
// in the Manage UI but you still attempted to post those values to the API.  Hopefully by refilling
// the form with the pricing group // values, you will be able to validate that the posted
// pricing group ID still exists.

$logger = new \Monolog\Logger('Wallit Request');
$connection = new \Wallit\Connection(
    $manageApiKey, 
    $manageSecretKey, 
    $accessApiKey, 
    $accessSecretKey, 
    new \Wallit\Request\Curl(), 
    $logger
);
$options = new \Wallit\Options\Management\GetProperty();
$propertyData = $connection->request($options, $options->getDataObject());
$pricingGroupOptions = [];
foreach ($propertyData->getPricingGroups() as $pricingGroup) {
    $pricingGroupOptions[$pricingGroup->getPricingGroupID()] = $pricingGroup->getName();
}
$form = new Form\AddBlog();
$form->getInput('wallit-pricing-group')->setOptions($propertyData);

if ($form->validate($_POST)) {
    
    // clearly extremely efficient pseudo code that handles saving form values and creating the object
    if ($blogObject = $blogService->create($form->getValues())) {   
    
        $options = new \Wallit\Options\Management\SaveResource();
        $options->setExternalKey($blogObject->getId())
            ->setName($blogObject->getTitle())
            ->setTitle($blogObject->getTitle())
            ->setPricingGroupId($form->getInput('wallit-pricing-group')->getValue());

        try {
            $result = $connection->request($options, $options->getDataObject());
            die('Successful!');
        }
        catch (\Wallit\Exception $e) {
            $form->setError($e->getMessage());
        }
    }    
}
```

## WordPress Site Needs Protection

**Scenario** Your site uses WordPress as a CMS.  You need either basic front-end protection or will be using the back-end
redirect functionality.  You may or may not have an archive of articles that need to be protected.

**Solution** Using the Wallit WordPress plugin, you can choose client-side or server-side protection.  In addition, blog posts
are created as resources immediately when purchased.  You will have a user interface to choose pricing groups or change them.  
Finally, after installation, there is a scheduled process that will go through your existing articles and push them out 
through the Manage API to be created with the default pricing group in Wallit.  

Sounds good?  Get the [Wallit WordPress Plugin Here](https://github.com/wallit/wallit-wordpress).

## Hybrid Approach Using Javascript Front-end and Back-end Protection

**Scenario** You want to take advantage of the embedded paywall and other front-end javascript features, but want extra 
security and protection for your content. It is important not to send protected content, even if it's obscured, to unauthorized
users.

**Solution** The Wallit implementation on your site will consist of two parts.  The first will be a javascript, client-side
implementation which loads the full content after authorization via ajax.  The second part is a server-side authorization
piece that will only send the full content to authorized users, otherwise it will return a preview.

Let's break this down into three pieces using our PHP SDK and our Javascript library.

First step: Send a preview (like maybe the first paragraph or a known preview.)

```php
<?php
$articleId = '14A33175-51CF-400C-8487-C5C4CEAE93E5';
$article = $articleService->findOneById($articleId);

$viewParams = [
    'title' => $article->getTitle(),
    'bodyPreview' => $article->getBodyPreview(),
    'externalKey' => $articleId
];

View::display('read-article', $viewParams);
```

Here it's important to note that we've sent a preview of the content to the view.  In addition, we've passed the external
key to the view layer - so that can be inserted into the javascript library object.

Next, let's take a look at our HTML based PHP view.

```html
<head>
    <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
    <script src="https://cdn.wallit.io/paywall.min.js"></script>
    <script type="text/javascript">
        wallit.paywall.init('<?= $view->externalKey ?>', {
            accessGranted: function(data) {
                $.get('/ajax/load-article?id=<?= $view->externalKey ?>', function(data) {
                    $('article').html(data);
                });
            }
        });
      </script>
</head>
<body>
    <section>
        <h1><?= $view->title ?></h1>
        <article>
            <?= $view->bodyPreview ?>
        </article>
    </section>
</body>
```

This code is assuming that this view is being processed by some sort of PHP code and that the `$view` variable corresponds
to the parameters that were sent in the previous section.  We've also added jQuery to make the AJAX request easier, but
that certainly is not required.

The head contains the request to Wallit javascript. This *should* happen in the head of the document.  Note how the resource's
external key is retrieved from the view object.  This is the same that was used in the previous section and how we'll refer
to this content going forward.  Then, the `accessGranted` callback is fired when a visitor is granted access to some content.

The `accessGranted` callback does an AJAX request to another script which should return the full article content.  

Let's take a look at that code that is run by the AJAX request.

```php
<?php
// create the options for this call to wallit
$options = new \Wallit\Options\Access\GetResourceFromResourceKey();

// ID of article internally = resource key @ Wallit, retrieved from call
$options->setResourceKey($_GET['id']);

// Get the URL from the referrer
$options->setResourceURL($_SERVER['HTTP_REFERER']); 

// Set the user token (the "magic" of authorization)
$options->setUserToken($_COOKIE['WallitUT']);

// create the connection using a logger and your Wallit credentials
$logger = new \Monolog\Logger('Wallit Request');
$connection = new \Wallit\Connection(
    $manageApiKey, 
    $manageSecretKey, 
    $accessApiKey, 
    $accessSecretKey, 
    new \Wallit\Request\Curl(), 
    $logger
);

// get the response object
$responseData = $connection->request($options, $options->getDataObject());

// if it's not 'Grant' - then give an error 403
if ($responseData->getAccessAction() != \Wallit\Data\ResourceAccess::ACCESS_ACTION_GRANT) {
    die(header("HTTP/1.1 403 Restricted Content"));
}

// get article from your service
$article = $articleService->findOneById($_GET['id']);

View::display('raw-article-body', ['body'=>$article->getBody()]);
```

This creates a request to the Access API using the PHP SDK.  We use the cookie value of `WallitUT` which was created and
saved by the embedded paywall's authorization request and response mechanism.  Then, if the access is granted (which it
should be), the article is retrieved and the full body is sent.  That is what the AJAX request uses to replace the content.
If the response is not of authorization granted, it's most likely a spider or some shifty character trying to access your
protected code directly.  In our case, we're polite, and just send a 403 error.  The worst thing to see would be some 
cached articles in Google saying "Stop trying to hack me, hacker!" - so we suggest being polite!

## Standard Programmer Disclaimer

Please remember these are just a common scenarios and bits of code to get you 80% of the way there.  We'd hate for you 
to be reading this and say "oh emm gee - they didn't escape their output" or "why didn't they use a loading indicator." Your 
code may differ - in fact, it should differ from this.  But, this should give you a good place to begin.  We feel this 
is a necessary disclaimer because it's so easy to want to refactor and re-code these examples every few days. But enough 
is enough, right?  Plus, since we're using pseudo code, maybe you've already picked up that this is not 100% the best way to do things... :)

## What's Next?

By now, you're probably itching to make some of your own implementation customizations.  That's why you should continue
to the next section.

[Detailed API and Library Documentation →]({{site.baseurl}}/api){: .btn}
