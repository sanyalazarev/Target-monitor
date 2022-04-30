$(".logout").click(function(){
	deleteCookie("hash");
	window.location.href = "/login";
});

function showNotify(status, text){
	$.notifyClose();
	
	$.notify(text, {
		type:status,
		placement: {from: "top", align: "center"},
		offset: 0,
		delay: 300, 
		timer: 1000,
		animate: {
			enter: 'animated fadeInDown',
			exit: 'animated fadeOutUp'
		},
		template: '<div data-notify="container" class="alert alert-{0} text-center" role="alert">{2}</div>'
	});
}

function getFormData($form) {
	var data = {};
	
	$form.find("input[type=text], input[type=password], input[type=hidden], select, textarea").each(function(){
		if($(this).attr("name"))
			data[$(this).attr("name")] = $(this).val();
	});
	
	$form.find("input[type=radio]").each(function(){
		if($(this).is(':checked'))
			data[$(this).attr("name")] = $(this).val();
	});
	
	return data;
}

console.log(navigator);