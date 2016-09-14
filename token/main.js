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
     * Th display of the params
     * @type {any}
     */
    var $paramsDisplay = $('#generated-values-request-parameters');


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
        $hashedToken.html(function() {
            if ($secret.val() && tokenValue.method && tokenValue.time && tokenValue.uri) {
                var shaObj = new jsSHA("SHA-256", "TEXT");
                shaObj.setHMACKey($secret.val(), "TEXT");
                shaObj.update(getTokenizableString());
                return shaObj.getHMAC("B64");
            }
            else {
                return 'N/A';
            }
        });
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
    
    return {
        init: function() {
            addMethodHandler();
            addTimeHandlers();
            addURLHandler();
            addParameterHandler();
            addSecretHandler();
            setCurrentTime();
            addParameterListManagementHandler();
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
