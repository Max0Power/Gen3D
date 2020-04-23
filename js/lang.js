"use strict";

jQuery(function($) {
    $.i18n().load( {
        'en': 'jquery.i18n/languages/en.json',
        'ja': 'jquery.i18n/languages/ja.json'
    } ).done(function() {
        $('.switch-locale').on('click', 'a', function(e) {
            e.preventDefault();
            $.i18n().locale = $(this).data('locale');
            $('body').i18n();
        });
    });
});
