"use strict";

jQuery(function($) {
    $.i18n().load( {
        'en': 'jquery.i18n/languages/en.json',
        'ja': 'jquery.i18n/languages/ja.json'
    } ).done(function() {
        $('.switch-locale').on('click', 'a', function(e) {
            e.preventDefault();
            $.i18n().locale = $(this).data('locale');
	    updateLocales();
        });
    });

    $('.switch-locale').on('click', 'a', function(e) {
	e.preventDefault();    
	var that = $(this);
	that.parent().parent().find('.active').removeClass('active');
	that.parent().addClass('active');
    });
});

function updateLocales() {
    $('body').i18n();
    
    var colors = $('.color');
    for (var i = 0; i < colors.length; i++) {
	var numbers = colors[i].text.match(/\d+/g).map(Number);
	colors[i].text = $.i18n("texture-opt-color-n", numbers[0]);
    }

    var customs = $('.custom');
    for (var j = 0; j < customs.length; j++) {
	var numbers = customs[j].text.match(/\d+/g).map(Number);
	customs[j].text = $.i18n("texture-opt-custom-n", numbers[0]);
    }

    var components = myLayout.root.getItemsByType("component");
    for (var k = 0; k < components.length; k++) {
	var component = components[k];
	if (component.componentName.includes("-react-")) {
	    component.setTitle($.i18n(component.config.component));
	} else {
	    component.setTitle($.i18n(component.componentName));
	}
    }
    
    // päivitä raahattavien komponenttien otsikot
    if (typeof mapComponent !== 'undefined') {
	mapComponent.title = $.i18n(mapComponent.component);
    }
    if (typeof noiseControllerComponent !== 'undefined') {
	noiseControllerComponent.title = $.i18n(noiseControllerComponent.componentName);
    }
    if (typeof userInputComponent !== 'undefined') {
	userInputComponent.title = $.i18n(userInputComponent.componentName);
    }	
    controller3dComponent.title = $.i18n(controller3dComponent.componentName);
    textureViewerComponent.title = $.i18n(textureViewerComponent.componentName);
    textureEditorComponent.title = $.i18n(textureEditorComponent.componentName);
    modelComponent.title = $.i18n(modelComponent.componentName);
}
