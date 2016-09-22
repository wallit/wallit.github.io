$(function() {
    $('.option-description-navigation a').on('click', function(e) {
        e.preventDefault();
        var $a = $(this), $box = $a.closest('.card');
        $('a', $box).removeClass('active');
        $a.addClass('active');
        $('section', $box).hide();
        $($a.data('panel'), $box).show();
    });
});