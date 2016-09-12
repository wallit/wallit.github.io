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
     * Set up the request time selectors
     * @type {{}}
     */
    var requestTime = {
        $month: $('#month'),
        $day: $('#day'),
        $year: $('#year'),
        $hour: $('#hour'),
        $min: $('#min'),
        $sec: $('#sec')
    };
    
    /**
     * This function sets the current time into the chooser
     * 
     * This just makes it easier for them to select the proper date
     */
    function setCurrentTime()
    {
        var date = new Date();
        requestTime.$month.val(date.getMonth());
        requestTime.$day.val(date.getDate());
        requestTime.$year.val(date.getFullYear());
        requestTime.$hour.val(date.getHours());
        requestTime.$min.val(date.getMinutes());
        requestTime.$sec.val(date.getSeconds());
        
        requestTime.$sec.trigger('change');
    }

    /**
     * Handle the updated time display
     */
    function addTimeHandlers()
    {
        var $timeDisplay = $('#generated-values-request-time');
        $('#request-time-group select').on('change', function() {
            $timeDisplay.html(function() {
                return (newDate = new Date(
                    requestTime.$year.val(),
                    requestTime.$month.val(),
                    requestTime.$day.val(),
                    requestTime.$hour.val(),
                    requestTime.$min.val(),
                    requestTime.$sec.val()
                )).toUTCString();
            });
        });
    }

    /**
     * Handles the changes to the method drop down
     */
    function addMethodHandler()
    {
        var $methodDisplay = $('#generated-values-request-method');
        $('#request-method').on('change', function() {
            $methodDisplay.html($(this).val());
        });
    }

    /**
     * Handles URLs
     */
    function addURLHandler()
    {
        var $uriDisplay = $('#generated-values-request-uri');
        $('#url').on('change', function() {
            var $url = $(this);
            $uriDisplay.html(function() {
                if ($url.get(0).validity.valid) {
                    var a = document.createElement('a');
                    a.href = $url.val();
                    return a.pathname;
                }
                else {
                    return 'N/A';
                }                
            });
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