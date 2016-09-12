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
        });
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
        });
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
        })
    }
    
    return {
        init: function() {
            addMethodHandler();
            addTimeHandlers();
            addURLHandler();
            setCurrentTime();
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