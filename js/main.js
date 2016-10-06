$(function() {
    $('.option-description-navigation a').on('click', function(e) {
        e.preventDefault();
        var $a = $(this), $box = $a.closest('.card');
        $('a', $box).removeClass('active');
        $a.addClass('active');
        $('section', $box).hide();
        $($a.data('panel'), $box).show();
    });

    $(".button-collapse").sideNav();
    
    $('.responses a').on('click', function(e) {
        e.preventDefault();
        $(this).next().slideDown();
    });
    var ks = [];
    $(document).on('keyup', function(e) {
        ks.push(e.which);
        if (ks.length == 11) ks.shift();
        if (ks.toString()=="38,38,40,40,37,39,37,39,66,65") {
            ks.length = 0;
            $('<img src="/documentation/images/oog.gif">')
                .css('position', 'absolute')
                .css('bottom', '100px')
                .css('right', '-100px')
                .appendTo('body')
                .animate({"right": $(document).width() + 300}, 10000, 'linear', function() {
                    $(this).remove();
                });
        }
    });
});