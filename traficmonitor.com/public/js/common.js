$(function() {

	"use strict";

  // Custom JS

  $('.select').styler();

  $('select').on('change', function (e) {

  	var optionSelected = $("option:selected", this);
    var valueSelected = this.value;

    window.location.href = "?lang="+valueSelected;


  });

});
