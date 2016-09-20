/**
 * main javascript file for token generator
 */

var wallit = wallit || {};
wallit.documentation = wallit.documentation || {};

/**
 * The main module for this tool
 * @type {Function}
 */
wallit.documentation.tokenValidator = (function() {

    /**
     * Objects for the token values
     * @type {{$requestMethod: (any), requestTime: {$month: (any), $day: (any), $year: (any), $hour: (any), $min: (any), $sec: (any)}, $requestURL: (any)}}
     */
    var tokenBuilder = {
        $requestMethod: $('#request-method'),
        requestTime: {
            $month: $('#month'),
            $day: $('#day'),
            $year: $('#year'),
            $hour: $('#hour'),
            $min: $('#min'),
            $sec: $('#sec')
        },
        $requestURL: $('#request-url')
    };

    /**
     * Token values
     * @type {{method: string, time: string, uri: string, params: string}}
     */
    var tokenValue = {
        method: '',
        time: '',
        uri: '',
        params: ''
    };

    /**
     * The display for the token values before they're hashed
     * @type {any}
     */
    var $tokenValueDisplay = $('#generated-values-combined');

    /**
     * Hashed token value
     * @type {any}
     */
    var $hashedToken = $('#hashed-token');

    /**
     * The secret key
     * @type {any}
     */
    var $secret = $('#secret');

    /**
     * The container for the parameter list
     * @type {any}
     */
    var $parameterListContainer = $('#request-parameters-content');

    /**
     * The display of the params
     * @type {any}
     */
    var $paramsDisplay = $('#generated-values-request-parameters');

    /**
     * The help link display area
     * @type {any}
     */
    var $helpLink = $('#help-link');

    /**
     * The form for testing the token
     * @type {any}
     */
    var $testTokenForm = $('#test-token');

    /**
     * The button that we use to display some progress
     * @type {any}
     */
    var $testTokenFormButton = $('.btn', $testTokenForm);
    
    /**
     * This function sets the current time into the chooser
     * 
     * This just makes it easier for them to select the proper date
     */
    function setCurrentTime()
    {
        var date = new Date();
        tokenBuilder.requestTime.$month.val(date.getMonth());
        tokenBuilder.requestTime.$day.val(date.getDate());
        tokenBuilder.requestTime.$year.val(date.getFullYear());
        tokenBuilder.requestTime.$hour.val(date.getHours());
        tokenBuilder.requestTime.$min.val(date.getMinutes());
        tokenBuilder.requestTime.$sec.val(date.getSeconds());

        tokenBuilder.requestTime.$sec.trigger('change');
    }

    /**
     * Handle the updated time display
     */
    function addTimeHandlers()
    {
        var $timeDisplay = $('#generated-values-request-time');
        $('#request-time-group select').on('change', function() {
            var dateString = (newDate = new Date(
                tokenBuilder.requestTime.$year.val(),
                tokenBuilder.requestTime.$month.val(),
                tokenBuilder.requestTime.$day.val(),
                tokenBuilder.requestTime.$hour.val(),
                tokenBuilder.requestTime.$min.val(),
                tokenBuilder.requestTime.$sec.val()
            )).toUTCString();
            
            $timeDisplay.html(dateString);
            tokenValue.time = dateString;
        }).on('change', updateTokenValuesDisplayBox).on('change', updateHashedTokenDisplay);
    }

    /**
     * Handles the changes to the method drop down
     */
    function addMethodHandler()
    {
        var $methodDisplay = $('#generated-values-request-method');
        $('#request-method').on('change', function() {
            var methodString = $(this).val();
            
            $methodDisplay.html(methodString);
            tokenValue.method = methodString;
            
            if (methodString == 'GET') {
                $parameterListContainer.slideUp(function() {
                    var $rows = $('.row', $parameterListContainer);
                    $('input', $rows.first()).val('');
                    $rows.not(':first').remove();
                    recalculateParameters();
                });
            }
            else {
                $parameterListContainer.slideDown();
            }
        }).on('change', updateTokenValuesDisplayBox).on('change', updateHashedTokenDisplay);
    }

    /**
     * Handles URLs
     */
    function addURLHandler()
    {
        var $uriDisplay = $('#generated-values-request-uri');
        $('#request-url').on('change', function() {
            var uriString = '', uriDisplay = 'N/A';
            if ($(this).get(0).validity.valid) {
                var a = document.createElement('a');
                a.href = this.value;
                uriString = uriDisplay = a.pathname;
            }
            
            $uriDisplay.html(uriDisplay);
            tokenValue.uri = uriString;
        }).on('change', updateTokenValuesDisplayBox).on('change', updateHashedTokenDisplay);
    }

    /**
     * Handles changes to the parameters
     */
    function addParameterHandler()
    {        
        $('#request-parameters-content').on('change', 'input', function() {
            recalculateParameters();
            updateTokenValuesDisplayBox();
            updateHashedTokenDisplay();
        });
    }
    
    /**
     * If secret is changed, call the token updater
     */
    function addSecretHandler()
    {
        $secret.on('change', updateHashedTokenDisplay);
    }

    /**
     * This is used to update the token display box
     */
    function updateTokenValuesDisplayBox()
    {
        $tokenValueDisplay.html(function() {
            if (tokenValue.method && tokenValue.time && tokenValue.uri) {
                var value = getTokenizableString();
                if (!tokenValue.params) {
                    value += "\n"; // this is necessary to make the display look right with whitespace: pre
                }
                return value;
            }
            else {
                return 'N/A';
            }
        });
    }

    /**
     * Display the hashed token value
     */
    function updateHashedTokenDisplay()
    {
        var value = 'N/A';
        if ($secret.val() && tokenValue.method && tokenValue.time && tokenValue.uri) {
            var shaObj = new jsSHA("SHA-256", "TEXT");
            shaObj.setHMACKey($secret.val(), "TEXT");
            shaObj.update(getTokenizableString());
            value = shaObj.getHMAC("B64");
            $helpLink.slideDown();
        }
        else {
            $helpLink.slideUp();
        }

        $hashedToken.html(value);
    }

    /**
     * This gets the tokenizable values combined
     */
    function getTokenizableString()
    {
        return tokenValue.method + "\n" + tokenValue.time + "\n" + tokenValue.uri + "\n" + tokenValue.params;
    }

    /**
     * handles adding and removing rows
     */
    function addParameterListManagementHandler()
    {
        $('#request-parameters-content').on('click', '.add', function(e) {
            e.preventDefault();
            var $row = $(this).closest('.row');
            var $newRow = $row.clone();
            $('input', $newRow).val('');
            $row.after($newRow);
        }).on('click', '.delete', function(e) {
            e.preventDefault();
            var $row = $(this).closest('.row');
            $row.remove();
            recalculateParameters();
            updateTokenValuesDisplayBox();
            updateHashedTokenDisplay();
        });
    }

    /**
     * This handles recalculating the request parameters and dispalying them properly on the screen and as part
     * of the token
     */
    function recalculateParameters()
    {
        var parameters = [];
        $('#request-parameters-content .row').each(function(idx) {
            var $key = $('input:first', this),
                $value = $('input:last', this);
            if ($key.val()) {
                parameters.push({
                    key: $key.val().toLowerCase(),
                    value: $value.val().toLowerCase()
                });
            }
        });
        parameters.sort(function(a, b) {
            if (a.key < b.key) return -1;
            if (a.key > b.key) return 1;
            return 0;
        });
        
        var parameterString = parameters.map(function(parameter, idx) {
            return parameter.key + '=' + parameter.value;
        }).join('&');

        tokenValue.params = parameterString;
        $paramsDisplay.html(parameterString ? parameterString : 'N/A');
    }

    /**
     * Add the token tester handler
     */
    function addTokenTesterHandler()
    {
        /** define some displays **/
        var $testProgress = $('#test-progress'), $progressDisplay = $('#test-count-progress'), $results = $('#results');

        /** used to "re-enable" the form for the next call or a message display **/
        var resetTokenTesterForm = function(callback) {
            $testTokenFormButton.removeClass('disabled').html($testTokenFormButton.data('message-original'));
            $testProgress.slideUp(callback);
        };
        
        /** get rid of results **/
        var resetResults = function() {
            $results.html('').slideUp();
            progress = 0;
        };
        
        /** show results after re-enabling the form **/
        var showResults = function(message) {
            resetTokenTesterForm(function() {
                $('#results').html(message).slideDown()
            });
        };
        
        /** handle the display of the progress / and increases of it **/
        var progress = 0, increaseProgress = function() {
            progress++;
            $progressDisplay.html(progress);
        };
        
        /** initialize the modal for if they need help **/
        $('#help-link a').leanModal({
            complete: resetTokenTesterForm
        });

        /** runs the test if the token is submitted **/
        $('#test-token').on('submit', function(e) {
            e.preventDefault();
            $testTokenFormButton.addClass('disabled').html($testTokenFormButton.data('message-in-progress'));
            resetResults();
            
            $testProgress.slideDown();
            var yourToken = $('#your-token').val();

            // check length
            increaseProgress();
            if (yourToken.length != 44) {
                showResults('The token is not long enough.  It should be 44 characters in length. Perhaps it is truncated?  Another thing to consider: make sure you have used binary HMAC and base64 encoding');
                return;
            }
            
            // @todo here is the area to test more of them
            
            // display a message that we can't help them
            showResults("We weren't able to figure out what's wrong here.  If you're still stuck, please contact us and our integration team will try to help!");
        });
    }
    
    return {
        init: function() {
            addMethodHandler();
            addTimeHandlers();
            addURLHandler();
            addParameterHandler();
            addSecretHandler();
            setCurrentTime();
            addParameterListManagementHandler();
            addTokenTesterHandler();
        }
    }
})();



$(function() {
    $('#timezone').html(function() {
        var split = new Date().toString().split(" ");
        return split[split.length - 2] + " " + split[split.length - 1];
    });
    wallit.documentation.tokenValidator.init();
    $('select').material_select();
});
